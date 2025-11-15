import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SparklesIcon,
  EnvelopeOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import MetricCard from "../../components/dashboard/MetricCard";
import FilterBar from "../../components/FilterBar";
import JobCard from "../../components/JobCard";
import Pagination from "../../components/Pagination";
import ApplyModal from "../../components/ApplyModal";
import { getJobs } from "../../api/mockJobs";
import { getApplications } from "../../api/mockApplications";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";

const PAGE_SIZE = 6;

const toPercentDelta = (current, previous) => {
  if (previous === undefined || previous === null || previous === 0) {
    if (current === 0) return "No change";
    return current > 0 ? "New" : "—";
  }
  const delta = ((current - previous) / previous) * 100;
  if (delta > 999) return "+999%";
  if (delta < -99) return "-99%";
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
};

function StudentDashboard() {
  const { user } = useAuth();
  const { openAuthModal } = useUI();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    company: "",
    location: "",
    type: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const refreshApplications = useCallback(async () => {
    if (!user?.id) {
      setApplications([]);
      return;
    }
    try {
      const next = await getApplications(user.id);
      setApplications(next);
    } catch (error) {
      console.error("Failed to load applications", error);
    }
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [jobData, applicationData] = await Promise.all([
          getJobs({ approved: true }),
          user?.id ? getApplications(user.id) : Promise.resolve([]),
        ]);

        if (!cancelled) {
          setJobs(jobData);
          setApplications(applicationData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        if (!cancelled) {
          setJobs([]);
          setApplications([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredJobs = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return jobs.filter((job) => {
      if (filters.company && job.companyName !== filters.company) return false;
      if (filters.location && job.location !== filters.location) return false;
      if (filters.type && job.type !== filters.type) return false;

      if (!query) return true;

      const haystack = [
        job.title,
        job.companyName,
        job.location,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [jobs, filters]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, page]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);

  // Trend data for the area chart
  const trendData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const base = monthNames.map((month) => ({ month, matches: 0, applied: 0 }));
    
    const buckets = {};
    base.forEach((item) => {
      buckets[item.month] = item;
    });

    const getKey = (date) => {
      const d = new Date(date);
      return monthNames[d.getMonth()];
    };

    jobs.forEach((job) => {
      if (!job.createdAt) return;
      const bucket = buckets[getKey(job.createdAt)];
      if (bucket) bucket.matches += 1;
    });

    applications.forEach((application) => {
      if (!application.appliedAt) return;
      const bucket = buckets[getKey(application.appliedAt)];
      if (bucket) bucket.applied += 1;
    });

    return base;
  }, [jobs, applications]);

  const currentTrend = trendData.length ? trendData[trendData.length - 1] : { matches: 0, applied: 0 };
  const previousTrend = trendData.length > 1 ? trendData[trendData.length - 2] : null;

  const activeApplications = useMemo(() => {
    return applications.filter((app) => app.status !== "Rejected").length;
  }, [applications]);

  const newRolesThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return jobs.filter((job) => {
      if (!job.createdAt) return false;
      return new Date(job.createdAt) >= weekAgo;
    }).length;
  }, [jobs]);

  const upcomingInterview = useMemo(() => {
    return [...applications]
      .filter((app) => app.status === "Interview" && app.appliedAt)
      .sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime())[0];
  }, [applications]);

  const handleApply = useCallback(
    (job) => {
      if (!user) {
        openAuthModal?.();
        return;
      }
      setSelectedJob(job);
    },
    [openAuthModal, user]
  );

  const closeModal = useCallback(() => {
    setSelectedJob(null);
  }, []);

  return (
    <DashboardLayout
      title="Student Dashboard"
      navItems={dashboardNavConfig.student}
      role="student"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/50 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="pointer-events-none absolute -top-24 left-6 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Student workspace</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {user?.name
                    ? `Welcome back, ${user.name.split(" ")[0]}!`
                    : "Your career launchpad"}
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                  Discover opportunities matched to your skills, track your applications, and stay in sync with campus recruiters.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('job-feed')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
                >
                  Explore opportunities
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = '/student/applications'}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
                >
                  View applications
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:w-auto">
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Live roles
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {filteredJobs.length}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Approved and visible to you right now.
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Awaiting response
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {activeApplications}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Placement team will nudge you for updates if needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="card-elevated relative overflow-hidden p-6">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60" />
            <div className="relative flex h-full flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Matches Curated
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loading ? "—" : filteredJobs.length}
                </p>
              </div>
              <p className="mt-auto text-xs font-medium text-blue-600">
                {toPercentDelta(currentTrend.matches, previousTrend?.matches)} this month
              </p>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex h-full flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <EnvelopeOpenIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Active Applications
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loading ? "—" : activeApplications}
                </p>
              </div>
              <p className="mt-auto text-xs font-medium text-slate-500">
                {applications.length} total submitted
              </p>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex h-full flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDaysIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  New This Week
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loading ? "—" : newRolesThisWeek}
                </p>
              </div>
              <p className="mt-auto text-xs font-medium text-slate-500">
                Opportunities published in the last 7 days
              </p>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex h-full flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ClockIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Next Interview
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loading ? "—" : (upcomingInterview ? "Scheduled" : "None")}
                </p>
              </div>
              <p className="mt-auto text-xs font-medium text-slate-500">
                {upcomingInterview ? "Check your applications" : "No interviews scheduled"}
              </p>
            </div>
          </div>
        </section>

        {/* Activity Trend Chart */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Activity Trend</h2>
              <p className="mt-1 text-sm text-slate-500">Your application activity over the last 12 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(79, 70, 229)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(79, 70, 229)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="matches"
                stroke="rgb(59, 130, 246)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMatches)"
              />
              <Area
                type="monotone"
                dataKey="applied"
                stroke="rgb(79, 70, 229)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplied)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Jobs Listing */}
        <section id="job-feed" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Available Opportunities</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} matching your criteria
              </p>
            </div>
          </div>

          <FilterBar
            onChange={handleFiltersChange}
            jobs={jobs}
          />

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
              <p className="text-sm text-slate-500">No jobs match your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={() => handleApply(job)} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </section>
      </div>

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={closeModal}
          onSuccess={refreshApplications}
        />
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;
 