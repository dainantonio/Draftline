'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ChevronLeft, 
  Save, 
  Share2, 
  History, 
  GitBranch, 
  Sparkles, 
  MessageSquare, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2, 
  Users, 
  AlertCircle,
  Activity,
  Undo,
  Redo,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BranchPanel from './BranchPanel';
import VersionTimeline from './VersionTimeline';
import AIAssistant from './AIAssistant';
import AuditLog from './AuditLog';
import MergeModal from './MergeModal';
import CompareView from './CompareView';
import nspell from 'nspell';

// Mock dictionary data for demonstration since dictionary-en is not browser-compatible
const MOCK_DICT = `
SET UTF-8
TRY esianrtolcdupmghbyfvkwzqxjw
# Common words for demo
the
be
to
of
and
a
in
that
have
I
it
for
not
on
with
he
as
you
do
at
this
but
his
by
from
they
we
say
her
she
or
an
will
my
one
all
would
there
their
what
so
up
out
if
about
who
get
which
go
me
when
make
can
like
time
no
just
him
know
take
people
into
year
your
good
some
could
them
see
other
than
then
now
look
only
come
its
over
think
also
back
after
use
two
how
our
work
first
well
way
even
new
want
because
any
these
give
day
most
us
marketing
strategy
executive
summary
goal
increase
brand
awareness
across
digital
channels
maintaining
below
focus
high-intent
search
terms
strategic
influencer
partnerships
key
objectives
expand
social
reach
launch
major
campaigns
linkedin
twitter
content
engine
produce
quality
whitepapers
blog
posts
seo
optimization
improve
ranking
top
industry
keywords
budget
allocation
paid
production
events
webinars
note
document
contains
deliberate
typos
test
checker
`;

interface DocumentEditorProps {
  doc: {
    id: string;
    title: string;
    lastEdited?: string;
    versionCount?: number;
    branches?: any[];
  };
  goBack: () => void;
}

export default function DocumentEditor({ doc, goBack }: DocumentEditorProps) {
  const [activePanel, setActivePanel] = useState<'none' | 'branches' | 'history' | 'audit'>('none');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  const [content, setContent] = useState(doc?.branches?.[0]?.versions?.[0]?.content || `
# Q3 Marketing Strategy

## Executive Summary
Our goal for Q3 is to increase brand awareness by 25% across digital channels while maintaining a CAC below $45. We will focus on high-intent search terms and strategic influencer partnerships.

## Key Objectives
1. **Expand Social Reach**: Launch 3 major campaigns on LinkedIn and Twitter.
2. **Content Engine**: Produce 12 high-quality whitepapers and 24 blog posts.
3. **SEO Optimization**: Improve ranking for top 50 industry keywords.

## Budget Allocation
- Paid Search: 40%
- Content Production: 30%
- Influencer Marketing: 20%
- Events & Webinars: 10%

Note: This documnt contains some deliberat typos like "documnt" and "deliberat" to test the spell checker.
  `);

  const [title, setTitle] = useState(doc?.title || 'Untitled Document');
  const [author, setAuthor] = useState('Dain Russell');
  const [tags, setTags] = useState('Marketing, Strategy, Q3');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Undo/Redo History
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const handleContentChange = (newContent: string) => {
    if (newContent === content) return;
    setUndoStack(prev => [...prev, content].slice(-50)); // Limit history to 50 steps
    setRedoStack([]);
    setContent(newContent);
    setSaveStatus('saving');
  };

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prevContent = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, content]);
    setUndoStack(prev => prev.slice(0, -1));
    setContent(prevContent);
    setSaveStatus('saving');
  }, [undoStack, content]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextContent = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, content]);
    setRedoStack(prev => prev.slice(0, -1));
    setContent(nextContent);
    setSaveStatus('saving');
  }, [redoStack, content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const socketRef = useRef<Socket | null>(null);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1);

  const spellChecker = useMemo(() => {
    return nspell(MOCK_DICT);
  }, []);

  const [suggestions, setSuggestions] = useState<{ word: string; list: string[]; x: number; y: number } | null>(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeBranch, setMergeBranch] = useState<{ name: string; content: string } | null>(null);
  const [showCompareView, setShowCompareView] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{ v1: any; v2: any } | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io();
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join-document', doc.id);
    });

    newSocket.on('document-update', (data: any) => {
      setIsRemoteUpdate(true);
      if (data.content !== undefined) setContent(data.content);
      if (data.title !== undefined) setTitle(data.title);
      if (data.author !== undefined) setAuthor(data.author);
      if (data.tags !== undefined) setTags(data.tags);
      setTimeout(() => setIsRemoteUpdate(false), 0);
    });

    newSocket.on('user-count', (count: number) => {
      setActiveUsers(count);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [doc.id]);

  // Emit changes to server
  useEffect(() => {
    if (socketRef.current && !isRemoteUpdate) {
      socketRef.current.emit('edit-document', { 
        docId: doc.id, 
        data: { content, title, author, tags } 
      });
      
      // Simulate save completion
      const timer = setTimeout(() => {
        setSaveStatus('saved');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, title, author, tags, doc.id, isRemoteUpdate]);

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  const handleWordClick = (e: React.MouseEvent, word: string) => {
    if (!spellChecker) return;
    const isCorrect = spellChecker.correct(word.toLowerCase());
    if (!isCorrect) {
      const list = spellChecker.suggest(word.toLowerCase());
      setSuggestions({ word, list: list.slice(0, 5), x: e.clientX, y: e.clientY });
    } else {
      setSuggestions(null);
    }
  };

  const applySuggestion = (newWord: string) => {
    if (!suggestions) return;
    const newContent = content.replace(new RegExp(`\\b${suggestions.word}\\b`, 'g'), newWord);
    setContent(newContent);
    setSuggestions(null);
  };

  const renderContent = () => {
    if (!spellChecker) return content;
    const parts = content.split(/(\s+)/);
    return parts.map((part: string, i: number) => {
      if (/^\s+$/.test(part)) return part;
      const cleanWord = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (!cleanWord) return part;
      const isCorrect = spellChecker.correct(cleanWord.toLowerCase());
      if (!isCorrect && cleanWord.length > 1) {
        return (
          <span 
            key={i} 
            className="border-b-2 border-red-400 cursor-help hover:bg-red-50 transition-colors pointer-events-auto"
            onClick={(e) => handleWordClick(e, cleanWord)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden relative">
      {/* Editor Header */}
      <header className="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={goBack}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <div>
            <h2 className="font-semibold text-slate-900 text-sm md:text-base truncate max-w-[200px] md:max-w-md">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span>{activeUsers} active</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5 min-w-[80px]">
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-2 h-2 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-indigo-600">Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600">Saved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className={`p-2 rounded-lg transition-colors ${showLeftPanel ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Toggle Branches"
          >
            <GitBranch className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-2 rounded-lg transition-colors ${showRightPanel ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Toggle History"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel(activePanel === 'audit' ? 'none' : 'audit')}
            className={`p-2 rounded-lg transition-colors ${activePanel === 'audit' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Toggle Audit Log"
          >
            <Activity className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-1">
            <button 
              onClick={undo}
              disabled={undoStack.length === 0}
              className={`p-2 rounded-lg transition-colors ${undoStack.length === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button 
              onClick={redo}
              disabled={redoStack.length === 0}
              className={`p-2 rounded-lg transition-colors ${redoStack.length === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel - BranchPanel */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden hidden lg:flex"
            >
              <BranchPanel 
                onCompare={() => setShowCompareView(true)} 
                onMerge={(branch) => {
                  setMergeBranch({
                    name: branch.name,
                    content: `This is the simulated content from the ${branch.name} branch. It has some differences from the main branch to simulate a merge conflict.`
                  });
                  setShowMergeModal(true);
                }} 
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-10 relative">
          <div className="max-w-3xl mx-auto mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Document Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSaveStatus('saving');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Enter title..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Author</label>
                <input 
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setSaveStatus('saving');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Author name..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Tags (comma separated)</label>
              <input 
                type="text"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setSaveStatus('saving');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. Marketing, Strategy, Q3"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-white min-h-[calc(100vh-10rem)] shadow-sm border border-slate-200 rounded-sm p-12 md:p-20 focus-within:ring-2 focus-within:ring-indigo-100 transition-all relative">
            <div className="relative w-full h-full min-h-[500px]">
              <textarea 
                className="absolute inset-0 w-full h-full resize-none outline-none font-serif text-lg leading-relaxed text-slate-800 placeholder:text-slate-300 bg-transparent z-10 caret-indigo-600"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing your masterpiece..."
                spellCheck={false}
              />
              <div className="absolute inset-0 w-full h-full pointer-events-none font-serif text-lg leading-relaxed text-transparent whitespace-pre-wrap break-words z-0">
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Suggestions Popover */}
          {suggestions && (
            <div 
              className="fixed z-50 bg-white border border-slate-200 shadow-xl rounded-xl p-2 w-48 animate-in fade-in zoom-in duration-150"
              style={{ left: suggestions.x, top: suggestions.y + 10 }}
            >
              <div className="flex items-center gap-2 px-2 py-1 mb-1 border-b border-slate-100">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggestions</span>
              </div>
              <div className="space-y-1">
                {suggestions.list.length > 0 ? (
                  suggestions.list.map((s) => (
                    <button
                      key={s}
                      onClick={() => applySuggestion(s)}
                      className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium"
                    >
                      {s}
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-xs text-slate-400 italic">No suggestions found</div>
                )}
              </div>
              <button 
                onClick={() => setSuggestions(null)}
                className="w-full mt-2 pt-2 border-t border-slate-100 text-[10px] text-center text-slate-400 hover:text-slate-600 font-bold uppercase"
              >
                Ignore
              </button>
            </div>
          )}
        </main>

        {/* Right Panel - VersionTimeline & AuditLog */}
        <AnimatePresence>
          {(showRightPanel || activePanel === 'audit') && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden hidden xl:flex"
            >
              {activePanel === 'audit' ? (
                <AuditLog />
              ) : (
                <VersionTimeline 
                  onCompare={(v1, v2) => {
                    setCompareVersions({ v1, v2 });
                    setShowCompareView(true);
                  }} 
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Floating AI Assistant */}
        <AIAssistant 
          documentContent={content} 
          onApply={(newContent) => {
            setContent(newContent);
            setSaveStatus('saving');
          }} 
        />
      </div>

      {/* Modals & Overlays */}
      {showMergeModal && mergeBranch && (
        <MergeModal 
          branchA={mergeBranch}
          branchB={{ name: 'main', content: content }}
          onConfirm={(mergedContent) => {
            setContent(mergedContent);
            setSaveStatus('saving');
            setShowMergeModal(false);
            setMergeBranch(null);
          }}
          onClose={() => {
            setShowMergeModal(false);
            setMergeBranch(null);
          }} 
        />
      )}
      {showCompareView && compareVersions && (
        <CompareView 
          onClose={() => {
            setShowCompareView(false);
            setCompareVersions(null);
          }} 
          versionA={compareVersions.v1}
          versionB={compareVersions.v2}
          onAccept={(newContent) => {
            setContent(newContent);
            setSaveStatus('saving');
            setShowCompareView(false);
            setCompareVersions(null);
          }}
        />
      )}
    </div>
  );
}
