import React from "react";

const detailBadges = (job) =>
  [job.type, job.minCgpa ? `${job.minCgpa}+ CGPA` : null].filter(Boolean);

export function ApprovalQueue({ jobs, onApprove }) {
  if (!jobs.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          <tr>
            <th className="px-5 py-3">Company</th>
            <th className="px-5 py-3">Role details</th>
            <th className="px-5 py-3">Submitted</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50/80"
            >
              <td className="px-5 py-5">
                <p className="text-sm font-semibold text-slate-900">
                  {job.companyName}
                </p>
                <p className="text-xs text-slate-500">{job.location || "Remote"}</p>
              </td>
              <td className="px-5 py-5">
                <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                {detailBadges(job).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detailBadges(job).map((detail) => (
                      <span
                        key={detail}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-5 py-5 text-sm font-semibold text-slate-900">
                {new Date(job.createdAt).toLocaleDateString()}
                {job.deadline && (
                  <p className="text-xs font-medium text-slate-400">
                    Deadline {new Date(job.deadline).toLocaleDateString()}
                  </p>
                )}
              </td>
              <td className="px-5 py-5 text-right">
                <button
                  onClick={() => onApprove(job.id)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
