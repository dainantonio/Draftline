'use client';

import React, { useState } from 'react';
import { History, Clock, User, ChevronRight, RotateCcw, Eye, CheckCircle2 } from 'lucide-react';

interface Version {
  id: string;
  tag: string;
  message: string;
  time: string;
  user: string;
  type: string;
  content: string;
}

interface VersionTimelineProps {
  onCompare?: (v1: Version, v2: Version) => void;
}

export default function VersionTimeline({ onCompare }: VersionTimelineProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const versions: Version[] = [
    { 
      id: '1', 
      tag: 'v2.4', 
      message: 'Updated budget allocation', 
      time: '10m ago', 
      user: 'Dain R.', 
      type: 'major',
      content: '# Q3 Marketing Strategy\n\n## Executive Summary\nOur goal for Q3 is to increase brand awareness by 25% across digital channels while maintaining a CAC below $45. We will focus on high-intent search terms and strategic influencer partnerships.\n\n## Key Objectives\n1. **Expand Social Reach**: Launch 3 major campaigns on LinkedIn and Twitter.\n2. **Content Engine**: Produce 12 high-quality whitepapers and 24 blog posts.\n3. **SEO Optimization**: Improve ranking for top 50 industry keywords.\n\n## Budget Allocation\n- Paid Search: 45%\n- Content Production: 25%\n- Influencer Marketing: 20%\n- Events & Webinars: 10%'
    },
    { 
      id: '2', 
      tag: 'v2.3', 
      message: 'Fixed typos in summary', 
      time: '45m ago', 
      user: 'Sam C.', 
      type: 'minor',
      content: '# Q3 Marketing Strategy\n\n## Executive Summary\nOur goal for Q3 is to increase brand awareness by 25% across digital channels while maintaining a CAC below $45. We will focus on high-intent search terms and strategic influencer partnerships.\n\n## Key Objectives\n1. **Expand Social Reach**: Launch 3 major campaigns on LinkedIn and Twitter.\n2. **Content Engine**: Produce 12 high-quality whitepapers and 24 blog posts.\n3. **SEO Optimization**: Improve ranking for top 50 industry keywords.\n\n## Budget Allocation\n- Paid Search: 40%\n- Content Production: 30%\n- Influencer Marketing: 20%\n- Events & Webinars: 10%'
    },
    { 
      id: '3', 
      tag: 'v2.2', 
      message: 'Added SEO section', 
      time: '2h ago', 
      user: 'Alex R.', 
      type: 'major',
      content: '# Q3 Marketing Strategy\n\n## Executive Summary\nOur goal for Q3 is to increase brand awareness by 25% across digital channels while maintaining a CAC below $45.\n\n## Key Objectives\n1. **Expand Social Reach**: Launch 3 major campaigns on LinkedIn and Twitter.\n2. **Content Engine**: Produce 12 high-quality whitepapers and 24 blog posts.\n3. **SEO Optimization**: Improve ranking for top 50 industry keywords.'
    },
    { 
      id: '4', 
      tag: 'v2.1', 
      message: 'Initial draft structure', 
      time: 'Yesterday', 
      user: 'Dain R.', 
      type: 'minor',
      content: '# Q3 Marketing Strategy\n\n## Executive Summary\nOur goal for Q3 is to increase brand awareness by 25% across digital channels while maintaining a CAC below $45.\n\n## Key Objectives\n1. **Expand Social Reach**: Launch 3 major campaigns on LinkedIn and Twitter.'
    },
    { 
      id: '5', 
      tag: 'v1.0', 
      message: 'Project kickoff baseline', 
      time: '3 days ago', 
      user: 'Jordan T.', 
      type: 'baseline',
      content: '# Q3 Marketing Strategy\n\nInitial project kickoff.'
    },
  ];

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      // Replace the oldest selection if already 2
      return [prev[1], id];
    });
  };

  const handleCompare = () => {
    if (selectedIds.length === 2 && onCompare) {
      const v1 = versions.find(v => v.id === selectedIds[0]);
      const v2 = versions.find(v => v.id === selectedIds[1]);
      if (v1 && v2) {
        onCompare(v1, v2);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          Version History
        </h3>
        {selectedIds.length > 0 && (
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">
            {selectedIds.length}/2 selected
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {versions.map((v) => {
            const isSelected = selectedIds.includes(v.id);
            return (
              <div 
                key={v.id} 
                className={`relative pl-8 group cursor-pointer transition-all ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                onClick={() => handleSelect(v.id)}
              >
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-all ${
                  isSelected ? 'bg-indigo-600 scale-110' : 
                  v.type === 'baseline' ? 'bg-emerald-500' : 
                  v.type === 'major' ? 'bg-indigo-500' : 'bg-slate-300'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                
                <div className={`flex flex-col p-2 rounded-lg transition-colors ${isSelected ? 'bg-indigo-50/50 ring-1 ring-indigo-100' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{v.tag}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{v.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 leading-snug">{v.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-2.5 h-2.5" />
                      </div>
                      <span>{v.user}</span>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" 
                        title="Restore"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
        {selectedIds.length === 2 && (
          <button 
            onClick={handleCompare}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 animate-in fade-in slide-in-from-bottom-2"
          >
            Compare Selected
          </button>
        )}
        <button className="w-full py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
          Create New Version
        </button>
      </div>
    </div>
  );
}
