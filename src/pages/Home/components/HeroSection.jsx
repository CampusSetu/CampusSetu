import React from "react";


export default function HeroSection({ heroHighlights, onPrimaryCTA, user }) {
  const ctaLabel = user ? "Go to Dashboard" : "Join Campus Setu";

  return (
    <section
      id="about"
      className="w-full flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-primary/15 via-accent/10 to-white"
    >
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center gap-6">
        <p className="text-primary font-semibold uppercase text-xs tracking-wide">
          The smarter way to connect students, recruiters, and colleges
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">
          Streamline every step of campus hiring in one collaborative workspace
        </h1>
        <p className="text-base text-slate-600">
          Campus Setu brings together job discovery, applications, approvals, and analytics—making placements easier, faster, and more transparent for everyone involved.
        </p>
        <button
          onClick={onPrimaryCTA}
          className="mt-4 px-8 py-3 rounded-full bg-accent text-white font-semibold shadow hover:brightness-95 transition"
        >
          {ctaLabel}
        </button>
      </div>
      <div className="w-full max-w-2xl flex flex-wrap justify-center gap-3 mt-12">
        {heroHighlights.map((item) => (
          <span
            key={item.title}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
          >
            {item.title}
          </span>
        ))}
      </div>
    </section>
  );
}
