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
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  EnvelopeOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import FilterBar from "../../components/FilterBar";
import JobCard from "../../components/JobCard";
import Pagination from "../../components/Pagination";
import ApplyModal from "../../components/ApplyModal";
import { getJobs } from "../../api/mockJobs";
import { getApplications } from "../../api/mockApplications";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";

const PAGE_SIZE = 6;

const STATUS_LABELS = {
  Applied: "Applied",
  Interview: "Interviews",
  Shortlisted: "Shortlisted",
  Hired: "Offers",
  Rejected: "Closed",
};

const toPercentDelta = (current, previous) => {
  if (previous === undefined || previous === null) {
    return current > 0 ? "+100%" : "0%";
  }
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const delta = ((current - previous) / previous) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
};

export function StudentDashboard() {
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
    setFilters((prev) => {
      if (
        prev.query === nextFilters.query &&
        prev.company === nextFilters.company &&
        prev.location === nextFilters.location &&
        prev.type === nextFilters.type
      ) {
        return prev;
      }
      return nextFilters;
    });
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

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredJobs.length, page]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, page]);

  const jobMap = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc.set(job.id, job);
      return acc;
    }, new Map());
  }, [jobs]);

  const trendData = useMemo(() => {
    const now = new Date();
    const base = [];

    const getKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    const monthFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
    });

    for (let index = 5; index >= 0; index -= 1) {
      const pointDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
      base.push({
        key: getKey(pointDate),
        month: monthFormatter.format(pointDate),
        matches: 0,
        applied: 0,
      });
    }

    const buckets = base.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});

    jobs.forEach((job) => {
      if (!job.createdAt) return;
      const created = new Date(job.createdAt);
      const bucket = buckets[getKey(created)];
      if (bucket) bucket.matches += 1;
    });

    applications.forEach((application) => {
      if (!application.appliedAt) return;
      const appliedDate = new Date(application.appliedAt);
      const bucket = buckets[getKey(appliedDate)];
      if (bucket) bucket.applied += 1;
    });

    return base.map(({ month, matches, applied }) => ({
      month,
      matches,
      applied,
    }));
  }, [jobs, applications]);

  const currentTrend = trendData.length
    ? trendData[trendData.length - 1]
    : { matches: 0, applied: 0 };
  const previousTrend =
    trendData.length > 1 ? trendData[trendData.length - 2] : null;

  const activeApplications = useMemo(() => {
    return applications.filter((app) => app.status !== "Rejected").length;
  }, [applications]);

  const interviewCount = useMemo(() => {
    return applications.filter((app) => app.status === "Interview").length;
  }, [applications]);

  const upcomingInterview = useMemo(() => {
    return [...applications]
      .filter((app) => app.status === "Interview" && app.appliedAt)
      .sort(
        (a, b) =>
          new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      )[0];
  }, [applications]);

  const newRolesThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return jobs.filter((job) => {
      if (!job.createdAt) return false;
      return new Date(job.createdAt) >= weekAgo;
    }).length;
  }, [jobs]);

  const statusSummary = useMemo(() => {
    const baseStatuses = Object.keys(STATUS_LABELS);
    return baseStatuses.map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: applications.filter((app) => app.status === status).length,
    }));
  }, [applications]);

  const timeline = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime()
      )
      .slice(0, 4);
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

  const interviewLabel = useMemo(() => {
    if (!upcomingInterview?.appliedAt) return "No interviews scheduled";
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return formatter.format(new Date(upcomingInterview.appliedAt));
  }, [upcomingInterview]);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-elevated relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70" />
          <div className="relative flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Matches curated
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {filteredJobs.length}
              </p>
            </div>
            <p className="mt-auto text-xs font-medium text-blue-600">
              {toPercentDelta(currentTrend.matches, previousTrend?.matches)}{" "}
              this month
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <EnvelopeOpenIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Active applications
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {activeApplications}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              {applications.length} total submitted
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                New this week
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {newRolesThisWeek}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              Opportunities published in the last 7 days
            </p>
          </div>
        </div>

        <div className="card-elevated overflow-hidden p-6">
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Interviews
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {interviewCount}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">{interviewLabel}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Opportunity momentum
              </h2>
              <p className="text-sm text-slate-500">
                Track how curated matches convert into active applications over
                time.
              </p>
            </div>
            <div className="ml-auto rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {toPercentDelta(currentTrend.applied, previousTrend?.applied)}{" "}
              applied
            </div>
          </div>

          <div className="mt-6 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(221, 83%, 53%)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(221, 83%, 53%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(173, 58%, 39%)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(173, 58%, 39%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148,163,184,0.35)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={36}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{
                    stroke: "rgba(148,163,184,0.4)",
                    strokeDasharray: "4 2",
                  }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(203,213,225,0.6)",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 20px 50px -24px rgba(30,41,59,0.35)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="matches"
                  stroke="hsl(221,83%,53%)"
                  strokeWidth={2}
                  fill="url(#colorMatches)"
                />
                <Area
                  type="monotone"
                  dataKey="applied"
                  stroke="hsl(173,58%,39%)"
                  strokeWidth={2}
                  fill="url(#colorApplied)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated flex flex-col gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pipeline breakout
            </h2>
            <p className="text-sm text-slate-500">
              See how each application is progressing across stages.
            </p>
          </div>
          <div className="space-y-4">
            {statusSummary.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">
                    Status updates synced automatically
                  </p>
                </div>
                <span className="text-lg font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <FilterBar onChange={handleFiltersChange} jobs={jobs} />
          <div className="card-elevated divide-y divide-slate-100">
            <div className="flex flex-wrap items-center gap-3 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recommended roles
                </h2>
                <p className="text-sm text-slate-500">
                  Tailored to your skillset and hiring preferences.
                </p>
              </div>
              <div className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                {filteredJobs.length} matches
              </div>
            </div>

            <div className="grid gap-5 px-6 py-6">
              {loading ? (
                <div className="space-y-3 text-sm text-slate-500">
                  <p>Loading your personalised feed…</p>
                  <div className="h-24 rounded-2xl bg-slate-100/70" />
                  <div className="h-24 rounded-2xl bg-slate-100/70" />
                </div>
              ) : paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                  <p className="text-base font-semibold text-slate-700">
                    No roles match your filters yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try broadening your filters or check back when new companies
                    join placement week.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={filteredJobs.length}
                onChange={setPage}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest activity
            </h2>
            <p className="text-sm text-slate-500">
              Stay on top of recruiter actions and next steps.
            </p>
            <div className="mt-6 space-y-5">
              {timeline.length > 0 ? (
                timeline.map((item) => {
                  const relatedJob = jobMap.get(item.jobId);
                  const dateLabel = item.appliedAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(item.appliedAt))
                    : "—";

                  const monthToken = dateLabel.split(" ")[0] || "";

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="mt-1 h-9 w-9 rounded-xl bg-brand-50 text-brand-600">
                        <div className="flex h-full items-center justify-center text-sm font-semibold">
                          {monthToken}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {relatedJob?.title || "Opportunity"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {STATUS_LABELS[item.status] || item.status} •{" "}
                          {relatedJob?.companyName || "Unknown company"}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        {dateLabel}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                  No activity yet—start applying to create momentum.
                </div>
              )}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Skill signals
            </h2>
            <p className="text-sm text-slate-500">
              Strengthen capabilities aligned with top hiring tracks.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "React",
                "TypeScript",
                "Product thinking",
                "Systems design",
                "SQL",
                "Data storytelling",
              ].map((skill) => (
                <div
                  key={skill}
                  className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-inner"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Need a prep boost?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Join a 45&nbsp;minute mock interview session with alumni mentors
              to refine your story.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500"
            >
              Book a slot
            </button>
          </div>
        </div>
      </section>

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={closeModal}
          onApplied={async () => {
            await refreshApplications();
            closeModal();
          }}
        />
      )}
    </div>
  );
}

export default StudentDashboard;
