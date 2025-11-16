import React from "react";

export default function HomeFooter({ onAuth }) {
  const linkGroups = [
    {
      title: "Platform",
      links: [
        { label: "Interview Hub", href: "#interview-hub" },
        { label: "Resume Lab", href: "#resume-intelligence" },
        { label: "Analytics", href: "#analytics" },
        { label: "Placement Ops", href: "#placement" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Success Stories", href: "#stories" },
        { label: "Playbooks", href: "#playbooks" },
        { label: "Help Center", href: "#support" },
        { label: "Campus Community", href: "#community" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 text-sm text-slate-600 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-5 text-center md:text-left">
            <div className="flex flex-col items-center gap-3 text-slate-800 md:flex-row md:items-center md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-500/30 text-base font-semibold text-brand-600">
                CS
              </div>
              <div>
                <p className="text-lg font-semibold">CampusSetu</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Placement OS for CGCs
                </p>
              </div>
            </div>
            <p className="leading-relaxed">
              The operating system for modern campus careers teams—bringing
              together interview orchestration, resume intelligence, offer
              analytics, and recruiter collaboration in one guided workspace.
            </p>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <button
                type="button"
                onClick={onAuth}
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:text-brand-800"
              >
                Launch Dashboard
                <span aria-hidden>↗</span>
              </button>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Operating from Bengaluru · Serving 60+ campuses
              </p>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div
              key={group.title}
              className="space-y-4 text-center md:text-left"
            >
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.title}
              </h4>
              <nav className="flex flex-col items-center gap-2 text-sm text-slate-600 md:items-start">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    className="transition-colors hover:text-brand-600"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}

          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Connect
            </h4>
            <div className="space-y-3">
              <p>
                Email:{" "}
                <a
                  className="text-brand-600 hover:text-brand-700"
                  href="mailto:hello@campussetu.in"
                >
                  hello@campussetu.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  className="text-brand-600 hover:text-brand-700"
                  href="tel:+919876543210"
                >
                  +91 98765 43210
                </a>
              </p>
              <p>Address: 52/1 Residency Road, Bengaluru 560025</p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
                <a
                  href="https://www.linkedin.com/company/campussetu"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-700 transition-colors hover:text-brand-600"
                >
                  LinkedIn
                </a>
                <a
                  href="https://x.com/campussetu"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-700 transition-colors hover:text-brand-600"
                >
                  X / Twitter
                </a>
                <a
                  href="#newsletter"
                  className="font-semibold text-slate-700 transition-colors hover:text-brand-600"
                >
                  Newsletter
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-xs text-slate-500 md:flex-row md:justify-between">
          <p className="text-center">© 2025 CampusSetu. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="#privacy"
              className="transition-colors hover:text-brand-600"
            >
              Privacy
            </a>
            <a href="#terms" className="transition-colors hover:text-brand-600">
              Terms
            </a>
            <a
              href="#security"
              className="transition-colors hover:text-brand-600"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
