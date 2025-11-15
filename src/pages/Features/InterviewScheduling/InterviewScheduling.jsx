import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";

export default function InterviewScheduling() {
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
            Smart Interview Scheduling
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Coordinate assessment rounds with calendar integration, virtual interview links, and conflict-free scheduling.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Seamless Interview Coordination
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Multi-Round Scheduling
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Placement cells and recruiters can schedule aptitude tests, group discussions, technical interviews, and HR rounds with automated notifications.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Calendar Integration
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Sync with Google Calendar, iCal, and Outlook to prevent scheduling conflicts and ensure everyone stays on the same page.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Virtual Interviews
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Generate and share video call links, integrate with assessment platforms, and enable remote proctoring for online rounds.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Smart Reminders
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Automated email and SMS reminders ensure candidates and interviewers never miss scheduled sessions.
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Zero Conflicts
              </h3>
              <p className="text-sm text-slate-600">
                Intelligent scheduling prevents overlapping interviews and ensures optimal time slot allocation.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Time Savings
              </h3>
              <p className="text-sm text-slate-600">
                Reduce administrative overhead by automating coordination between students, recruiters, and placement cells.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Better Experience
              </h3>
              <p className="text-sm text-slate-600">
                Professional scheduling creates a positive impression and reduces stress for all stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Streamline your interview process
          </h2>
          <p className="mb-6 text-slate-600">
            Join CampusSetu to automate scheduling and focus on what matters most: performing your best.
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
