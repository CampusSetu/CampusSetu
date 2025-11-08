import React from "react";

export default function AnalyticsSection({ analyticsMetrics, snapshotTiles }) {
  return (
    <section id="analytics" className="w-full px-4 py-20 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Placement insights
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900">
            Monitor funnels, spot bottlenecks, and celebrate wins
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            Keep tabs on applications, interviews, and offers with dashboards that update instantly — ready to share with leadership and recruiter partners.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {analyticsMetrics.map((metric) => (
              <div
                key={metric.label}
                className="card-lifted bg-white/95 p-6 shadow-soft"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="mt-2 text-xs font-medium text-emerald-600">{metric.change} this season</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-soft">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Dashboard snapshot</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Placement overview</h3>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                Live
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {snapshotTiles.map((tile) => (
                <div
                  key={tile}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-5 transition duration-200 ease-out-expo hover:-translate-y-1 hover:border-brand-200/80"
                >
                  <p className="text-sm font-semibold text-slate-800">{tile}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Drill into performance with filters, segments, and exportable views.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
