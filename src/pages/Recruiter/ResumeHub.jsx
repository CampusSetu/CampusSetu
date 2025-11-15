import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { getResumeRepository, getSkillSignals } from "../../api/mockResume";
import { useAuth } from "../../contexts/AuthContext";

export function RecruiterResumeHub() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [skillSignals, setSkillSignals] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [repo, signals] = await Promise.all([
          getResumeRepository(),
          getSkillSignals(),
        ]);
        if (active) {
          setResumes(repo);
          setSkillSignals(signals);
        }
      } catch (error) {
        console.error("Failed to load resume repository", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return resumes;
    return resumes.filter((profile) => {
      const haystack = [
        profile.headline,
        profile.summary,
        ...(profile.skills || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query, resumes]);

  const topSkill = useMemo(() => {
    const counts = {};
    resumes.forEach((profile) => {
      (profile.skills || []).forEach((skill) => {
        const key = skill.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const [winner] = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return winner ? winner[0] : "React";
  }, [resumes]);

  return (
    <DashboardLayout
      title="Resume Hub"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-emerald-50/80 to-blue-50/40 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.95)]">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Resume intelligence
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {user?.name
                  ? `${user.name.split(" ")[0]}, your talent radar`
                  : "Your talent radar"}
              </h1>
              <p className="text-sm text-slate-600">
                Filter AI-enhanced resumes, surface missing keywords, and share
                curated decks with hiring panels.
              </p>
            </div>
            <div className="ml-auto grid gap-4 sm:grid-cols-2">
              <Stat label="Resumes synced" value={resumes.length} />
              <Stat label="Trending skill" value={topSkill} />
            </div>
          </div>
        </section>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by skill, project, or headline"
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 animate-pulse rounded-3xl bg-slate-200/70"
              />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="space-y-4">
            {filtered.map((profile) => (
              <article
                key={profile.userId}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {profile.headline || "Candidate"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Updated{" "}
                      {new Date(profile.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto flex flex-wrap gap-2 text-xs text-slate-500">
                    {(profile.skills || []).slice(0, 5).map((skill) => (
                      <span
                        key={`${profile.userId}-${skill}`}
                        className="rounded-full border border-slate-200 px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills && profile.skills.length > 5 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5">
                        +{profile.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{profile.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    Projects: {profile.totalProjects}
                  </span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    Skills: {profile.totalSkills}
                  </span>
                  <button
                    type="button"
                    className="ml-auto rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
                    disabled={!profile.resumeFile}
                    onClick={() =>
                      profile.resumeFile &&
                      window.open(profile.resumeFile, "_blank")
                    }
                  >
                    {profile.resumeFile ? "Open resume" : "Awaiting upload"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No resumes match your filters yet.
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Skill demand radar
          </p>
          <p className="text-xs text-slate-500">
            Share trends with hiring panels.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {skillSignals.slice(0, 6).map((skill) => (
              <div
                key={`signal-${skill.name}`}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {skill.name}
                </p>
                <p className="text-xs text-slate-500">{skill.category}</p>
                <p className="mt-2 text-xs text-emerald-600">{skill.trend}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Keywords: {skill.keywords.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
