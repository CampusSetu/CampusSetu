import React from "react";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function SkillSignalsPanel({ data = [], selectedSkills = [] }) {
  if (!data.length) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
        Skill telemetry will appear once the catalog loads.
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <BoltIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Skill Signals
          </p>
          <h2 className="text-base font-semibold text-slate-900">
            Where demand is heating up
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {data.map((skill) => {
          const isCore = selectedSkills.some(
            (item) => item.toLowerCase() === skill.name.toLowerCase()
          );

          return (
            <div
              key={skill.name}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {skill.name}
                  </p>
                  <p className="text-xs text-slate-500">{skill.category}</p>
                </div>
                <span className="ml-auto text-xs font-semibold text-emerald-600">
                  {skill.trend}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-white px-2 py-0.5 font-semibold text-slate-700">
                  Demand score {skill.demand}
                </span>
                {skill.useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-full border border-slate-200 px-2 py-0.5"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Keywords: {skill.keywords.join(", ")}
              </div>
              {isCore ? (
                <p className="mt-2 text-xs font-semibold text-brand-600">
                  ✓ Already highlighted in your resume
                </p>
              ) : (
                <p className="mt-2 text-xs text-amber-600">
                  Add a story that showcases this skill.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
