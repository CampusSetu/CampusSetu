import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import OAuthButtons from './OAuthButtons';
import PasswordInput from './PasswordInput';
import RoleSelect from './RoleSelect';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useUI();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signup' | 'signin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    role: 'student', // Default role
  });

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const redirectToWorkspace = (role) => {
    const destinations = {
      student: '/student/dashboard',
      recruiter: '/recruiter/dashboard',
      placement: '/placement/dashboard',
    };
    navigate(destinations[role] || '/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailRegex.test(form.email)) {
      return setError('Please enter a valid email address.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (mode === 'signup' && !form.name.trim()) {
      return setError('Please enter your full name.');
    }

    setLoading(true);
    try {
      let authenticatedUser;
      if (mode === 'signin') {
        const { user } = await login(form.email, form.password);
        authenticatedUser = user;
      } else {
        const { user } = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        authenticatedUser = user;
      }
      closeAuthModal();
      redirectToWorkspace(authenticatedUser?.role);
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const highlightItems = useMemo(
    () => [
      {
        title: 'Students',
        copy: 'Unified drive tracking and offer archives.',
      },
      {
        title: 'Recruiters',
        copy: 'Coordinate pipelines with campus teams in real time.',
      },
      {
        title: 'CGCs',
        copy: 'Guide approvals and publish reports effortlessly.',
      },
    ],
    []
  );

  if (!isAuthModalOpen) return null;

  const inputClass =
    'h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition duration-150 ease-out focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-3xl px-4 sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid min-h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2 lg:min-h-[540px]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-slate-100 p-9 text-slate-800 lg:flex">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                CampusSetu
              </div>
              <h2 className="text-2xl font-semibold leading-snug text-slate-900">
                Bridge every CGC stakeholder with a single sign-in.
              </h2>
              <p className="max-w-xs text-sm text-slate-600">
                One secure workspace connecting students, recruiters, and CGC leaders with guided workflows and transparent analytics.
              </p>
            </div>
            <div className="space-y-3">
              {highlightItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  C
                </span>
                Trusted by campuses orchestrating 200+ recruiter drives annually.
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[520px] flex-col bg-white p-8 sm:p-9 lg:min-h-[540px]">
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
              aria-label="Close"
            >
              <span className="text-sm font-semibold">×</span>
            </button>

            <div className="flex flex-1 flex-col gap-6">
              <div className="mx-auto inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 text-sm font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className={`px-6 py-2 rounded-full transition ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`px-6 py-2 rounded-full transition ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {mode === 'signup' ? 'Create your CampusSetu pass' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {mode === 'signup'
                    ? 'Build your workspace for students, recruiters, and CGC leadership.'
                    : 'Sign in to continue guiding drives, analytics, and stakeholder workflows.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4">
                <div className="space-y-4">
                  {mode === 'signup' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(event) => update('name', event.target.value)}
                        className={inputClass}
                      />

                      <div className="flex gap-3">
                        <select
                          value={form.countryCode}
                          onChange={(event) => update('countryCode', event.target.value)}
                          className="h-11 w-24 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 shadow-sm transition duration-150 ease-out focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                        >
                          <option>+91</option>
                          <option>+1</option>
                          <option>+44</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={form.phone}
                          onChange={(event) => update('phone', event.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <RoleSelect value={form.role} onChange={(val) => update('role', val)} />
                    </>
                  ) : (
                    <div
                      className="space-y-4 opacity-0 pointer-events-none select-none"
                      aria-hidden="true"
                    >
                      <div className="h-[52px] rounded-xl" />
                      <div className="h-[52px] rounded-xl" />
                      <div className="h-[128px] rounded-xl" />
                    </div>
                  )}
                </div>

                <input
                  type="email"
                  placeholder="Work email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  className={inputClass}
                />

                <PasswordInput
                  value={form.password}
                  onChange={(val) => update('password', val)}
                  placeholder={mode === 'signup' ? 'Create a password' : 'At least 6 characters'}
                />

                {error && (
                  <p className="text-center text-xs font-medium text-rose-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {loading ? 'Processing…' : mode === 'signup' ? 'Create account' : 'Sign in'}
                </button>
              </form>

              <div className="text-center text-sm text-slate-400">
                or {mode === 'signup' ? 'sign up' : 'sign in'} with
              </div>

              <OAuthButtons />

              <div className="text-center text-xs text-slate-400">
                By continuing, you agree to CampusSetu’s terms of service and privacy policy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

