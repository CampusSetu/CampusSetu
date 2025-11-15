import React from "react";
import Button from "../../../components/Button";

export default function HeroSection({ heroHighlights, heroMetrics, onPrimaryCTA, user }) {
  const ctaLabel = user ? "Go to dashboard" : "Launch your workspace";

  return (
    <section id="about" className="w-full px-4 py-24 lg:px-6">
      <div className="relative mx-auto max-w-6xl">
        <div
          className="pointer-events-none absolute inset-x-6 -top-10 bottom-10 rounded-[40px] bg-gradient-glow opacity-70 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-12 rounded-[32px] border border-slate-200/70 bg-white/85 p-10 shadow-soft backdrop-blur lg:grid-cols-[1.08fr_0.92fr] lg:p-16">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              The campus hiring bridge
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                Coordinate student placements with one calm, modern workspace
              </h1>
              <p className="max-w-xl text-base text-slate-600 md:text-lg">
                Manage recruiter pipelines, student journeys, approvals, and analytics with intuitive workflows designed for high-performing campus teams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={onPrimaryCTA}>{ctaLabel}</Button>
              <Button
                variant="secondary"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                }
              >
                Explore platform
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {heroHighlights.map((item) => (
                <span
                  key={item.title}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {item.title}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroHighlights.slice(0, 4).map((item) => (
              <div
                key={item.title}
                className="card-lifted bg-slate-50/70 p-6 shadow-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {item.category || "Core Feature"}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {item.copy ||
                    "Structured workflows and analytics ready to share with stakeholders."}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 grid gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur sm:grid-cols-3">
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/40" aria-hidden />
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {metric.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
              {metric.note && (
                <p className="text-xs text-slate-500">{metric.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
