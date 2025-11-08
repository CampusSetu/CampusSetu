import React from "react";

export default function HomeFooter({ onAuth }) {
  return (
    <footer className="border-t border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-10 text-sm text-slate-600 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-500/30 text-base font-semibold text-brand-600">
                CS
              </div>
              <span className="text-lg font-semibold">CampusSetu</span>
            </div>
            <p className="leading-relaxed">
              CampusSetu is the unified platform connecting students,
              recruiters, and placement cells with guided workflows and live
              analytics.
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Based in Bengaluru, India
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Contact Placement Cell
            </h4>
            <div className="space-y-2">
              <p>
                Email:{" "}
                <a
                  className="text-brand-600 hover:text-brand-700"
                  href="mailto:placements@campussetu.in"
                >
                  placements@campussetu.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a className="text-brand-600 hover:text-brand-700" href="tel:+919876543210">
                  +91 98765 43210
                </a>
              </p>
              <a
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-transform duration-150 ease-out-expo hover:-translate-y-0.5 hover:text-brand-700"
                href="#contact"
              >
                Request a Callback
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Quick Links
            </h4>
            <nav className="grid gap-2 text-sm">
              <a className="transition-colors hover:text-brand-600" href="#about">
                About
              </a>
              <a className="transition-colors hover:text-brand-600" href="#features">
                Features
              </a>
              <a className="transition-colors hover:text-brand-600" href="#analytics">
                Analytics
              </a>
              <button
                onClick={onAuth}
                className="flex items-center gap-2 text-left text-brand-600 transition-colors hover:text-brand-700"
              >
                Sign In / Sign Up
              </button>
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
          <p>© 2025 CampusSetu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="transition-colors hover:text-brand-600">
              Privacy
            </a>
            <a href="#terms" className="transition-colors hover:text-brand-600">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
