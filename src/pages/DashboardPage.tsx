import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  BookOpen,
  UserCheck,
  LifeBuoy,
  Mic,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Bell,
  GraduationCap
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { setCurrentPage, tickets, chatMessages, knowledge, sendChatMessage } = useApp();

  const handleAskQuickQuestion = (question: string) => {
    sendChatMessage(question);
    setCurrentPage('chat');
  };

  const recentTickets = tickets.slice(0, 3);
  const recentUserQuestions = chatMessages
    .filter(m => m.sender === 'user')
    .slice(-4)
    .reverse();

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-campus-border bg-gradient-to-r from-campus-surface via-campus-card to-campus-surface p-6 md:p-8 shadow-glass">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3 w-3" />
                Semester 6 • B.Tech AI & Data Science
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                Active Student
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, Student Portal 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Access your digital campus companion. Get real-time answers to academic regulations, track submitted grievances, or initiate a new enquiry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentPage('chat')}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow hover:bg-blue-500 transition-all active:scale-95"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI Assistant</span>
            </button>
            <button
              onClick={() => setCurrentPage('support')}
              className="flex items-center gap-2 rounded-xl border border-campus-border bg-campus-card px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-campus-hover transition-colors"
            >
              <LifeBuoy className="h-4 w-4 text-cyan-400" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <button
          onClick={() => setCurrentPage('chat')}
          className="flex flex-col items-start rounded-xl border border-campus-border bg-campus-card p-4 text-left hover:border-blue-500/50 hover:bg-campus-hover transition-all group shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 mb-3 group-hover:scale-105 transition-transform">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">
            AI Assistant
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">Instant college answers</span>
        </button>

        <button
          onClick={() => setCurrentPage('knowledge')}
          className="flex flex-col items-start rounded-xl border border-campus-border bg-campus-card p-4 text-left hover:border-violet-500/50 hover:bg-campus-hover transition-all group shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400 mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white mb-0.5 group-hover:text-violet-400 transition-colors">
            Knowledge Base
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{knowledge.length} verified guides</span>
        </button>

        <button
          onClick={() => setCurrentPage('admission')}
          className="flex flex-col items-start rounded-xl border border-campus-border bg-campus-card p-4 text-left hover:border-emerald-500/50 hover:bg-campus-hover transition-all group shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
            <UserCheck className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">
            Admissions
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">Roadmap & cutoffs</span>
        </button>

        <button
          onClick={() => setCurrentPage('support')}
          className="flex flex-col items-start rounded-xl border border-campus-border bg-campus-card p-4 text-left hover:border-cyan-500/50 hover:bg-campus-hover transition-all group shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white mb-0.5 group-hover:text-cyan-400 transition-colors">
            Support Desk
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{tickets.length} tickets logged</span>
        </button>

        <button
          onClick={() => setCurrentPage('voice')}
          className="flex flex-col items-start rounded-xl border border-campus-border bg-campus-card p-4 text-left hover:border-purple-500/50 hover:bg-campus-hover transition-all group shadow-sm col-span-2 sm:col-span-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 mb-3 group-hover:scale-105 transition-transform">
            <Mic className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors">
            Voice Query
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1">Speak & listen</span>
        </button>
      </div>

      {/* Main Content Split: Tickets & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Popular College Inquiries & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Popular Student FAQs */}
          <div className="rounded-2xl border border-campus-border bg-campus-surface/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Frequently Asked Campus Questions</h3>
              </div>
              <button
                onClick={() => setCurrentPage('knowledge')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { q: 'What are the attendance rules and relaxation policies?', cat: 'Rules & Policies' },
                { q: 'Tell me about B.Tech AI & Data Science intake and fees', cat: 'Courses' },
                { q: 'What scholarships are available for high 12th scores?', cat: 'Fees' },
                { q: 'What are the hostel room options and mess charges?', cat: 'Hostel' }
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleAskQuickQuestion(item.q)}
                  className="group cursor-pointer rounded-xl border border-campus-border/80 bg-campus-card p-3.5 hover:border-blue-500/40 hover:bg-campus-hover transition-all"
                >
                  <div className="text-[10px] font-semibold text-blue-400 mb-1">{item.cat}</div>
                  <div className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2">
                    {item.q}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-blue-300">
                    <span>Ask AI</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inquiries History */}
          <div className="rounded-2xl border border-campus-border bg-campus-surface/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Your Recent AI Queries</h3>
              </div>
              <button
                onClick={() => setCurrentPage('chat')}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300"
              >
                Open Chat
              </button>
            </div>

            {recentUserQuestions.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No recent queries yet. Click any suggested question above to test the assistant!
              </div>
            ) : (
              <div className="space-y-2">
                {recentUserQuestions.map((msg, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      sendChatMessage(msg.text);
                      setCurrentPage('chat');
                    }}
                    className="flex items-center justify-between rounded-xl border border-campus-border/60 bg-campus-card px-3.5 py-2.5 hover:bg-campus-hover cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Bot className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="text-xs text-slate-200 truncate">{msg.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Support Requests Status & Announcements */}
        <div className="space-y-6">
          {/* Support Tickets Widget */}
          <div className="rounded-2xl border border-campus-border bg-campus-surface/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Active Support Tickets</h3>
              </div>
              <button
                onClick={() => setCurrentPage('support')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTickets.map(t => {
                const isResolved = t.status === 'Resolved';
                const isInProgress = t.status === 'In Progress';

                return (
                  <div
                    key={t.id}
                    onClick={() => setCurrentPage('support')}
                    className="group cursor-pointer rounded-xl border border-campus-border/70 bg-campus-card p-3 hover:border-cyan-500/40 hover:bg-campus-hover transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-semibold text-cyan-400">{t.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          isResolved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-white">
                      {t.subject}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-campus-border/50">
                      <span>{t.category}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Campus Notices */}
          <div className="rounded-2xl border border-campus-border bg-campus-surface/70 p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Academic Calendar Notice</h3>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 space-y-1">
              <div className="font-semibold text-amber-200">End-Semester Exam Schedule</div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                Admit cards will be released on the ERP portal. Minimum 75% attendance verification required.
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-300 space-y-1">
              <div className="font-semibold text-blue-200">Supercomputing Lab Hours</div>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                NVIDIA A100 workstation access will remain open 24/7 for final year Capstone project teams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
