'use client';

import React, { useState } from 'react';
import { X, Split, Check, XCircle, ArrowLeft, ArrowRight, GitMerge, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Version {
  id: string;
  tag: string;
  message: string;
  time: string;
  user: string;
  content: string;
}

interface CompareViewProps {
  versionA: Version;
  versionB: Version;
  onClose: () => void;
  onAccept?: (content: string) => void;
}

export default function CompareView({ versionA, versionB, onClose, onAccept }: CompareViewProps) {
  const [activeTab, setActiveTab] = useState<'split' | 'unified'>('split');

  // Simple line-by-line diff logic for demonstration
  const linesA = versionA.content.split('\n');
  const linesB = versionB.content.split('\n');
  
  const maxLines = Math.max(linesA.length, linesB.length);
  const diffLines = [];

  for (let i = 0; i < maxLines; i++) {
    const lineA = linesA[i] || '';
    const lineB = linesB[i] || '';
    
    if (lineA === lineB) {
      diffLines.push({ type: 'equal', value: lineA });
    } else {
      if (lineA && !lineB) {
        diffLines.push({ type: 'delete', value: lineA });
      } else if (!lineA && lineB) {
        diffLines.push({ type: 'add', value: lineB });
      } else {
        diffLines.push({ type: 'delete', value: lineA });
        diffLines.push({ type: 'add', value: lineB });
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Split className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm md:text-base">Compare Versions</h2>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500">
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{versionA.tag}</span>
                <ArrowRight className="w-3 h-3" />
                <span className="font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">{versionB.tag}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setActiveTab('split')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'split' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Split
            </button>
            <button 
              onClick={() => setActiveTab('unified')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'unified' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Unified
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-2"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden flex bg-slate-50/30">
        {activeTab === 'split' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Old */}
            <div className="flex-1 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
              <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{versionA.tag}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
                {linesA.map((line, i) => (
                  <div key={i} className={`flex group ${linesB[i] !== line ? 'bg-red-50/50' : ''}`}>
                    <span className="w-10 shrink-0 text-slate-300 select-none text-right pr-4">{i + 1}</span>
                    <span className={`flex-1 ${linesB[i] !== line ? 'text-red-700' : 'text-slate-600'}`}>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - New */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="px-6 py-3 border-b border-indigo-100 flex items-center justify-between bg-indigo-50/30">
                <div className="flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{versionB.tag}</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Changes</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
                {linesB.map((line, i) => (
                  <div key={i} className={`flex group ${linesA[i] !== line ? 'bg-emerald-50/50' : ''}`}>
                    <span className="w-10 shrink-0 text-slate-300 select-none text-right pr-4">{i + 1}</span>
                    <span className={`flex-1 ${linesA[i] !== line ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
            <div className="max-w-4xl mx-auto border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unified View</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                {diffLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={`flex px-2 py-0.5 ${
                      line.type === 'add' ? 'bg-emerald-50 text-emerald-700' : 
                      line.type === 'delete' ? 'bg-red-50 text-red-700 line-through opacity-70' : 
                      'text-slate-600'
                    }`}
                  >
                    <span className="w-8 shrink-0 opacity-50 select-none">
                      {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                    </span>
                    <span className="flex-1">{line.value || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="h-24 border-t border-slate-200 px-8 flex items-center justify-between bg-white shrink-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span className="text-xs font-bold text-slate-700">Additions</span>
            </div>
            <p className="text-[10px] text-slate-400">New content from {versionB.tag}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-sm" />
              <span className="text-xs font-bold text-slate-700">Deletions</span>
            </div>
            <p className="text-[10px] text-slate-400">Removed from {versionA.tag}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject All
          </button>
          <button 
            onClick={() => onAccept?.(versionB.content)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept Changes
          </button>
        </div>
      </footer>
    </div>
  );
}
