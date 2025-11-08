import React from "react";

export default function HeroSection({ heroHighlights, onPrimaryCTA, user }) {
  const ctaLabel = user ? "Go to Dashboard" : "Join Campus Setu";

  return (
    <section
      id="about"
      className="w-full px-6 md:px-10 lg:px-14 py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
        <div className="space-y-6">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
            Campus hiring, orchestrated for every stakeholder
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight md:leading-[1.15]">
            Align campus hiring on a calm, connected workspace
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Campus Setu replaces scattered tools with one place to manage job
            discovery, approvals, and analytics — so teams can focus on
            conversations, not coordination.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 pt-2 md:pt-4">
            <button
              onClick={onPrimaryCTA}
              className="w-full sm:w-auto px-10 py-3 rounded-full bg-accent text-white font-semibold shadow-lg shadow-accent/20 hover:brightness-95 transition"
            >
              {ctaLabel}
            </button>
            <span className="text-sm text-slate-500">
              Quick onboarding • No credit card required
            </span>
          </div>
        </div>
        <div className="rounded-3xl border border-white/50 bg-white/80 backdrop-blur p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {heroHighlights.map((item) => (
              <div key={item.title} className="space-y-2">
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
