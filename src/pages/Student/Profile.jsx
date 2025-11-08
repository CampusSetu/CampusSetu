import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser } from "../../api/mockAuth";
import {
  EnvelopeIcon,
  LinkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Field = ({ label, description, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </label>
    {description && <p className="text-xs text-slate-400">{description}</p>}
    {children}
  </div>
);

export function StudentProfile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    cgpa: "",
    skills: [],
    resumeUrl: "",
  });
  const [status, setStatus] = useState({ saving: false, saved: false, error: null });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      cgpa: user.profile?.cgpa?.toString() || "",
      skills: user.profile?.skills || [],
      resumeUrl: user.profile?.resumeUrl || "",
    });
  }, [user]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus((prev) => ({ ...prev, saved: false, error: null }));
  };

  const summaryChips = useMemo(
    () => [
      { label: "Skills", value: form.skills.length },
      { label: "CGPA", value: form.cgpa || "—" },
      { label: "Resume", value: form.resumeUrl ? "Linked" : "Missing" },
    ],
    [form.skills.length, form.cgpa, form.resumeUrl]
  );

  const handleSave = async () => {
    if (!user) return;
    setStatus({ saving: true, saved: false, error: null });
    try {
      await updateUser(user.id, {
        name: form.name,
        profile: {
          cgpa: form.cgpa ? Number(form.cgpa) : undefined,
          skills: form.skills,
          resumeUrl: form.resumeUrl,
        },
      });

      if (user.password) {
        await login(user.email, user.password);
      }

      setStatus({ saving: false, saved: true, error: null });
    } catch (error) {
      setStatus({ saving: false, saved: false, error: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Keep your profile recruitment ready</h1>
            <p className="mt-3 text-sm text-slate-500">
              Align your academic story with skills recruiters track. Update your resume link and highlight relevant strengths.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {summaryChips.map((chip) => (
              <div key={chip.label} className="rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase text-brand-500">{chip.label}</p>
                <p className="mt-1 text-lg font-semibold text-brand-700">{chip.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card-elevated max-w-3xl">
        <form className="space-y-6 p-6" onSubmit={(event) => event.preventDefault()}>
          <Field label="Full name" description="Use the format shared with recruiters and placement cell.">
            <input
              type="text"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-600 shadow-soft focus:border-brand-200"
            />
          </Field>

          <Field label="Email address" description="Primary contact for recruiter communication.">
            <div className="relative">
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full rounded-2xl border border-white/70 bg-slate-100/80 px-4 py-3 pl-11 text-sm text-slate-500 shadow-soft"
              />
            </div>
          </Field>

          <Field label="Overall CGPA" description="Reflect your latest transcript value.">
            <input
              type="number"
              step="0.1"
              value={form.cgpa}
              onChange={(event) => update("cgpa", event.target.value)}
              placeholder="e.g., 8.5"
              className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-600 shadow-soft focus:border-brand-200"
            />
          </Field>

          <Field label="Skills" description="Comma separated list. We highlight top 6 skills on your profile.">
            <input
              type="text"
              value={form.skills.join(", ")}
              onChange={(event) =>
                update(
                  "skills",
                  event.target.value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                )
              }
              placeholder="React, Node.js, Data Analysis"
              className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-600 shadow-soft focus:border-brand-200"
            />
          </Field>

          <Field label="Resume URL" description="Share a public link to Google Drive, Notion, or portfolio site.">
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={form.resumeUrl}
                onChange={(event) => update("resumeUrl", event.target.value)}
                placeholder="https://example.com/my-resume.pdf"
                className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 pl-11 text-sm text-slate-600 shadow-soft focus:border-brand-200"
              />
            </div>
          </Field>

          <div className="rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-xs text-brand-600">
            <div className="flex items-center gap-2 font-semibold">
              <SparklesIcon className="h-4 w-4" />
              Tip: Certifications
            </div>
            <p className="mt-2">
              Mention certifications or hackathon wins alongside the relevant skill to improve recruiter search relevance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={status.saving}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.saving ? "Saving..." : "Save changes"}
            </button>
            {status.saved && (
              <span className="text-sm font-medium text-success">Profile saved successfully.</span>
            )}
            {status.error && (
              <span className="text-sm font-medium text-danger">{status.error}</span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
