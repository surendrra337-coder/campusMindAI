import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  Search,
  Bot,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    theme,
    toggleTheme,
    isAdminMode,
    toggleAdminMode,
    isDemoMode,
    geminiConfigured,
    setCurrentPage
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-campus-border bg-campus-dark/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-campus-hover hover:text-white lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-campus-dark animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  CampusMind<span className="text-blue-500">.AI</span>
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 -mt-0.5 tracking-wider uppercase">
                Apex Institute of Tech
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search button shortcut */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setCurrentPage('knowledge')}
            className="flex items-center gap-2.5 rounded-full border border-campus-border bg-campus-surface/60 px-4 py-1.5 text-xs text-slate-400 hover:border-blue-500/50 hover:text-slate-200 transition-all w-64 lg:w-80 shadow-inner"
          >
            <Search className="h-3.5 w-3.5 text-blue-400" />
            <span className="flex-1 text-left">Search admissions, fees, rules...</span>
            <kbd className="rounded border border-campus-border bg-campus-card px-1.5 py-0.5 text-[10px] text-slate-400">
              KB
            </kbd>
          </button>
        </div>

        {/* Right Actions: Mode badges, Theme toggle, Admin toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini vs Demo Mode Pill */}
          <div
            onClick={() => setCurrentPage('chat')}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-all ${
              geminiConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title={geminiConfigured ? 'Gemini 1.5 Live API Active' : 'Running in Offline Smart RAG Demo Mode'}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{geminiConfigured ? 'Gemini AI Active' : 'Demo Mode Active'}</span>
          </div>

          {/* Admin Mode Toggle */}
          <button
            onClick={toggleAdminMode}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              isAdminMode
                ? 'bg-violet-600 text-white shadow-glow-violet'
                : 'border border-campus-border bg-campus-card text-slate-300 hover:bg-campus-hover hover:text-white'
            }`}
            title="Toggle Demo Admin Mode for editing FAQs and tickets"
          >
            {isAdminMode ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />}
            <span className="hidden sm:inline">Admin Mode</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-campus-border bg-campus-card p-2 text-slate-300 hover:bg-campus-hover hover:text-white transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
          </button>

          {/* Chat Quick Action CTA */}
          <button
            onClick={() => setCurrentPage('chat')}
            className="hidden lg:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow-sm hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
