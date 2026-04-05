'use client';

import React, { useState } from 'react';
import { FileText, Plus, Clock, History, ChevronRight, X, Sparkles, Shield, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Document {
  id: string;
  title: string;
  lastEdited?: string;
  versionCount?: number;
  branches?: any[];
}

const TEMPLATES = [
  { id: 'blank', name: 'Blank Document', description: 'Start from scratch', icon: FileText, color: 'text-slate-400', bg: 'bg-slate-50' },
  { id: 'marketing', name: 'Marketing Strategy', description: 'Plan your next big campaign', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'legal', name: 'Legal Contract', description: 'Standard terms and conditions', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'product', name: 'Product Spec', description: 'Define features and requirements', icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50' },
];

interface DashboardProps {
  onOpenDocument: (doc: Document) => void;
  documents: Document[];
}

export default function Dashboard({ onOpenDocument, documents }: DashboardProps) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleCreateFromTemplate = (templateId: string) => {
    console.log(`Creating document from template: ${templateId}`);
    setIsTemplateModalOpen(false);
    // In a real app, this would create a doc and then open it
    onOpenDocument({
      id: 'new-doc-id',
      title: 'New Document',
      lastEdited: 'Just now',
      versionCount: 1,
      branches: [{ name: 'main', versions: [] }]
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Draftline</span>
        </div>
        
        <button 
          onClick={() => setIsTemplateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Your Documents</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and edit your collaborative writing projects.</p>
        </div>

        <div className="grid gap-4">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Edited {doc.lastEdited || 'Recently'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <History className="w-3.5 h-3.5" />
                      <span>{doc.versionCount || doc.branches?.[0]?.versions?.length || 0} versions</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>
          ))}
        </div>
      </main>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-600" />
                  Choose a Template
                </h3>
                <button 
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template.id)}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className={`w-12 h-12 shrink-0 rounded-xl ${template.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <template.icon className={`w-6 h-6 ${template.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{template.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{template.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
