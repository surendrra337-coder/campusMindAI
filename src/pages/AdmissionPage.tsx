import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  UserCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  Send,
  AlertCircle,
  Calendar,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

const ADMISSION_STEPS = [
  {
    step: '01',
    title: 'Eligibility & Entrance Exam',
    desc: 'Verify 10+2 PCM minimum 60% aggregate. Appear for State CET or JEE Main entrance examination.'
  },
  {
    step: '02',
    title: 'Counseling & Option Entry',
    desc: 'Register on state centralized counseling portal and select Apex Institute as first choice preference.'
  },
  {
    step: '03',
    title: 'Seat Allotment & Provisional Acceptance',
    desc: 'Download allotment letter and submit provisional token fee via state gateway.'
  },
  {
    step: '04',
    title: 'Physical Reporting & Document Verification',
    desc: 'Visit Main Admin Block Room 102 with all original documents and photocopies.'
  },
  {
    step: '05',
    title: 'Tuition Fee Payment & ERP ID Generation',
    desc: 'Complete semester fee payment, hostel room allotment, and receive college digital email ID.'
  }
];

const INITIAL_CHECKLIST = [
  { id: 'c1', label: '10th Secondary Mark Sheet & Birth Certificate', checked: true },
  { id: 'c2', label: '12th Higher Secondary Mark Sheet & Passing Certificate', checked: true },
  { id: 'c3', label: 'JEE Main or State CET Entrance Rank Card', checked: true },
  { id: 'c4', label: 'Central Counseling Seat Allotment Letter', checked: false },
  { id: 'c5', label: 'Transfer & Character Certificate from previous school', checked: false },
  { id: 'c6', label: 'Migration Certificate (Original mandatory)', checked: false },
  { id: 'c7', label: 'Caste / Category Certificate (if applicable)', checked: false },
  { id: 'c8', label: 'Medical Fitness Certificate signed by MBBS Doctor', checked: false },
  { id: 'c9', label: '6 Recent Passport-size color photos + Parent Aadhaar copies', checked: false }
];

export const AdmissionPage: React.FC = () => {
  const { showToast, departments, setCurrentPage, sendChatMessage } = useApp();

  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);

  // Enquiry form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetCourse: 'B.Tech Artificial Intelligence & Data Science',
    currentQualification: '12th Science (PCM)',
    city: '',
    preferredYear: '2027',
    message: ''
  });

  const toggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitEnquiry(formData);
      setSubmittedEnquiry(res);
      showToast(`Enquiry ${res.id} submitted successfully! Our Admissions team will reach out.`, 'success');
    } catch {
      showToast('Failed to submit enquiry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
          <GraduationCap className="h-3.5 w-3.5" />
          Admissions 2026-2027
        </div>
        <h1 className="text-3xl font-extrabold text-white">Admission Guidance & Eligibility</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Everything prospective engineering students need: step-by-step enrollment roadmap, cutoff scores, verification checklist, and direct admission counselors.
        </p>
      </div>

      {/* Step-by-Step Roadmap */}
      <div className="rounded-2xl border border-campus-border bg-campus-card p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-campus-border/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Step-by-Step Admission Process</h2>
            <p className="text-xs text-slate-400">
              Clear roadmap from initial entrance examination to class orientation.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-blue-400 font-semibold">
            5 Simple Steps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ADMISSION_STEPS.map((s, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border border-campus-border/70 bg-campus-surface/70 p-4 space-y-2 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-blue-500/80 font-mono">{s.step}</span>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <h3 className="text-xs font-bold text-white leading-tight">{s.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Document Verification Checklist & Course Cutoffs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Document Checklist */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Physical Verification Checklist</h3>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              {progressPercent}% Ready
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Click checkboxes to track documents you have already collected for your reporting day:
          </p>

          <div className="space-y-2">
            {checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  item.checked
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-slate-200'
                    : 'border-campus-border/70 bg-campus-surface/60 text-slate-400 hover:bg-campus-hover'
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border mt-0.5 ${
                    item.checked
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-500 bg-transparent'
                  }`}
                >
                  {item.checked && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs select-none">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Programs & Cutoff Matrix */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              <h3 className="text-base font-bold text-white">Program Cutoffs & Fees (2026-27)</h3>
            </div>
            <button
              onClick={() => setCurrentPage('courses')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>All Courses</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {departments.slice(0, 3).map(dept => (
              <div
                key={dept.id}
                className="rounded-xl border border-campus-border/70 bg-campus-surface/60 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{dept.name}</h4>
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    {dept.code}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1 border-t border-campus-border/50">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Annual Fee</span>
                    <span className="font-semibold text-emerald-400">₹{dept.annualFee.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">JEE Cutoff %ile</span>
                    <span className="font-semibold text-blue-400">{dept.minCutoffPercentile}+</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Seats Intake</span>
                    <span className="font-semibold text-slate-200">{dept.intake} seats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300 leading-relaxed">
            * Cutoff percentiles and fees shown are illustrative institutional benchmarks for prototype demonstration.
          </div>
        </div>
      </div>

      {/* Official Admission Enquiry Form */}
      <div className="rounded-2xl border border-campus-border bg-gradient-to-b from-campus-surface to-campus-card p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white">Submit an Admission Enquiry</h3>
          <p className="text-xs text-slate-400 mt-1">
            Have questions about merit scholarships or quota seats? Fill out this enquiry form and our counselors will respond.
          </p>
        </div>

        {submittedEnquiry ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Enquiry Received! ({submittedEnquiry.id})</h4>
            <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold">{submittedEnquiry.fullName}</span>! Your enquiry regarding{' '}
              <span className="font-semibold">{submittedEnquiry.targetCourse}</span> has been logged and forwarded to the Admissions Cell.
            </p>
            <button
              onClick={() => setSubmittedEnquiry(null)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Aryan Sharma"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aryan@gmail.com"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Engineering Course *</label>
                <select
                  value={formData.targetCourse}
                  onChange={e => setFormData({ ...formData, targetCourse: e.target.value })}
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="B.Tech Artificial Intelligence & Data Science">
                    B.Tech Artificial Intelligence & Data Science
                  </option>
                  <option value="B.Tech Computer Science & Engineering">
                    B.Tech Computer Science & Engineering
                  </option>
                  <option value="B.Tech Electronics & Communication">
                    B.Tech Electronics & Communication
                  </option>
                  <option value="B.Tech Mechanical & Mechatronics">
                    B.Tech Mechanical & Mechatronics
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Current Qualification / Score</label>
                <input
                  type="text"
                  value={formData.currentQualification}
                  onChange={e => setFormData({ ...formData, currentQualification: e.target.value })}
                  placeholder="e.g. 12th PCM 91%, JEE 94%ile"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">City / State</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Specific Query / Questions</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ask about scholarship cutoffs, hostel allotment, or direct counseling process..."
                className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-glow hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Admission Enquiry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
