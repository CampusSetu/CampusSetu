import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";

export default function CompanyInsights() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-sm text-slate-500 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Core Feature
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Company Insights & Ratings
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Access transparent compensation data, interview experiences, and company ratings from peers to make informed decisions.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Campus Placement Transparency
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Real Compensation Data
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                View actual CTC breakdowns, not just offer announcements. Understand base salary, variable pay, joining bonuses, and stock options reported by students from your campus.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Interview Experiences
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Read anonymized accounts of interview rounds, question patterns, difficulty levels, and hiring timelines from peers who went through the process.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Company Ratings
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Rate companies on process transparency, interview difficulty, offer negotiation, and work culture. Help future candidates make informed choices.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Acceptance Metrics
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                See acceptance rates, offer dropout ratios, and conversion statistics to gauge realistic expectations and competition levels.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Why This Matters
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Reduce Uncertainty
              </h3>
              <p className="text-sm text-slate-600">
                Make placement decisions with real data instead of rumors and incomplete information.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Better Preparation
              </h3>
              <p className="text-sm text-slate-600">
                Understand what to expect and prepare accordingly based on previous experiences.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Community Knowledge
              </h3>
              <p className="text-sm text-slate-600">
                Build institutional knowledge that helps future batches and improves campus reputation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Ready to explore company insights?
          </h2>
          <p className="mb-6 text-slate-600">
            Join CampusSetu to access transparent placement data and make informed career decisions.
          </p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-6 py-3 font-medium text-white shadow-sm transition hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
