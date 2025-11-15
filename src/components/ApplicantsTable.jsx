import React from "react";
import clsx from "clsx";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Shortlisted: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Interview: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-100",
};

export default function ApplicantsTable({ applicants, onStatusChange }) {
  if (!applicants.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-5 py-3">Candidate</th>
            <th className="px-5 py-3">Applied on</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Update</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr
              key={applicant.id}
              className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
            >
              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {applicant.name}
                  </span>
                  <span className="text-xs text-slate-500">{applicant.email}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                {new Date(applicant.appliedAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-4">
                <span
                  className={clsx(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                    statusStyles[applicant.status] || "bg-slate-100 text-slate-600"
                  )}
                >
                  {applicant.status}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <select
                  value={applicant.status}
                  onChange={(event) => onStatusChange(applicant.id, event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-brand-400 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
