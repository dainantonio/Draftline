'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Wand2, RefreshCw, Check, Copy, MessageSquare, Loader2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface AIAssistantProps {
  documentContent: string;
  onApply: (newContent: string) => void;
}

export default function AIAssistant({ documentContent, onApply }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const suggestions = [
    { label: "Summarize changes", prompt: "Summarize the key points and recent changes in this document." },
    { label: "Improve writing", prompt: "Rewrite this text to improve clarity, flow, and impact while maintaining the original meaning." },
    { label: "Explain differences", prompt: "Explain the conceptual differences between the sections of this document." },
    { label: "Suggest better version", prompt: "Provide a more compelling and polished version of this entire document." }
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || input;
    if (!promptToUse || isGenerating) return;

    setIsGenerating(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { 
            parts: [
              { text: `You are an expert writing assistant. Here is the current document content:\n\n${documentContent}\n\nUser Request: ${promptToUse}\n\nPlease provide the improved version or requested analysis. If providing improved text, only return the text itself. If providing an explanation or summary, be concise and professional.` }
            ] 
          }
        ],
      });

      const text = response.text;
      if (text) {
        setAiResponse(text.trim());
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiResponse("Sorry, I encountered an error while generating. Please try again.");
    } finally {
      setIsGenerating(false);
      setInput('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group"
      >
        <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
        <span className="font-bold text-sm tracking-tight">✨ AI Assist</span>
      </button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Assistant</h3>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Gemini 3 Flash</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
              {!aiResponse && !isGenerating && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      How can I help you with your document today? Choose a quick action or describe what you need below.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quick Actions</span>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestions.map((s) => (
                        <button 
                          key={s.label}
                          onClick={() => handleGenerate(s.prompt)}
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-indigo-200 hover:shadow-md transition-all group"
                        >
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{s.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Output */}
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        <div className="absolute inset-0 bg-indigo-400/20 blur-lg animate-pulse rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-indigo-600">Thinking...</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2.5 bg-slate-100 rounded-full w-full animate-pulse" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-[90%] animate-pulse" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-[75%] animate-pulse" />
                    </div>
                  </motion.div>
                ) : aiResponse ? (
                  <motion.div 
                    key="response"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">AI Suggestion</span>
                      <button 
                        onClick={() => setAiResponse(null)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {aiResponse}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => {
                          onApply(aiResponse);
                          setAiResponse(null);
                        }}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Apply to Draft
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(aiResponse);
                        }}
                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all resize-none min-h-[120px] shadow-inner"
                  placeholder="Ask me to rewrite, summarize, or explain..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <button 
                  onClick={() => handleGenerate()}
                  className="absolute right-3 bottom-3 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
                  disabled={!input || isGenerating}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <MessageSquare className="w-3 h-3" />
                  <span>AI Writing Assistant</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[65] sm:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
