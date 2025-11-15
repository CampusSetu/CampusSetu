import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useUI();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(
    () => [
      { label: "Overview", href: "/#about", type: "anchor" },
      { label: "Features", href: "/#features", type: "anchor" },
      { label: "Workflow", href: "/#workflow", type: "anchor" },
      { label: "Personas", href: "/#personas", type: "anchor" },
      { label: "Analytics", href: "/analytics", type: "route" },
    ],
    []
  );

  const goToDashboard = () => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderLinks = (className = "") => (
    <ul className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6 ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          {link.type === "route" ? (
            <Link
              to={link.href}
              className="group relative inline-flex items-center text-sm font-medium text-slate-500 transition-colors duration-150 ease-out hover:text-slate-900"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-slate-900 transition-transform duration-150 ease-out group-hover:scale-x-100" />
            </Link>
          ) : (
            <a
              href={link.href}
              className="group relative inline-flex items-center text-sm font-medium text-slate-500 transition-colors duration-150 ease-out hover:text-slate-900"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-slate-900 transition-transform duration-150 ease-out group-hover:scale-x-100" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/55 backdrop-blur supports-[backdrop-filter]:bg-white/45">
      <div className="relative mx-auto max-w-6xl px-4 pb-2 pt-3 lg:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-2 h-[72px] rounded-full bg-gradient-to-r from-brand-500/12 via-white/0 to-brand-600/12 blur-2xl"
          aria-hidden
        />
        <nav className="relative flex h-16 items-center justify-between rounded-full border border-white/40 bg-gradient-to-r from-white/75 via-white/55 to-white/75 px-4 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.55)] ring-1 ring-white/50 backdrop-blur lg:h-[68px] lg:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-500/40 bg-white/90 text-sm font-semibold text-brand-600 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]">
            C
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-slate-900">CampusSetu</p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
            {renderLinks("justify-center")}
        </div>

          <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
                <div className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-3 py-1.5">
                  <span className="text-xs font-medium text-slate-500">{user.name}</span>
                  <span className="inline-flex rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={goToDashboard}
                  className="px-4 text-slate-600 hover:text-slate-900"
                >
                  My dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="border-white/60 bg-white/80 text-slate-600 hover:bg-white"
                >
                  Logout
                </Button>
            </>
          ) : (
            <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/analytics")}
                  className="px-4 text-slate-600 hover:text-slate-900"
                >
                  Live analytics
                </Button>
                <Button
                  onClick={openAuthModal}
                  className="from-brand-500 flex items-center gap-1 rounded-full bg-gradient-to-r to-brand-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-15px_rgba(59,130,246,0.9)] transition hover:shadow-[0_12px_36px_-14px_rgba(59,130,246,0.95)]"
                >
                  Get started
                </Button>
            </>
          )}
        </div>

        <button
          type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-600 transition duration-150 ease-out hover:bg-white/90 lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Bars3BottomRightIcon className="h-6 w-6" />
        </button>
      </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="absolute right-4 top-20 w-[85vw] max-w-sm rounded-2xl border border-white/40 bg-white/85 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.6)] ring-1 ring-white/50 backdrop-blur"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-slate-900">
                    CampusSetu
                  </p>
                  <p className="text-xs text-slate-400">Unified campus hiring workspace</p>
                </div>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-white/60 text-slate-500 transition duration-150 ease-out hover:bg-white/70"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              {renderLinks("border-t border-slate-100 pt-4")}
              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Button onClick={goToDashboard}>Open dashboard</Button>
                    <Button variant="secondary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={openAuthModal}>Create account</Button>
                    <Button variant="secondary" onClick={() => navigate("/analytics")}>
                      Explore analytics
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
