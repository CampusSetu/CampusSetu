import React, { useMemo, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useInsights } from "../../contexts/InsightsContext";

const initialForm = {
  company: "",
  role: "",
  location: "Remote",
  tier: "Campus",
  batch: "2025",
  difficulty: "Moderate",
  summary: "",
  tips: "",
  roundHighlights: [""],
};

const difficulties = ["Easy", "Moderate", "Hard"];

export default function Share() {
  const { submitExperience, roles } = useInsights();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const companySuggestions = useMemo(
    () => Array.from(new Set(roles.map((row) => row.company))).sort(),
    [roles]
  );
  const roleSuggestions = useMemo(
    () => Array.from(new Set(roles.map((row) => row.title))).sort(),
    [roles]
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHighlight = (index, value) => {
    setForm((prev) => {
      const next = [...prev.roundHighlights];
      next[index] = value;
      return { ...prev, roundHighlights: next };
    });
  };

  const addHighlight = () => {
    setForm((prev) => ({ ...prev, roundHighlights: [...prev.roundHighlights, ""] }));
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      roundHighlights: prev.roundHighlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.company || !form.role || !form.summary) {
      setToast({ type: "error", message: "Fill required fields to share." });
      return;
    }
    setSubmitting(true);
    submitExperience({
      ...form,
      roundHighlights: form.roundHighlights.filter((entry) => entry.trim().length > 0),
    });
    setTimeout(() => {
      setSubmitting(false);
      setToast({ type: "success", message: "Story added to the feed." });
      setForm(initialForm);
    }, 400);
  };

  return (
    <div id="share" className="space-y-6">
      <header className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Contribute</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Anonymously document your placement journey</h2>
        <p className="mt-3 text-sm text-slate-600">
          No email required. We simply capture structured signals that guide your juniors—compensation insights stay private to campus.
        </p>
      </header>

      {toast && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-card"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Company</label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              list="company-suggestions"
              placeholder="E.g., Amazon India"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              required
            />
            <datalist id="company-suggestions">
              {companySuggestions.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Role</label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              list="role-suggestions"
              placeholder="SDE, Product analyst..."
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              required
            />
            <datalist id="role-suggestions">
              {roleSuggestions.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Location</label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tier</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              value={form.tier}
              onChange={(event) => updateField("tier", event.target.value)}
            >
              <option value="Campus">Campus</option>
              <option value="HQ">HQ</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Batch</label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              value={form.batch}
              onChange={(event) => updateField("batch", event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Difficulty</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              value={form.difficulty}
              onChange={(event) => updateField("difficulty", event.target.value)}
            >
              {difficulties.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Summary</label>
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
            rows={4}
            placeholder="Walk us through the hiring loop, surprises, negotiation, etc."
            value={form.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Round highlights</label>
          <div className="space-y-3">
            {form.roundHighlights.map((value, index) => (
              <div key={`round-${index}`} className="flex gap-3">
                <input
                  className="mt-2 w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
                  placeholder="Eg. Technical round focused on system design"
                  value={value}
                  onChange={(event) => updateHighlight(index, event.target.value)}
                />
                {form.roundHighlights.length > 1 && (
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-200 px-3 text-xs font-semibold text-slate-500"
                    onClick={() => removeHighlight(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="text-sm font-semibold text-slate-700"
            >
              + Add another round
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Final tips</label>
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
            rows={3}
            placeholder="Negotiation hacks, recruiter expectations, on-site surprises..."
            value={form.tips}
            onChange={(event) => updateField("tips", event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
          {submitting ? "Publishing" : "Publish anonymously"}
        </button>
      </form>
    </div>
  );
}
