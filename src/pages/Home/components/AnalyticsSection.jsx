import React from "react";

export default function AnalyticsSection({ analyticsMetrics, snapshotTiles }) {
  return (
    <section
      id="analytics"
      className="w-full px-6 md:px-10 lg:px-14 py-20 md:py-26 bg-white"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            Placement insights
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Monitor funnels, spot bottlenecks, and celebrate wins
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Keep tabs on applications, interviews, and offers with dashboards
            that update instantly — ready to share with leadership and recruiter
            partners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analyticsMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>
                <p className="text-3xl font-semibold text-slate-900">
                  {metric.value}
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  {metric.change} this season
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-indigo-200/10 blur-3xl" />
            <div className="relative rounded-3xl border border-white/70 bg-white/90 backdrop-blur p-10 shadow-xl space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Dashboard Snapshot
                </p>
                <div className="flex items-start justify-between mt-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Placement Overview
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Live
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                {snapshotTiles.map((tile) => (
                  <div
                    key={tile}
                    className="rounded-xl bg-slate-50 p-5 border border-slate-100 space-y-2"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      {tile}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Drill into performance with filters, segments, and
                      exportable views.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
