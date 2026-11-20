import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportTicket, TicketCategory, TicketStatus } from '../types';
import {
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Filter,
  Send,
  MessageSquare,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CATEGORIES: TicketCategory[] = [
  'Academic',
  'Fee & Scholarship',
  'Hostel',
  'Placement',
  'Examinations',
  'Technical Support',
  'General'
];

export const SupportPage: React.FC = () => {
  const { tickets, createTicket, updateTicketStatus, isAdminMode, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New Ticket Form State
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Academic');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolution modal state for Admin
  const [adminStatus, setAdminStatus] = useState<TicketStatus>('In Progress');
  const [adminNotes, setAdminNotes] = useState('');

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      t.id.toLowerCase().includes(s) ||
      t.subject.toLowerCase().includes(s) ||
      t.studentName.toLowerCase().includes(s) ||
      t.category.toLowerCase().includes(s);
    return matchesStatus && matchesSearch;
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTicket({
        studentName: studentName.trim(),
        rollNumber: rollNumber.trim() || '23AI-GUEST',
        email: email.trim(),
        category,
        priority,
        subject: subject.trim(),
        message: message.trim()
      });

      // Reset form
      setStudentName('');
      setRollNumber('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsFormOpen(false);
    } catch {
      showToast('Failed to create ticket.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string) => {
    try {
      await updateTicketStatus(ticketId, adminStatus, adminNotes);
      setSelectedTicket(null);
      setAdminNotes('');
    } catch {
      showToast('Failed to update ticket status.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Student Support Center</h1>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
              {tickets.length} Tickets
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Submit formal campus grievances, course adjustment requests, and hostel maintenance tickets.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:from-blue-500 hover:to-indigo-500 transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isFormOpen ? 'Close Ticket Form' : 'Create Support Ticket'}</span>
        </button>
      </div>

      {/* Ticket Creation Form Collapse */}
      {isFormOpen && (
        <div className="rounded-2xl border border-campus-border bg-gradient-to-b from-campus-surface to-campus-card p-6 md:p-8 shadow-glass space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-campus-border/60 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-cyan-400" />
              <span>Submit a Formal Helpdesk Ticket</span>
            </h2>
            <span className="text-[11px] text-slate-400">Unique tracking ID generated upon submission</span>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Yash Vardhan"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Roll / Application Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="e.g. 23AI088"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">College Email ID *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yash.23ai088@apex.edu"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Grievance Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TicketCategory)}
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as SupportTicket['priority'])}
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Regular Request)</option>
                  <option value="High">High (Impacting Studies/Stay)</option>
                  <option value="Urgent">Urgent (Immediate Intervention)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject Summary *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Mid-term exam clash with hackathon"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Provide specific details, dates, course codes, or room numbers..."
                className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg px-4 py-2 font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Dispatch Support Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets by ID (e.g. TKT-1082), student name, or keyword..."
            className="w-full rounded-xl border border-campus-border bg-campus-card pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-glow-sm'
                  : 'border border-campus-border bg-campus-card text-slate-300 hover:bg-campus-hover'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3.5">
        {filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-campus-border bg-campus-card p-12 text-center space-y-2">
            <LifeBuoy className="h-8 w-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No support tickets found</h3>
            <p className="text-xs text-slate-400">
              There are no support tickets matching your current filters.
            </p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isResolved = ticket.status === 'Resolved';
            const isInProgress = ticket.status === 'In Progress';
            const isUnderReview = ticket.status === 'Under Review';

            return (
              <div
                key={ticket.id}
                className="rounded-2xl border border-campus-border bg-campus-card p-5 space-y-3 shadow-sm hover:border-campus-border/90 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-campus-border/60 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <span className="rounded bg-campus-surface px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-campus-border">
                      {ticket.category}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.priority === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : ticket.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isResolved
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : isUnderReview
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ticket.status}
                    </span>

                    {isAdminMode && (
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setAdminStatus(ticket.status);
                          setAdminNotes(ticket.resolutionNotes || '');
                        }}
                        className="rounded-lg bg-violet-600/20 border border-violet-500/40 px-2.5 py-1 text-[11px] font-semibold text-violet-300 hover:bg-violet-600/40 transition-colors"
                      >
                        Update Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Subject & Description */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{ticket.subject}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {ticket.message}
                  </p>
                </div>

                {/* Resolution Notes (if available) */}
                {ticket.resolutionNotes && (
                  <div className="rounded-xl border border-campus-border/80 bg-campus-surface/70 p-3 text-xs space-y-1">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Resolution / Progress Log ({ticket.assignedTo || 'Academic Cell'}):</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {ticket.resolutionNotes}
                    </p>
                  </div>
                )}

                {/* Footer metadata */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-campus-border/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-500" />
                      {ticket.studentName} ({ticket.rollNumber})
                    </span>
                    <span>•</span>
                    <span>{ticket.email}</span>
                  </div>
                  <span>Logged: {new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Status Updater Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-campus-border bg-campus-card p-6 shadow-glass space-y-4">
            <div className="flex items-center justify-between border-b border-campus-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white">
                  Update Ticket {selectedTicket.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Set New Status</label>
                <select
                  value={adminStatus}
                  onChange={e => setAdminStatus(e.target.value as TicketStatus)}
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Resolution / Progress Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="e.g. Investigation completed, network router rebooted, verified by warden."
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-campus-border">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-lg px-4 py-2 font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedTicket.id)}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
