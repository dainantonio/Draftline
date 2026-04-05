'use client';

import React from 'react';
import { History, User, Clock, Activity, ShieldCheck, FileEdit, Trash2, PlusCircle } from 'lucide-react';

interface AuditAction {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  action: string;
  timestamp: string;
  type: 'edit' | 'delete' | 'create' | 'security' | 'other';
}

const mockActions: AuditAction[] = [
  {
    id: '1',
    user: { name: 'Dain Russell', role: 'Owner' },
    action: 'Updated Executive Summary section',
    timestamp: '2 mins ago',
    type: 'edit'
  },
  {
    id: '2',
    user: { name: 'Alex Rivera', role: 'Editor' },
    action: 'Added new branch: feature/social-media-plan',
    timestamp: '1 hour ago',
    type: 'create'
  },
  {
    id: '3',
    user: { name: 'Jordan Taylor', role: 'Reviewer' },
    action: 'Resolved merge conflict in Budget Allocation',
    timestamp: '3 hours ago',
    type: 'edit'
  },
  {
    id: '4',
    user: { name: 'System', role: 'Security' },
    action: 'Automatic backup completed successfully',
    timestamp: '5 hours ago',
    type: 'security'
  },
  {
    id: '5',
    user: { name: 'Dain Russell', role: 'Owner' },
    action: 'Deleted draft: old-marketing-plan-v1',
    timestamp: 'Yesterday',
    type: 'delete'
  }
];

const getIcon = (type: AuditAction['type']) => {
  switch (type) {
    case 'edit': return <FileEdit className="w-4 h-4 text-indigo-500" />;
    case 'create': return <PlusCircle className="w-4 h-4 text-emerald-500" />;
    case 'delete': return <Trash2 className="w-4 h-4 text-rose-500" />;
    case 'security': return <ShieldCheck className="w-4 h-4 text-amber-500" />;
    default: return <Activity className="w-4 h-4 text-slate-500" />;
  }
};

export default function AuditLog() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          Audit Log
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
          Live Updates
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-50">
          {mockActions.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:border-indigo-100 group-hover:shadow-indigo-50/50 transition-all">
                  {getIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm font-bold text-slate-900 truncate">{item.user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
        <button className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2">
          Export Full History
        </button>
      </div>
    </div>
  );
}
