import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { getJobs } from "../../api/mockJobs";
import { getApplicationsByJob } from "../../api/mockApplications";

const STATUS_LABELS = {
  Applied: "Applied",
  Shortlisted: "Shortlisted",
  Interview: "Interviews",
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

const PIPELINE_STATUSES = new Set(["Shortlisted", "Interview", "Hired"]);

export function RecruiterDashboard() {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const recruiterId = user?.id ?? 101;

    const load = async () => {
      setLoading(true);
      try {
        const jobData = await getJobs({ postedBy: recruiterId });
        const jobSnapshots = await Promise.all(
          jobData.map(async (job) => {
            const applicants = await getApplicationsByJob(job.id);
            return { job, applicants };
          })
        );

        if (active) {
          setSnapshots(jobSnapshots);
        }
      } catch (error) {
        console.error("Failed to load recruiter dashboard", error);
        if (active) {
          setSnapshots([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const jobs = useMemo(() => snapshots.map((item) => item.job), [snapshots]);

  const jobMap = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc.set(job.id, job);
      return acc;
    }, new Map());
  }, [jobs]);

  const allApplications = useMemo(() => {
    return snapshots.flatMap((item) => item.applicants);
  }, [snapshots]);

  const activeRoles = useMemo(
    () => jobs.filter((job) => job.approved).length,
    [jobs]
  );

  const pendingRoles = useMemo(
    () => jobs.filter((job) => !job.approved).length,
    [jobs]
  );

  const totalApplicants = allApplications.length;

  const pipelineCount = useMemo(
    () =>
      allApplications.filter((app) => PIPELINE_STATUSES.has(app.status)).length,
    [allApplications]
  );

  const interviewCount = useMemo(
    () => allApplications.filter((app) => app.status === "Interview").length,
    [allApplications]
  );

  const momentumData = useMemo(() => {
    const now = new Date();
    const points = [];
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

    const getKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

    for (let index = 5; index >= 0; index -= 1) {
      const pointDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
      points.push({
        key: getKey(pointDate),
        month: monthFormatter.format(pointDate),
        received: 0,
        advanced: 0,
      });
    }

    const buckets = points.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});

    allApplications.forEach((application) => {
      if (!application.appliedAt) return;
      const appliedDate = new Date(application.appliedAt);
      const bucket = buckets[getKey(appliedDate)];
      if (!bucket) return;
      bucket.received += 1;
      if (PIPELINE_STATUSES.has(application.status)) {
        bucket.advanced += 1;
      }
    });

    return points.map(({ month, received, advanced }) => ({
      month,
      received,
      advanced,
    }));
  }, [allApplications]);

  const currentMomentum = momentumData.length
    ? momentumData[momentumData.length - 1]
    : { received: 0, advanced: 0 };
  const previousMomentum =
    momentumData.length > 1 ? momentumData[momentumData.length - 2] : null;

  const statusSummary = useMemo(() => {
    const statuses = Object.keys(STATUS_LABELS);
    return statuses.map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: allApplications.filter((app) => app.status === status).length,
    }));
  }, [allApplications]);

  const rolePerformance = useMemo(() => {
    return snapshots
      .map(({ job, applicants }) => ({
        title: job.title,
        approved: job.approved,
        applicants: applicants.length,
        advanced: applicants.filter((app) => PIPELINE_STATUSES.has(app.status))
          .length,
        location: job.location,
        createdAt: job.createdAt,
        id: job.id,
      }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 4);
  }, [snapshots]);

  const chartData = useMemo(() => {
    return snapshots
      .map(({ job, applicants }) => ({
        name: job.title,
        applicants: applicants.length,
        advanced: applicants.filter((app) => PIPELINE_STATUSES.has(app.status))
          .length,
      }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 6)
      .map((item) => ({
        ...item,
        label: item.name.length > 18 ? `${item.name.slice(0, 18)}…` : item.name,
      }));
  }, [snapshots]);

  const timeline = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });

    return [...allApplications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime()
      )
      .slice(0, 5)
      .map((item) => ({
        ...item,
        job: jobMap.get(item.jobId),
        appliedLabel: item.appliedAt
          ? formatter.format(new Date(item.appliedAt))
          : "—",
      }));
  }, [allApplications, jobMap]);

  const pendingApprovals = useMemo(() => {
    return jobs
      .filter((job) => !job.approved)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [jobs]);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-elevated relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60" />
          <div className="relative flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Roles live
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : activeRoles}
              </p>
            </div>
            <p className="mt-auto text-xs font-medium text-blue-600">
              {pendingRoles} pending approval
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Applicants
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : totalApplicants}
              </p>
            </div>
            <p className="mt-auto text-xs font-medium text-slate-500">
              {toPercentDelta(
                currentMomentum.received,
                previousMomentum?.received
              )}{" "}
              vs last month
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Pipeline ready
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : pipelineCount}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              {toPercentDelta(
                currentMomentum.advanced,
                previousMomentum?.advanced
              )}{" "}
              progressed month-over-month
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
                Interviews
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : interviewCount}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              Next follow-up {timeline[0]?.appliedLabel || "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Momentum of applicants
              </h2>
              <p className="text-sm text-slate-500">
                Track how quickly applicants enter and advance through your
                hiring pipeline.
              </p>
            </div>
            <div className="ml-auto rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {toPercentDelta(
                currentMomentum.advanced,
                previousMomentum?.advanced
              )}{" "}
              advanced
            </div>
          </div>

          <div className="mt-6 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={momentumData}
                margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="recruiterReceived"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(221,83%,53%)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(221,83%,53%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="recruiterAdvanced"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(160,64%,45%)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(160,64%,45%)"
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
                  dataKey="received"
                  stroke="hsl(221,83%,53%)"
                  strokeWidth={2}
                  fill="url(#recruiterReceived)"
                />
                <Area
                  type="monotone"
                  dataKey="advanced"
                  stroke="hsl(160,64%,45%)"
                  strokeWidth={2}
                  fill="url(#recruiterAdvanced)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated flex flex-col gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pipeline snapshot
            </h2>
            <p className="text-sm text-slate-500">
              Understand where applicants stand across every stage.
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
                    Status updates sync with candidate actions.
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
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Role performance
              </h2>
              <p className="text-sm text-slate-500">
                Identify roles attracting the healthiest pipelines.
              </p>
            </div>
          </div>
          <div className="mt-6 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 16, bottom: 0, left: -10 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148,163,184,0.35)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  interval={0}
                  angle={0}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={36}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148,163,184,0.08)" }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(203,213,225,0.6)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                  }}
                />
                <Bar
                  dataKey="applicants"
                  fill="hsl(221,83%,53%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
                <Bar
                  dataKey="advanced"
                  fill="hsl(160,64%,45%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest candidate activity
            </h2>
            <p className="text-sm text-slate-500">
              Follow up on next actions from interviews and assessments.
            </p>
            <div className="mt-5 space-y-4">
              {timeline.length > 0 ? (
                timeline.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="mt-1 h-9 w-9 rounded-xl bg-brand-50 text-brand-600">
                      <div className="flex h-full items-center justify-center text-sm font-semibold">
                        {item.appliedLabel.split(" ")[0] || ""}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.job?.title || "Untitled role"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {STATUS_LABELS[item.status] || item.status} ·{" "}
                        {item.name || item.email || "Candidate"}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {item.appliedLabel}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                  No recent activity yet—start sourcing to fill the funnel.
                </div>
              )}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Approvals queue
            </h2>
            <p className="text-sm text-slate-500">
              Review drafts to unlock new placement requests.
            </p>
            <div className="mt-4 space-y-3">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {job.companyName} · {job.location || "Remote"}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {job.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                          }).format(new Date(job.createdAt))
                        : "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                  All roles are live—great work keeping approvals moving.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {rolePerformance.map((role) => (
          <div key={role.id} className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {role.title}
                </p>
                <p className="text-xs text-slate-500">
                  {role.location || "Remote"}
                </p>
              </div>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {role.advanced} pipeline
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total applicants</span>
                <span className="text-sm font-semibold text-slate-800">
                  {role.applicants}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{
                    width: role.applicants
                      ? `${Math.min(
                          100,
                          (role.advanced / role.applicants) * 100
                        )}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Approval</span>
                <span className="font-semibold text-slate-700">
                  {role.approved ? "Live" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
