import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRightIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const statusTokens = {
  live: {
    label: "Live",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    subtitle: "Visible to students",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-100",
    subtitle: "Awaiting approval",
  },
  expired: {
    label: "Expired",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
    subtitle: "Deadline passed",
  },
};

const formatDeadline = (deadline) => {
  if (!deadline) {
    return {
      display: "Not set",
      meta: "Flexible timeline",
      tone: "text-slate-400",
    };
  }

  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffInDays = Math.ceil(
    (deadlineDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  if (diffInDays > 0) {
    return {
      display: deadlineDate.toLocaleDateString(),
      meta: `${diffInDays} day${diffInDays === 1 ? "" : "s"} left`,
      tone: "text-emerald-600",
    };
  }

  if (diffInDays === 0) {
    return {
      display: deadlineDate.toLocaleDateString(),
      meta: "Due today",
      tone: "text-amber-600",
    };
  }

  return {
    display: deadlineDate.toLocaleDateString(),
    meta: `${Math.abs(diffInDays)} day${Math.abs(diffInDays) === 1 ? "" : "s"} ago`,
    tone: "text-rose-600",
  };
};

const getStatusToken = (job) => {
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  if (!job.approved) return statusTokens.pending;
  if (isExpired) return statusTokens.expired;
  return statusTokens.live;
};

export function JobListTable({ jobs, onDelete }) {
  if (!jobs.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-5 py-3">Role details</th>
            <th className="px-5 py-3">Qualification</th>
            <th className="px-5 py-3">Timeline</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => {
            const statusToken = getStatusToken(job);
            const deadline = formatDeadline(job.deadline);
            return (
              <tr
                key={job.id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {job.companyName || "Company TBD"} • {job.location || "Remote"}
                        </p>
                      </div>
                      {job.type && (
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                          {job.type}
                        </span>
                      )}
                    </div>
                    {job.shortDescription && (
                      <p className="text-xs text-slate-500">
                        {job.shortDescription}
                      </p>
                    )}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-lg font-semibold text-slate-900">
                    {job.minCgpa ? job.minCgpa.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-slate-500">Min CGPA</p>
                </td>
                <td className="px-5 py-4">
                  <p className={`text-sm font-semibold ${deadline.tone}`}>
                    {deadline.display}
                  </p>
                  <p className="text-xs text-slate-500">{deadline.meta}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusToken.className}`}
                    >
                      {statusToken.label}
                    </span>
                    <p className="text-[11px] text-slate-400">{statusToken.subtitle}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                    >
                      View
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/recruiter/edit-job/${job.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"
                    >
                      Edit
                      <PencilSquareIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600"
                    >
                      Delete
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
