import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, X, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, geminiConfigured } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/20 px-4 py-2 text-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-semibold text-blue-400">DEMO PROTOTYPE:</span>
          <span className="hidden sm:inline text-slate-300">
            {geminiConfigured
              ? 'Connected to Google Gemini API with RAG college context grounding.'
              : 'Using intelligent local college knowledge base (Offline Smart RAG mode).'}
          </span>
          <span className="sm:hidden text-slate-300">
            Illustrative sample data prototype.
          </span>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
