import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  BookOpen,
  UserCheck,
  LifeBuoy,
  Mic,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Cpu,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-campus-border bg-gradient-to-b from-campus-surface/90 via-campus-dark to-campus-dark p-8 md:p-14 shadow-glass">
        {/* Glow ambient background circles */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 shadow-glow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Next-Gen College Assistant & Support Ecosystem</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Student Support, <br className="hidden sm:inline" />
            <span className="shimmer-text">Zero Waiting Time.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CampusMind AI simplifies college life for prospective applicants and enrolled students. Get instant, verified answers on admissions, courses, scholarships, exams, and hostel facilities powered by Retrieval-Augmented Generation (RAG).
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentPage('chat')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
            >
              <Bot className="h-4 w-4" />
              <span>Ask Campus Assistant</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 rounded-xl border border-campus-border bg-campus-card px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-campus-hover hover:text-white transition-all shadow-sm"
            >
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('voice')}
              className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/20 transition-all"
            >
              <Mic className="h-4 w-4 text-violet-400" />
              <span>Voice Interaction</span>
            </button>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-campus-border/60 text-left">
            <div className="rounded-xl border border-campus-border/60 bg-campus-surface/40 p-4">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-xs text-slate-400">Automated Instant FAQs</div>
            </div>
            <div className="rounded-xl border border-campus-border/60 bg-campus-surface/40 p-4">
              <div className="text-2xl font-bold text-violet-400">14+</div>
              <div className="text-xs text-slate-400">Knowledge Domains</div>
            </div>
            <div className="rounded-xl border border-campus-border/60 bg-campus-surface/40 p-4">
              <div className="text-2xl font-bold text-emerald-400">&lt; 1.2s</div>
              <div className="text-xs text-slate-400">Average RAG Latency</div>
            </div>
            <div className="rounded-xl border border-campus-border/60 bg-campus-surface/40 p-4">
              <div className="text-2xl font-bold text-cyan-400">24 / 7</div>
              <div className="text-xs text-slate-400">Student Support Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Complete Digital Campus Experience
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            From first inquiry to graduation day, everything students need in one unified ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Assistant */}
          <div
            onClick={() => setCurrentPage('chat')}
            className="group cursor-pointer rounded-2xl border border-campus-border bg-campus-card p-6 shadow-sm hover:border-blue-500/50 hover:shadow-glow transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Conversational Campus Assistant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Ask natural questions about credit requirements, syllabus downloads, NVIDIA A100 labs, or mess fee deadlines. Grounded in official institutional documents.
            </p>
            <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Start Chatting</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Smart Knowledge Base */}
          <div
            onClick={() => setCurrentPage('knowledge')}
            className="group cursor-pointer rounded-2xl border border-campus-border bg-campus-card p-6 shadow-sm hover:border-violet-500/50 hover:shadow-glow-violet transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
              Smart Knowledge Base
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Browse categorized FAQs across 7 academic domains. Instant search with keyword filtering, expandable explanations, and demo administrative CRUD controls.
            </p>
            <div className="flex items-center text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Knowledge</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Support Center */}
          <div
            onClick={() => setCurrentPage('support')}
            className="group cursor-pointer rounded-2xl border border-campus-border bg-campus-card p-6 shadow-sm hover:border-cyan-500/50 hover:shadow-glow-cyan transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              Student Support Center
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Submit formal requests with category selection and automatic tracking IDs (e.g. TKT-1082). Live status tracking with administrative resolution notes.
            </p>
            <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Submit a Ticket</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="rounded-2xl border border-campus-border bg-campus-surface/50 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-campus-border/60 pb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Why CampusMind AI?</h3>
            <p className="text-xs text-slate-400">
              Built to eradicate long helpdesk queues and outdated bulletin notices.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('about')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Read Architecture Whitepaper</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-campus-border/60 bg-campus-card p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Truthful RAG Answers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict document grounding prevents hallucinated cutoffs or made-up fees.
            </p>
          </div>

          <div className="rounded-xl border border-campus-border/60 bg-campus-card p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Mic className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Voice Synthesis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hands-free voice recognition and audio responses for students on the move.
            </p>
          </div>

          <div className="rounded-xl border border-campus-border/60 bg-campus-card p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Admin Analytics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real Recharts visualization tracking category trends and resolution metrics.
            </p>
          </div>

          <div className="rounded-xl border border-campus-border/60 bg-campus-card p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Reliable Demo Mode</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly runs offline or with live Gemini API for foolproof classroom demos.
            </p>
          </div>
        </div>
      </section>

      {/* Demonstration Flow Banner */}
      <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">
            LIVE PRESENTATION CHECKLIST
          </div>
          <h3 className="text-xl font-bold text-white">Ready for 5-7 Minute Classroom Demo</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Test the entire student journey: from asking the AI assistant about 75% attendance rules to submitting a live ticket and seeing it appear instantly on the Admin Analytics dashboard!
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('dashboard')}
          className="shrink-0 rounded-xl bg-white text-slate-950 font-bold text-xs px-6 py-3.5 hover:bg-slate-100 transition-all shadow-glow"
        >
          Enter Student Dashboard →
        </button>
      </section>
    </div>
  );
};
