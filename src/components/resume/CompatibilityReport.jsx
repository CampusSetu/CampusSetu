import React from "react";
import {
  ArrowTrendingUpIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function CompatibilityReport({ report }) {
  if (!report) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
        Compatibility metrics show up once you save a resume.
      </section>
    );
  }

  const { matches = [], insights = [], averageScore = 0 } = report;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
            <ArrowTrendingUpIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              ATS Compatibility
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              Average score {averageScore}%
            </h2>
            <p className="text-sm text-slate-500">
              Based on approved roles that match your discipline.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Smart suggestions
            </p>
            <p className="text-xs text-slate-500">
              Prioritized actions to lift your resume score.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {insights.length ? (
            insights.map((tip, index) => (
              <li
                key={`insight-${index}`}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600"
              >
                {tip}
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
              You're in great shape—keep tailoring for each role.
            </li>
          )}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Top matches</p>
            <p className="text-xs text-slate-500">
              Focus on the roles that already trust your strengths.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2">Role</th>
                <th className="py-2">Company</th>
                <th className="py-2">Score</th>
                <th className="py-2">Missing keywords</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {matches.map((match) => (
                <tr key={match.jobId} className="align-top">
                  <td className="py-3">
                    <div className="font-semibold text-slate-900">
                      {match.jobTitle}
                    </div>
                    <div className="text-xs text-slate-500">{match.type}</div>
                  </td>
                  <td className="py-3 text-slate-500">{match.companyName}</td>
                  <td className="py-3 font-semibold text-brand-600">
                    {match.score}%
                  </td>
                  <td className="py-3 text-xs text-slate-500">
                    {match.missingSkills.length
                      ? match.missingSkills.join(", ")
                      : "All keywords covered"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
