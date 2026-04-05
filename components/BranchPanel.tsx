'use client';

import React from 'react';
import { GitBranch, Plus, GitMerge, GitPullRequest, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  isDefault: boolean;
  lastUpdate: string;
  author: string;
}

interface BranchPanelProps {
  activeBranchName?: string;
  onCompare: () => void;
  onMerge: (branch: Branch) => void;
}

export default function BranchPanel({ activeBranchName = 'main', onCompare, onMerge }: BranchPanelProps) {
  const branches: Branch[] = [
    { id: '1', name: 'main', isDefault: true, lastUpdate: '2m ago', author: 'Dain R.' },
    { id: '2', name: 'feature/social-media-plan', isDefault: false, lastUpdate: '1h ago', author: 'Alex R.' },
    { id: '3', name: 'legal-review-v2', isDefault: false, lastUpdate: 'Yesterday', author: 'Jordan T.' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-600" />
          Branches
        </h3>
        <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {branches.map((branch) => {
          const isActive = branch.name === activeBranchName;
          return (
            <div 
              key={branch.id}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                isActive 
                  ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {branch.name}
                  </span>
                  {branch.isDefault && (
                    <span className="text-[10px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-bold">Default</span>
                  )}
                  {isActive && !branch.isDefault && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
                  )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{branch.lastUpdate}</span>
                </div>
                <span>{branch.author}</span>
              </div>

              {!isActive && !branch.isDefault && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onCompare(); }}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <GitPullRequest className="w-3 h-3" />
                    Compare
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMerge(branch); }}
                    className="flex-1 py-1.5 bg-indigo-600 rounded-lg text-[11px] font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <GitMerge className="w-3 h-3" />
                    Merge
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>All branches are up to date with main</span>
        </div>
        <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          View Network Graph
        </button>
      </div>
    </div>
  );
}
