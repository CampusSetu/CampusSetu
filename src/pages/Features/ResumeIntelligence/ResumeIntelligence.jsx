import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";

const workflow = [
  {
    title: "Resume Lab",
    description:
      "Students craft, edit, and upload polished resumes with guided sections, skill tagging, and PDF sync.",
    action: "Open Resume Lab",
    href: "/student/resume-lab",
  },
  {
    title: "Compatibility scoring",
    description:
      "The system compares every resume against live job postings and returns ATS-style scores with missing keywords.",
    action: "See compatibility",
    href: "/student/resume-lab",
  },
  {
    title: "Resume Hub",
    description:
      "Recruiters browse an enriched repository, filter by skills, and download the latest PDF in one click.",
    action: "Visit Resume Hub",
    href: "/recruiter/resume-hub",
  },
];

const spotlights = [
  {
    title: "For students: Resume Lab",
    bullets: [
      "Smart builder with drag-free sections for experience, projects, and education",
      "File uploader that mirrors your PDF to the placement cloud",
      "Skill Signals panel highlighting in-demand keywords to add",
      "Compatibility dashboard that recommends the next best improvement",
    ],
  },
  {
    title: "For recruiters: Resume Hub",
    bullets: [
      "Searchable repository across departments, filters by skills and projects",
      "Auto-generated stats: resumes synced, trending skills, project counts",
      "One-tap resume preview with secure, expiring links",
      "Skill demand radar to brief hiring panels on keyword trends",
    ],
  },
];

const benefitCards = [
  {
    title: "Higher match rates",
    body: "Tailor keywords for each posting and pass ATS filters before humans review.",
    accent: "bg-purple-50 text-purple-600",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    title: "Actionable feedback",
    body: "Compatibility reports list missing keywords, summary gaps, and project prompts—no guesswork.",
    accent: "bg-cyan-50 text-cyan-600",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "Recruiter-ready",
    body: "Placement cells share curated decks with verified PDFs and skill stats to accelerate shortlists.",
    accent: "bg-amber-50 text-amber-600",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
];

export default function ResumeIntelligence() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-slate-500 transition-colors hover:text-primary"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="mb-12 rounded-3xl border border-white/80 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/50 p-10 shadow-[0_40px_80px_-60px_rgba(15,23,42,0.9)]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Core feature
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Resume Intelligence
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              The Resume Lab (students) and Resume Hub (recruiters) stay
              perfectly in sync—auto-building, scoring, and sharing resumes so
              shortlists move faster.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { label: "Resumes synced", value: "24 active" },
              { label: "Avg compatibility", value: "82%" },
              { label: "Skills tracked", value: "120+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <section className="mb-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                How it works
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                A shared workflow across students and recruiters
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {workflow.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
                <Link
                  to={step.href}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-600"
                >
                  {step.action} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Spotlights */}
        <section className="mb-16 grid gap-8 md:grid-cols-2">
          {spotlights.map((spotlight) => (
            <div
              key={spotlight.title}
              className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-slate-900">
                {spotlight.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {spotlight.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-left">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Why campuses adopt Resume Intelligence
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefitCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${card.accent}`}
                >
                  {card.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">
            Launch Resume Intelligence on your campus
          </h2>
          <p className="mb-6 text-slate-600">
            Give students tangible guidance and give recruiters a verified
            pipeline in one connected workspace.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/student/resume-lab"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              Explore Resume Lab
            </Link>
            <Link
              to="/recruiter/resume-hub"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
            >
              Preview Resume Hub
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
