import React, { useEffect, useState } from "react";
import TagInput from "../TagInput";

const emptyExperience = {
  role: "",
  company: "",
  duration: "",
  impact: [],
};

const emptyEducation = {
  institution: "",
  degree: "",
  year: "",
  gpa: "",
};

const emptyProject = {
  name: "",
  description: "",
  skills: [],
};

export default function ResumeBuilder({ profile, onSave, saving }) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateCollection = (collection, index, key, value) => {
    setDraft((prev) => {
      const nextItems = [...(prev[collection] || [])];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...prev, [collection]: nextItems };
    });
  };

  const addCollectionItem = (collection, template) => {
    setDraft((prev) => ({
      ...prev,
      [collection]: [...(prev[collection] || []), template],
    }));
  };

  const removeCollectionItem = (collection, index) => {
    setDraft((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = () => {
    onSave?.(draft);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Resume Builder
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Craft your narrative
          </h2>
          <p className="text-sm text-slate-500">
            Update sections and keep everything recruiter-ready with one save.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-200"
        >
          {saving ? "Saving..." : "Save resume"}
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800">
            Headline
          </label>
          <input
            type="text"
            value={draft?.headline || ""}
            onChange={(event) => updateField("headline", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
            placeholder="e.g. Frontend Engineer · React + Product UX"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800">
            Summary
          </label>
          <textarea
            value={draft?.summary || ""}
            onChange={(event) => updateField("summary", event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
            placeholder="Tell your story with metrics, impact, and your product edge."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800">
            Core Skills
          </label>
          <TagInput
            tags={draft?.skills || []}
            setTags={(skills) => updateField("skills", skills)}
            placeholder="Add a skill and press enter"
          />
        </div>

        <CollectionSection
          title="Experience"
          description="List internships, freelance work, or campus roles"
          items={draft?.experience || []}
          onAdd={() => addCollectionItem("experience", emptyExperience)}
          onRemove={(index) => removeCollectionItem("experience", index)}
          renderItem={(item, index) => (
            <div className="space-y-3" key={`experience-${index}`}>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.role || ""}
                  onChange={(event) =>
                    updateCollection(
                      "experience",
                      index,
                      "role",
                      event.target.value
                    )
                  }
                  placeholder="Role"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <input
                  value={item.company || ""}
                  onChange={(event) =>
                    updateCollection(
                      "experience",
                      index,
                      "company",
                      event.target.value
                    )
                  }
                  placeholder="Company"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
              </div>
              <input
                value={item.duration || ""}
                onChange={(event) =>
                  updateCollection(
                    "experience",
                    index,
                    "duration",
                    event.target.value
                  )
                }
                placeholder="Duration (e.g. May 2025 - Aug 2025)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              <textarea
                value={(item.impact || []).join("\n")}
                onChange={(event) =>
                  updateCollection(
                    "experience",
                    index,
                    "impact",
                    event.target.value.split("\n").filter(Boolean)
                  )
                }
                rows={3}
                placeholder="Impact bullet points (one per line)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          )}
        />

        <CollectionSection
          title="Education"
          description="Add degrees or certifications with graduation year"
          items={draft?.education || []}
          onAdd={() => addCollectionItem("education", emptyEducation)}
          onRemove={(index) => removeCollectionItem("education", index)}
          renderItem={(item, index) => (
            <div className="space-y-3" key={`education-${index}`}>
              <input
                value={item.institution || ""}
                onChange={(event) =>
                  updateCollection(
                    "education",
                    index,
                    "institution",
                    event.target.value
                  )
                }
                placeholder="Institution"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={item.degree || ""}
                  onChange={(event) =>
                    updateCollection(
                      "education",
                      index,
                      "degree",
                      event.target.value
                    )
                  }
                  placeholder="Degree"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <input
                  value={item.year || ""}
                  onChange={(event) =>
                    updateCollection(
                      "education",
                      index,
                      "year",
                      event.target.value
                    )
                  }
                  placeholder="Year"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <input
                  value={item.gpa || ""}
                  onChange={(event) =>
                    updateCollection(
                      "education",
                      index,
                      "gpa",
                      event.target.value
                    )
                  }
                  placeholder="GPA"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
              </div>
            </div>
          )}
        />

        <CollectionSection
          title="Projects"
          description="Highlight builders' energy with action-driven blurbs"
          items={draft?.projects || []}
          onAdd={() => addCollectionItem("projects", emptyProject)}
          onRemove={(index) => removeCollectionItem("projects", index)}
          renderItem={(item, index) => (
            <div className="space-y-3" key={`projects-${index}`}>
              <input
                value={item.name || ""}
                onChange={(event) =>
                  updateCollection(
                    "projects",
                    index,
                    "name",
                    event.target.value
                  )
                }
                placeholder="Project name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              <textarea
                value={item.description || ""}
                onChange={(event) =>
                  updateCollection(
                    "projects",
                    index,
                    "description",
                    event.target.value
                  )
                }
                rows={2}
                placeholder="What problem did you solve and how?"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <TagInput
                tags={item.skills || []}
                setTags={(skills) =>
                  updateCollection("projects", index, "skills", skills)
                }
                placeholder="Add relevant tech or tools"
              />
            </div>
          )}
        />
      </div>
    </section>
  );
}

function CollectionSection({
  title,
  description,
  items,
  renderItem,
  onAdd,
  onRemove,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="ml-auto inline-flex items-center rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          + Add
        </button>
      </div>
      {items && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4"
            >
              {renderItem(item, index)}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-xs font-semibold text-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
          Nothing logged yet—add your first entry.
        </div>
      )}
    </div>
  );
}
