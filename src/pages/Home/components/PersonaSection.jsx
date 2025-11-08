import React from "react";

export default function PersonaSection({ personaSections }) {
  return (
    <section id="personas" className="w-full px-4 py-20 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Tailored for every journey
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900">
            Dedicated spaces for each stakeholder
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            Give students, recruiters, and CGCs focused tools that simplify collaboration and highlight outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {personaSections.map((persona) => (
            <article
              key={persona.id}
              className="card-lifted bg-white/95 p-8 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{persona.subtitle || "Workspace"}</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{persona.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{persona.tagline}</p>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
                {persona.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-brand-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
