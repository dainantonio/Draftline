'use client';

import React, { useState } from 'react';
import { GitMerge, AlertTriangle, Check, X, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface Branch {
  name: string;
  content: string;
}

interface MergeModalProps {
  branchA: Branch;
  branchB: Branch;
  onConfirm: (mergedContent: string) => void;
  onClose: () => void;
}

export default function MergeModal({ branchA, branchB, onConfirm, onClose }: MergeModalProps) {
  const [resolution, setResolution] = useState<'A' | 'B' | 'combine'>('A');

  const getMergedContent = () => {
    if (resolution === 'A') return branchA.content;
    if (resolution === 'B') return branchB.content;
    return `${branchA.content}\n\n<<<<<<<< MERGE CONFLICT (COMBINED) >>>>>>>>\n\n${branchB.content}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Resolve Merge Conflict</h3>
              <p className="text-xs text-slate-500">Select which version to keep or combine both</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Branch Info */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branch A</span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-sm text-slate-700 font-bold">{branchA.name}</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branch B</span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-sm text-indigo-600 font-bold">{branchB.name}</span>
              </div>
            </div>
          </div>

          {/* Conflict Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Resolution Strategy</label>
            <div className="grid grid-cols-1 gap-3">
              {/* Keep A */}
              <button 
                onClick={() => setResolution('A')}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  resolution === 'A' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">Keep {branchA.name} (A)</span>
                  {resolution === 'A' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="bg-white border border-slate-100 rounded-lg p-3 font-mono text-[11px] text-slate-600 line-clamp-2">
                  {branchA.content}
                </div>
              </button>

              {/* Keep B */}
              <button 
                onClick={() => setResolution('B')}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  resolution === 'B' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">Keep {branchB.name} (B)</span>
                  {resolution === 'B' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="bg-white border border-slate-100 rounded-lg p-3 font-mono text-[11px] text-slate-600 line-clamp-2">
                  {branchB.content}
                </div>
              </button>

              {/* Combine */}
              <button 
                onClick={() => setResolution('combine')}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  resolution === 'combine' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">Combine Both</span>
                  {resolution === 'combine' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="bg-white border border-slate-100 rounded-lg p-3 font-mono text-[11px] text-slate-400 italic">
                  Appends both contents with a conflict marker
                </div>
              </button>
            </div>
          </div>

          {/* Merge Result Preview */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Merge Result Preview</label>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <pre className="text-[11px] text-slate-300 font-mono leading-relaxed overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-slate-700">
                {getMergedContent()}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(getMergedContent())}
            className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <GitMerge className="w-4 h-4" />
            Confirm Merge
          </button>
        </div>
      </motion.div>
    </div>
  );
}
