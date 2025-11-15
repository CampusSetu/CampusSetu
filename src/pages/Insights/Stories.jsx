import React, { useMemo, useState } from "react";
import { ChatBubbleBottomCenterTextIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useInsights } from "../../contexts/InsightsContext";

const difficultyColors = {
  Easy: "text-emerald-700 bg-emerald-50",
  Moderate: "text-amber-700 bg-amber-50",
  Hard: "text-rose-700 bg-rose-50",
};

export default function Stories() {
  const { experiences } = useInsights();
  const [companyFilter, setCompanyFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [viewTipsOnly, setViewTipsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const resetFilters = () => {
    setCompanyFilter("");
    setDifficultyFilter("");
    setTierFilter("");
    setViewTipsOnly(false);
    setSearchQuery("");
  };

  const companyOptions = useMemo(
    () => Array.from(new Set(experiences.map((story) => story.company))).sort(),
    [experiences]
  );
  const tierOptions = useMemo(
    () => Array.from(new Set(experiences.map((story) => story.tier).filter(Boolean))).sort(),
    [experiences]
  );

  const filteredStories = useMemo(() => {
    return experiences
      .filter((story) => (companyFilter ? story.company === companyFilter : true))
      .filter((story) => (difficultyFilter ? story.difficulty === difficultyFilter : true))
      .filter((story) => (tierFilter ? story.tier === tierFilter : true))
      .filter((story) => (viewTipsOnly ? Boolean(story.tips) : true))
      .filter((story) =>
        searchQuery.trim()
          ? `${story.company} ${story.role} ${story.summary}`
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())
          : true
      )
      .slice(0, 24);
  }, [experiences, companyFilter, difficultyFilter, tierFilter, viewTipsOnly, searchQuery]);

  const signalCounts = useMemo(() => {
    return filteredStories.reduce(
      (acc, story) => {
        const difficulty = story.difficulty || "Moderate";
        acc.difficulty[difficulty] = (acc.difficulty[difficulty] || 0) + 1;
        const tier = story.tier || "Campus";
        acc.tiers[tier] = (acc.tiers[tier] || 0) + 1;
        return acc;
      },
      { difficulty: {}, tiers: {} }
    );
  }, [filteredStories]);

  const storyStats = useMemo(() => {
    if (!filteredStories.length) {
      return {
        topCompany: "—",
        dominantDifficulty: "—",
        total: 0,
      };
    }

    const companyCounts = {};
    const difficultyCounts = {};
    filteredStories.forEach((story) => {
      if (story.company) {
        companyCounts[story.company] = (companyCounts[story.company] || 0) + 1;
      }
      if (story.difficulty) {
        difficultyCounts[story.difficulty] = (difficultyCounts[story.difficulty] || 0) + 1;
      }
    });

    const pickTop = (map) =>
      Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      topCompany: pickTop(companyCounts),
      dominantDifficulty: pickTop(difficultyCounts),
      total: filteredStories.length,
    };
  }, [filteredStories]);

  const difficultyDistribution = useMemo(() => {
    const total = Object.values(signalCounts.difficulty).reduce((sum, value) => sum + value, 0);
    return ["Easy", "Moderate", "Hard"].map((level) => {
      const count = signalCounts.difficulty[level] || 0;
      const percent = total ? Math.round((count / total) * 100) : 0;
      return { level, count, percent };
    });
  }, [signalCounts]);

  const tierBreakdown = useMemo(() => {
    return Object.entries(signalCounts.tiers)
      .map(([tier, count]) => ({ tier, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [signalCounts]);

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-white p-5 shadow-[0_12px_50px_rgba(15,23,42,0.06)] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-slate-900 text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)]">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-slate-400">Story filters</p>
              <h2 className="text-xl font-semibold text-slate-900">Replay verified interview journeys</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-[0_5px_14px_rgba(15,23,42,0.07)] transition hover:bg-white"
          >
            Reset
          </button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-3.5">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by company, role, or keyword"
                className="w-full rounded-full border border-slate-200/80 bg-white/90 px-14 py-3.5 text-sm font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <select
                value={companyFilter}
                onChange={(event) => setCompanyFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All companies</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All difficulty</option>
                {['Easy', 'Moderate', 'Hard'].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <select
                value={tierFilter}
                onChange={(event) => setTierFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All tiers</option>
                {tierOptions.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-[26px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-slate-400">Quick toggles</p>
            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_4px_10px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:shadow-[0_5px_14px_rgba(15,23,42,0.06)]">
              <span>Only show stories with tips</span>
              <input
                type="checkbox"
                checked={viewTipsOnly}
                onChange={(event) => setViewTipsOnly(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
            </label>
            <div className="mt-4 rounded-[18px] border border-slate-100 bg-white/90 px-4 py-3 text-xs text-slate-600">
              <p>Active filters instantly recalibrate the signal stack below.</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">{storyStats.total} stories live for this segment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Stories</p>
              <h3 className="text-2xl font-semibold text-slate-900">{storyStats.total} narratives</h3>
              <p className="text-sm text-slate-500">Most active: {storyStats.topCompany} • Feel: {storyStats.dominantDifficulty}</p>
            </div>
            <a
              href="#share"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Share yours
            </a>
          </header>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">{companyFilter || "All companies"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{difficultyFilter || "All difficulty"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{tierFilter || "All tiers"}</span>
            {viewTipsOnly ? (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Tips only</span>
            ) : null}
          </div>
          <div className="mt-6 max-h-[620px] space-y-4 overflow-y-auto pr-3">
            {filteredStories.map((story) => (
              <article key={story.id} className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{story.company}</p>
                    <p className="text-lg font-semibold text-slate-900">{story.role}</p>
                    <p className="text-xs text-slate-500">
                      Batch {story.batch || "—"} • {story.location || "Remote"}
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      difficultyColors[story.difficulty] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {story.difficulty || "Moderate"}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{story.summary}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Rounds</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-500">
                      {(story.roundHighlights?.slice(0, 3) || []).map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  {story.tips ? (
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Tips</p>
                      <p className="mt-2 text-xs text-slate-600">{story.tips}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
            {!filteredStories.length && (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center text-sm text-slate-500">
                No stories match these filters yet.
              </p>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 text-slate-900 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Signal board</p>
          <h3 className="mt-2 text-2xl font-semibold">Interview climate</h3>
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Difficulty mix</p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                {difficultyDistribution.map((item) => (
                  <div key={item.level}>
                    <div className="flex items-center justify-between text-slate-900">
                      <span>{item.level}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Top tiers</p>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                {tierBreakdown.length ? (
                  tierBreakdown.map((tier) => (
                    <div key={tier.tier} className="flex items-center justify-between">
                      <span>{tier.tier}</span>
                      <span>{tier.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No tier data yet.</p>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Why share?</p>
              <p className="mt-2 text-sm text-slate-600">
                Stories get anonymized and help juniors decode expectations before D-day. Every submission strengthens the campus knowledge base.
              </p>
              <button className="mt-4 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Submit a story
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
