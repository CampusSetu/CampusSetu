import React from "react";

export default function FeatureSection({ featurePillars }) {
  return (
    <section
      id="features"
      className="w-full px-6 md:px-10 lg:px-14 py-20 md:py-24 bg-gradient-to-b from-white via-primary/5 to-white"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            Why teams choose Campus Setu
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Built to streamline every stage
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Automate follow-ups, keep stakeholders aligned, and surface insights
            without losing the human touch.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featurePillars.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/85 backdrop-blur border border-white/60 p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
