import React from "react";

export default function HomeHeader({ onAuth }) {
  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center text-lg font-semibold text-primary">
            CS
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Campus Setu
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="analytics" className="hover:text-primary transition-colors">
            Analytics
          </a>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={onAuth}
            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onAuth}
            className="px-5 py-2 rounded-full bg-primary text-white font-medium shadow-sm hover:shadow-md transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
