import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  LifeBuoy,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'];

export const AnalyticsPage: React.FC = () => {
  const { tickets, knowledge } = useApp();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [tickets.length, knowledge.length]);

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs text-slate-400">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-500 mr-2" />
        <span>Aggregating campus records and analytics...</span>
      </div>
    );
  }

  // Derive status counts dynamically from current tickets state
  const statusCounts = {
    Submitted: tickets.filter(t => t.status === 'Submitted').length,
    'Under Review': tickets.filter(t => t.status === 'Under Review').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    Resolved: tickets.filter(t => t.status === 'Resolved').length
  };

  const dynamicTicketChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Admin Analytics Dashboard</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
              Live Data Sync
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time metrics calculated dynamically from stored knowledge entries, support tickets, and enquiries.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 rounded-xl border border-campus-border bg-campus-card px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-campus-hover transition-colors self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-campus-border bg-campus-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total AI Queries</span>
            <Sparkles className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.summary.totalQueries}</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{analytics.summary.automationRatePercent}% Automated</span>
          </div>
        </div>

        <div className="rounded-2xl border border-campus-border bg-campus-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Support Tickets</span>
            <LifeBuoy className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{tickets.length}</div>
          <div className="text-[11px] text-slate-400">
            {tickets.filter(t => t.status === 'Resolved').length} successfully resolved
          </div>
        </div>

        <div className="rounded-2xl border border-campus-border bg-campus-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified FAQs</span>
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">{knowledge.length}</div>
          <div className="text-[11px] text-violet-400 font-semibold">
            Across 7 Academic Disciplines
          </div>
        </div>

        <div className="rounded-2xl border border-campus-border bg-campus-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Resolution Time</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.summary.avgResolutionHours}h</div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            Target SLA: &lt; 24 Hours
          </div>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Activity Trends Area Chart */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Weekly Query & Enquiry Volume</h3>
            <span className="text-[11px] text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.activityTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1527',
                    borderColor: '#1E2D4A',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="queries" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#queryGrad)" name="AI Queries" />
                <Area type="monotone" dataKey="enquiries" stroke="#10B981" strokeWidth={2} fill="transparent" name="Admissions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Ticket Status Distribution Bar Chart */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Support Ticket Status Breakdown</h3>
            <span className="text-[11px] text-slate-400">Live Application Records</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicTicketChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1527',
                    borderColor: '#1E2D4A',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Tickets Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Bottom: Knowledge Base Categories & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Base Categories Breakdown */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white">Knowledge Base Coverage by Category</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {analytics.categoryBreakdown.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1527',
                    borderColor: '#1E2D4A',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
            {analytics.categoryBreakdown.map((item: any, idx: number) => (
              <span key={idx} className="flex items-center gap-1.5 bg-campus-surface px-2 py-1 rounded border border-campus-border">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span>{item.name} ({item.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Live Event Stream / Activity Feed */}
        <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Application Activity Stream</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Live Feed
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {analytics.recentActivity.map((act: any, i: number) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-xl border border-campus-border/70 bg-campus-surface/60 p-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200 line-clamp-1">{act.title}</div>
                  <div className="text-[10px] text-blue-400">{act.category}</div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
