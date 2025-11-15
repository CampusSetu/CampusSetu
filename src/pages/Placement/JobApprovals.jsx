import React, { useEffect, useState } from "react";
import { getJobs, patchJobApproval } from "../../api/mockJobs";
import { ApprovalQueue } from "../../components/ApprovalQueue";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";

export function JobApprovals() {
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    getJobs({ approved: false }).then(setPendingJobs);
  }, []);

  const handleApprove = (jobId) => {
    patchJobApproval(jobId, true).then(() => {
      setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
    });
  };

  const pendingCount = pendingJobs.length;
  const pendingLabel = pendingCount === 1 ? "submission" : "submissions";
  const lastUpdated = pendingJobs[0]?.createdAt
    ? new Date(pendingJobs[0].createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <DashboardLayout
      title="Job Approvals"
      navItems={dashboardNavConfig.placement}
      role="placement"
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-brand-50/70 to-slate-50 px-7 py-8 shadow-card">
          <div className="pointer-events-none absolute -top-16 left-10 h-40 w-40 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-48 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-500">
                Queue health
              </p>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Stay ahead of recruiter submissions
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Validate role details, enforce policies, and keep students seeing only approved openings.
                </p>
              </div>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
              <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Pending reviews
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {pendingCount}
                </p>
                <p className="text-xs text-slate-500">
                  {pendingLabel} waiting for action
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Last submission
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {lastUpdated}
                </p>
                <p className="text-xs text-slate-500">Most recent recruiter upload</p>
              </div>
            </div>
          </div>
        </section>

        {pendingCount > 0 ? (
          <ApprovalQueue jobs={pendingJobs} onApprove={handleApprove} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Approval queue is clear
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              New recruiter submissions will appear here for review.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
