import React from "react";
import Button from "../../../components/Button";

export default function CalloutSection({ bullets, onPrimaryCTA }) {
  return (
    <section id="get-started" className="w-full px-4 pb-24 pt-6 lg:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-white shadow-elevated">
        <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:p-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-200/80">
              Ready to roll out
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Launch a premium placement experience for your campus
            </h2>
            <p className="text-base leading-relaxed text-slate-200/90 md:text-lg">
              We onboard your teams, migrate data, and share best practices so you can deliver a polished experience from the first drive.
            </p>
            <div className="space-y-3 text-sm text-slate-200/85">
              {bullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-200/60 bg-brand-500/10 text-[11px] font-semibold text-brand-100">
                    •
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/10 p-8 shadow-soft backdrop-blur">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300/80">
                Implementation timeline
              </p>
              <div className="space-y-3 text-sm text-slate-200/90">
                <p>
                  <span className="font-semibold text-white">Week 1:</span> Configure roles, import historical data, and schedule your first drive.
                </p>
                <p>
                  <span className="font-semibold text-white">Week 2:</span> Train stakeholders, enable analytics, and launch automated workflows.
                </p>
              </div>
            </div>
            <Button
              onClick={onPrimaryCTA}
              variant="secondary"
              className="border-white/40 bg-white text-slate-900 hover:bg-slate-100"
            >
              Book a walk-through
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
