import React from "react";

export default function TestimonialSection({ testimonial }) {
  if (!testimonial) {
    return null;
  }

  return (
    <section id="stories" className="w-full px-4 py-20 lg:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/85 p-10 shadow-soft backdrop-blur md:p-14">
        <div className="absolute -left-16 -top-10 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          Customer perspective
        </p>
        <blockquote className="mt-6 space-y-6 text-slate-900">
          <p className="text-2xl font-semibold leading-snug md:text-[28px]">
            “{testimonial.quote}”
          </p>
          <footer className="space-y-1 text-sm text-slate-500">
            <p className="font-medium text-slate-900">{testimonial.name}</p>
            <p>{testimonial.role}</p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
