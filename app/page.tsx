'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import DocumentEditor from '@/components/DocumentEditor';
import { AnimatePresence, motion } from 'motion/react';

export default function Page() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [documents, setDocuments] = useState([
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
  ]);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);

  const handleOpenDocument = (doc: any) => {
    setActiveDoc(doc);
    setView('editor');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setActiveDoc(null);
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
