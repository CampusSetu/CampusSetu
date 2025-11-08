import React from "react";

export default function TrustedStrip({ trustedBadges }) {
  return (
    <section className="w-full border-y border-slate-200/60 bg-slate-50/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          Trusted by forward-thinking campuses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium uppercase tracking-[0.24em] text-slate-500/80">
          {trustedBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[11px] text-slate-600 shadow-soft"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
