import React from "react";

export default function PersonaSection({ personaSections }) {
  return (
  <section className="w-full px-6 md:px-10 lg:px-14 py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            Tailored for every journey
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Dedicated spaces for each stakeholder
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Give students, recruiters, and placement cells focused tools that
            simplify collaboration and highlight outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {personaSections.map((persona) => (
            <article
              key={persona.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className={`absolute inset-x-0 -top-24 h-48 bg-gradient-to-b ${persona.accent}`}
              />
              <div className="relative space-y-5">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {persona.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {persona.tagline}
                </p>
                <ul className="space-y-3 text-sm md:text-base text-slate-600 leading-relaxed">
                  {persona.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
