import React from "react";

export default function HomeFooter({ onAuth }) {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 py-16 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-10 text-sm text-slate-600">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-800">
              <div className="h-9 w-9 rounded-full border border-primary/40 flex items-center justify-center text-base font-semibold text-primary">
                CS
              </div>
              <span className="text-lg font-semibold">Campus Setu</span>
            </div>
            <p className="leading-relaxed">
              Campus Setu is the unified platform connecting students,
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
                  className="text-primary hover:underline"
                  href="mailto:placements@campussetu.in"
                >
                  placements@campussetu.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  className="text-primary hover:underline"
                  href="tel:+919876543210"
                >
                  +91 98765 43210
                </a>
              </p>
              <a
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
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
              <a className="hover:text-primary transition-colors" href="#about">
                About
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#features"
              >
                Features
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#analytics"
              >
                Analytics
              </a>
              <button
                onClick={onAuth}
                className="flex items-center gap-2 text-left text-primary hover:underline"
              >
                Sign In / Sign Up
              </button>
            </nav>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 Campus Setu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
