import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Bot,
  Cpu,
  Layers,
  Award,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { departments, setCurrentPage, sendChatMessage } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('aids');

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0];

  const handleAskAIAboutCourse = (courseName: string) => {
    sendChatMessage(`Tell me about the curriculum, syllabus, and placement opportunities for ${courseName}`);
    setCurrentPage('chat');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Courses & Departments</h1>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              AICTE Approved
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Explore world-class academic degree programs, specialized GPU labs, and faculty leadership.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter courses..."
            className="w-full rounded-xl border border-campus-border bg-campus-card pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Department Cards Quick Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDepts.map(dept => {
          const isSelected = dept.id === activeDept.id;
          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-glow-sm'
                  : 'border-campus-border bg-campus-card hover:bg-campus-hover'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                  {dept.code}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  ₹{(dept.annualFee / 100000).toFixed(2)}L / yr
                </span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                {dept.name}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {dept.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Department In-Depth View */}
      {activeDept && (
        <div className="rounded-3xl border border-campus-border bg-campus-card p-6 md:p-8 space-y-8 shadow-glass">
          {/* Department Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-campus-border/60 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-violet-400">
                  {activeDept.degree}
                </span>
                <span className="text-xs text-slate-400">{activeDept.duration}</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Department of {activeDept.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {activeDept.description}
              </p>
            </div>

            <button
              onClick={() => handleAskAIAboutCourse(activeDept.name)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:from-blue-500 hover:to-indigo-500 transition-all self-start md:self-auto shrink-0"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI About This Course</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-campus-border/70 bg-campus-surface/70 p-4">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Annual Intake</span>
              <div className="text-xl font-bold text-white mt-1">{activeDept.intake} Seats</div>
              <span className="text-[10px] text-blue-400">AICTE Approved</span>
            </div>
            <div className="rounded-xl border border-campus-border/70 bg-campus-surface/70 p-4">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Highest Package</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">₹{activeDept.highestPackageLPA} LPA</div>
              <span className="text-[10px] text-slate-400">Avg: ₹{activeDept.avgPackageLPA} LPA</span>
            </div>
            <div className="rounded-xl border border-campus-border/70 bg-campus-surface/70 p-4">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Cutoff Percentile</span>
              <div className="text-xl font-bold text-blue-400 mt-1">{activeDept.minCutoffPercentile}+</div>
              <span className="text-[10px] text-slate-400">JEE Main / State CET</span>
            </div>
            <div className="rounded-xl border border-campus-border/70 bg-campus-surface/70 p-4">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Annual Tuition</span>
              <div className="text-xl font-bold text-white mt-1">₹{activeDept.annualFee.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400">Scholarships available</span>
            </div>
          </div>

          {/* Faculty & Labs Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HOD & Faculty Details */}
            <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Head of Department (HOD)</span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white font-bold text-lg shadow-sm">
                  {activeDept.hod.name.slice(3, 5)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{activeDept.hod.name}</h4>
                  <p className="text-xs text-blue-400">{activeDept.hod.designation}</p>
                  <p className="text-[11px] text-slate-300">{activeDept.hod.qualification}</p>
                  <p className="text-[11px] text-slate-400">{activeDept.hod.email}</p>
                </div>
              </div>
            </div>

            {/* Specialized Labs */}
            <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Cpu className="h-4 w-4 text-violet-400" />
                <span>Specialized Research Laboratories</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeDept.labs.map((lab, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-campus-border/60 bg-campus-card p-3 text-xs text-slate-200"
                  >
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    <span>{lab}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Curriculum & Career Prospects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Subjects */}
            <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/60 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Course Curriculum Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeDept.keySubjects.map((subj, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-campus-border bg-campus-card px-3 py-1.5 text-xs text-slate-200"
                  >
                    {subj}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiters & Careers */}
            <div className="rounded-2xl border border-campus-border/70 bg-campus-surface/60 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Recruiters & Target Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeDept.topRecruiters.map((rec, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300"
                  >
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
