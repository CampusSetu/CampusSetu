import React from "react";

export default function WorkflowSection({ workflowSteps }) {
  return (
    <section id="workflow" className="relative w-full overflow-hidden px-4 py-20 lg:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-100/55 via-brand-100/60 to-brand-200/55"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Built-for-campus flow
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            A guided journey from onboarding to outcomes
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Move from first recruiter outreach to reported offers with a playbook that keeps every stakeholder aligned.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <article
              key={step.title}
              className="card-lifted flex h-full flex-col justify-between bg-white/95 p-6"
            >
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                  {step.caption}
                </p>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.copy}</p>
              </div>
              <span className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-500/30 bg-brand-50/80 text-sm font-medium text-brand-600">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
