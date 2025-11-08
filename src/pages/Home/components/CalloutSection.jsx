import React from "react";
import Button from "../../../components/Button";

export default function CalloutSection({ bullets, onPrimaryCTA }) {
  return (
    <section id="get-started" className="w-full px-4 pb-24 pt-6 lg:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-brand-50/60 to-slate-100 text-slate-900 shadow-soft">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-45 mix-blend-multiply" aria-hidden />
        <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:p-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-500/80">
              Ready to roll out
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Launch a premium placement experience for your campus
            </h2>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              We onboard your teams, migrate data, and share best practices so you can deliver a polished experience from the first drive.
            </p>
            <div className="space-y-3 text-sm text-slate-600">
              {bullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-200/70 bg-brand-50/80 text-[11px] font-semibold text-brand-500">
                    •
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200/80 bg-white/85 p-8 shadow-card backdrop-blur">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600/80">
                Implementation timeline
              </p>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Week 1:</span> Configure roles, import historical data, and schedule your first drive.
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Week 2:</span> Train stakeholders, enable analytics, and launch automated workflows.
                </p>
              </div>
            </div>
            <Button
              onClick={onPrimaryCTA}
              variant="primary"
              className="shadow-card hover:shadow-elevated"
            >
              Book a walk-through
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
