import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="border-t border-campus-border bg-campus-dark text-slate-400 text-xs py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200">CampusMind AI</span>
              <p className="text-[11px] text-slate-500">
                Individual AI Project by B.Tech Artificial Intelligence & Data Science
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setCurrentPage('chat')} className="hover:text-blue-400 transition-colors">
              AI Assistant
            </button>
            <button onClick={() => setCurrentPage('knowledge')} className="hover:text-blue-400 transition-colors">
              Knowledge Base
            </button>
            <button onClick={() => setCurrentPage('admission')} className="hover:text-blue-400 transition-colors">
              Admissions
            </button>
            <button onClick={() => setCurrentPage('support')} className="hover:text-blue-400 transition-colors">
              Helpdesk
            </button>
            <button onClick={() => setCurrentPage('analytics')} className="hover:text-blue-400 transition-colors">
              Analytics
            </button>
            <button onClick={() => setCurrentPage('about')} className="hover:text-blue-400 transition-colors">
              Project Architecture
            </button>
          </div>
        </div>

        {/* Academic Prototype Disclaimer */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3 text-amber-300/90 text-[11px] leading-relaxed">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Academic Demonstration Notice:</span>
            {' '}This web application is a student software engineering demonstration prototype. All institution names, course fees, cutoff ranks, policies, and contact information are illustrative sample data created for demonstration purposes and do not represent official university declarations.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-campus-border/60">
          <div>
            &copy; 2026 CampusMind AI. Built with React, TypeScript, Vite, Tailwind CSS & Google Gemini.
          </div>
          <div className="flex items-center gap-1">
            Designed for Excellence in AI Engineering
          </div>
        </div>
      </div>
    </footer>
  );
};
