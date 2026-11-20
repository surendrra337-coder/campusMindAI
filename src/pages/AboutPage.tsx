import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Database,
  ShieldCheck,
  CheckCircle2,
  Code2,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: '1',
    time: '0:00 - 1:00',
    title: 'Landing Page & Project Overview',
    desc: 'Introduce the problem statement: students face repetitive queues for basic inquiries. Showcase high-level metrics and system design.'
  },
  {
    step: '2',
    time: '1:00 - 2:00',
    title: 'Student Dashboard Navigation',
    desc: 'Tour active tickets, recent inquiries, urgent academic notices, and quick action shortcuts across the campus.'
  },
  {
    step: '3',
    time: '2:00 - 3:30',
    title: 'AI Campus Assistant (RAG Engine)',
    desc: 'Ask about the 75% attendance policy and B.Tech AI & DS scholarships. Show source citations, confidence scores, and demo response indicators.'
  },
  {
    step: '4',
    time: '3:30 - 4:30',
    title: 'Smart Knowledge Base & Admin CRUD',
    desc: 'Search for "NVIDIA A100". Toggle Demo Admin Mode to create or edit an FAQ entry and demonstrate immediate indexing.'
  },
  {
    step: '5',
    time: '4:30 - 5:30',
    title: 'Support Ticket Dispatch & State Machine',
    desc: 'Submit a new support ticket (e.g. WiFi issue in hostel). Watch it generate TKT-xxxx, update status to "In Progress", and add resolution notes.'
  },
  {
    step: '6',
    time: '5:30 - 6:30',
    title: 'Admin Analytics Live Visualization',
    desc: 'Open Recharts dashboard. Show how the newly submitted ticket and inquiries directly updated the charts and activity stream.'
  },
  {
    step: '7',
    time: '6:30 - 7:00',
    title: 'Voice Assistant & Architectural Wrap-Up',
    desc: 'Demonstrate Web Speech recognition and audio synthesis. Summarize key takeaways, zero-hallucination RAG guardrails, and future scaling.'
  }
];

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
          <GraduationCap className="h-3.5 w-3.5" />
          Senior Capstone AI Engineering Project
        </div>
        <h1 className="text-3xl font-extrabold text-white">About CampusMind AI</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          An intelligent digital student support ecosystem designed to eliminate administrative bottlenecks through Retrieval-Augmented Generation (RAG).
        </p>
      </div>

      {/* 5-7 Minute Classroom Demonstration Script */}
      <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-b from-campus-surface to-campus-card p-6 md:p-8 shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-campus-border/60 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              CLASSROOM PRESENTATION PLAYBOOK
            </span>
            <h2 className="text-xl font-bold text-white">5–7 Minute Live Demonstration Flow</h2>
          </div>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
            Evaluator Checklist
          </span>
        </div>

        <div className="space-y-3">
          {DEMO_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl border border-campus-border/70 bg-campus-card/70 p-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5">{step.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 bg-campus-surface px-2 py-1 rounded shrink-0 self-start sm:self-auto border border-campus-border">
                {step.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Diagram & System Flow */}
      <div className="rounded-3xl border border-campus-border bg-campus-card p-6 md:p-8 space-y-6 shadow-sm">
        <div className="border-b border-campus-border/60 pb-4">
          <h2 className="text-lg font-bold text-white">System Architecture & RAG Pipeline</h2>
          <p className="text-xs text-slate-400">
            Dual-resilient architecture combining Express API routes with intelligent client fallback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/70 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Presentation Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              React 18 with TypeScript and Vite. Styled with Tailwind CSS, Lucide React icons, and Recharts interactive charting.
            </p>
          </div>

          <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/70 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Backend & RAG Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Node.js Express server with semantic keyword indexing. Injects retrieved context chunks into Google Gemini API or runs the Smart Offline Synthesizer.
            </p>
          </div>

          <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/70 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Security & Resilience</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero frontend API key exposure. LocalStorage dual-sync ensures 100% functionality during live presentations even without network access.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Badges */}
      <div className="rounded-3xl border border-campus-border bg-campus-card p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-white">Full-Stack Technology Stack</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'React 18',
            'TypeScript 5.7',
            'Vite 6',
            'Tailwind CSS',
            'Framer Motion',
            'Lucide React',
            'Recharts',
            'Node.js 24',
            'Express.js',
            'Google Gemini API',
            'Web Speech API',
            'Retrieval-Augmented Generation (RAG)',
            'LocalStorage Sync'
          ].map((tech, i) => (
            <span
              key={i}
              className="rounded-xl border border-campus-border bg-campus-surface px-3 py-1.5 font-medium text-slate-300 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Prototype Ethics & Academic Integrity */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs text-amber-300 space-y-2">
        <h4 className="font-bold text-amber-200">Academic Project Disclaimer</h4>
        <p className="leading-relaxed text-amber-300/80 text-[11px]">
          CampusMind AI is an individual educational software project developed by an Artificial Intelligence & Data Science student. It showcases intelligent retrieval and natural language interaction over academic knowledge graphs. All institutional data is illustrative and designed to validate user experience and conversational accuracy.
        </p>
      </div>
    </div>
  );
};
