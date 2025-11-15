import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";

export default function ResumeIntelligence() {
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
            Resume Intelligence
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Build optimized resumes, analyze compatibility scores for job postings, and receive targeted improvement suggestions.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Data-Driven Resume Optimization
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Resume Builder
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Create professional resumes with guided templates. Fill in education, projects, skills, and experiences with formatting handled automatically.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                ATS Compatibility Score
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Click on any job posting to instantly see how well your resume matches. Get a detailed ATS score and keyword analysis.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Smart Insights
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Receive specific recommendations on missing keywords, skill gaps, and experience improvements for target companies.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Resume Repository
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Placement cells can access a centralized repository of student resumes, making it easy to share profiles with recruiters.
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Higher Match Rates
              </h3>
              <p className="text-sm text-slate-600">
                Optimize your resume for each application to pass ATS filters and reach human recruiters.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50">
                <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Actionable Feedback
              </h3>
              <p className="text-sm text-slate-600">
                Know exactly what to improve instead of guessing why applications get rejected.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Competitive Edge
              </h3>
              <p className="text-sm text-slate-600">
                Stand out from other candidates by tailoring your resume to specific job requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Optimize your resume today
          </h2>
          <p className="mb-6 text-slate-600">
            Join CampusSetu to build better resumes and maximize your chances with every application.
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
