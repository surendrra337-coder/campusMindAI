import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  Home,
  LayoutDashboard,
  Bot,
  BookOpen,
  UserCheck,
  GraduationCap,
  LifeBuoy,
  Mic,
  BarChart3,
  Info,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  isNew?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'landing', label: 'Landing Page', icon: Home },
  { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'AI Campus Assistant', icon: Bot, badge: 'RAG AI' },
  { id: 'knowledge', label: 'Smart Knowledge Base', icon: BookOpen, badge: '14 FAQs' },
  { id: 'admission', label: 'Admission Guidance', icon: UserCheck },
  { id: 'courses', label: 'Courses & Departments', icon: GraduationCap },
  { id: 'support', label: 'Student Support Center', icon: LifeBuoy },
  { id: 'voice', label: 'Voice Assistant', icon: Mic, isNew: true },
  { id: 'analytics', label: 'Admin Analytics', icon: BarChart3 },
  { id: 'about', label: 'About Project', icon: Info }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, isAdminMode } = useApp();

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-campus-border bg-campus-dark transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between border-b border-campus-border px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Campus Ecosystem
            </span>
          </div>
          {isAdminMode && (
            <span className="inline-flex items-center gap-1 rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
              <ShieldCheck className="h-3 w-3" />
              ADMIN
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-glow-sm'
                    : 'text-slate-300 hover:bg-campus-hover hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-campus-surface text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-campus-surface text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="rounded bg-gradient-to-r from-violet-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      New
                    </span>
                  )}
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Assistant Card at Bottom */}
        <div className="p-4 border-t border-campus-border">
          <div className="rounded-xl border border-campus-border bg-gradient-to-b from-campus-surface to-campus-card p-3.5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-white">5-Min Live Demo</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Explore conversational RAG queries, live ticketing, and student knowledge analytics.
            </p>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full rounded-lg bg-campus-border/70 hover:bg-campus-hover py-1.5 text-center text-[11px] font-medium text-slate-200 transition-colors"
            >
              View Demonstration Guide →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
