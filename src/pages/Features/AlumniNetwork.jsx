import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function AlumniNetwork() {
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
            Alumni Network & Mentorship
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Connect with alumni for career guidance, job referrals, and industry insights through intelligent matching.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Bridge the Campus-Industry Gap
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Alumni Portal
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Alumni can post job openings, share industry insights, and give back to their alma mater by mentoring current students.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Smart Matching
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Get matched with alumni mentors based on your career interests, target companies, and professional goals for personalized guidance.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Job Referrals
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Access exclusive opportunities through alumni referrals at their organizations, significantly boosting your interview chances.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Career Pathways
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Learn from alumni career trajectories, understand different paths, and get advice on navigating your chosen field.
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
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Real-World Guidance
              </h3>
              <p className="text-sm text-slate-600">
                Get practical career advice from people who have walked the same path and understand your challenges.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Accelerated Growth
              </h3>
              <p className="text-sm text-slate-600">
                Skip years of trial and error by learning from alumni experiences and industry insights.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Powerful Network
              </h3>
              <p className="text-sm text-slate-600">
                Build lasting professional relationships that extend beyond campus and throughout your career.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Connect with your alumni network
          </h2>
          <p className="mb-6 text-slate-600">
            Join CampusSetu to find mentors, access opportunities, and accelerate your career journey.
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
