import React from "react";

export default function FeatureSection({ featurePillars }) {
  return (
    <section id="features" className="w-full px-4 py-20 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Why teams choose CampusSetu
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Built to streamline every stage
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Automate follow-ups, keep stakeholders aligned, and surface insights without losing the human touch.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featurePillars.map((item) => (
            <div
              key={item.title}
              className="card-lifted bg-white/95 p-6 shadow-soft"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
