'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import { AnimatePresence, motion } from 'motion/react';

export default function Page() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  
  const [documents, setDocuments] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draftline_docs');
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "doc1",
        title: "Q2 Campaign",
        branches: [
          {
            name: "main",
            versions: [
              {
                id: "v1",
                content: "Initial draft",
                timestamp: 1712351643000,
                author: "You"
              }
            ]
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('draftline_docs', JSON.stringify(documents));
  }, [documents]);

  const [activeDoc, setActiveDoc] = useState<any | null>(null);

  const handleOpenDocument = (doc: any) => {
    setActiveDoc(doc);
    setView('editor');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setActiveDoc(null);
  };

  const handleSaveDocument = (docId: string, data: any) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => {
        if (doc.id !== docId) return doc;
        
        // Update the main branch's latest version
        const updatedBranches = doc.branches.map((branch: any) => {
          if (branch.name === 'main') {
            const newVersion = {
              id: `v${Date.now()}`,
              content: data.content,
              timestamp: Date.now(),
              author: data.author || 'You',
              tag: data.versionTag || `v${branch.versions.length + 1}.0`
            };
            return {
              ...branch,
              versions: [...branch.versions, newVersion]
            };
          }
          return branch;
        });

        const updatedDoc = {
          ...doc,
          title: data.title,
          branches: updatedBranches
        };
        setActiveDoc(updatedDoc);
        return updatedDoc;
      })
    );
  };

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard 
              onOpenDocument={handleOpenDocument} 
              documents={documents}
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentEditor 
              doc={activeDoc} 
              goBack={handleBackToDashboard} 
              onSave={handleSaveDocument}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
