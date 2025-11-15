import React, { useMemo, useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useInsights } from "../../contexts/InsightsContext";

const formatLpa = (value) => `${Number(value).toFixed(1)} LPA`;

export default function Explorer() {
  const { roles, experiences, filters } = useInsights();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [minCtc, setMinCtc] = useState(0);

  const resetFilters = () => {
    setQuery("");
    setRoleFilter("");
    setLocationFilter("");
    setTierFilter("");
    setDomainFilter("");
    setMinCtc(0);
  };

  const filteredRoles = useMemo(() => {
    return roles
      .filter((row) => (roleFilter ? row.title === roleFilter : true))
      .filter((row) => (locationFilter ? row.location === locationFilter : true))
      .filter((row) => (tierFilter ? row.tier === tierFilter : true))
      .filter((row) => (domainFilter ? row.domain === domainFilter : true))
      .filter((row) => (minCtc ? row.medianCtc >= minCtc : true))
      .filter((row) => {
        if (!query.trim()) return true;
        const haystack = `${row.company} ${row.title} ${row.location}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      })
      .slice(0, 50);
  }, [roles, roleFilter, locationFilter, tierFilter, domainFilter, minCtc, query]);

  const roleStats = useMemo(() => {
    if (!filteredRoles.length) {
      return { avgMedian: 0, topDomain: "—", topTier: "—" };
    }

    const totals = filteredRoles.reduce(
      (acc, row) => {
        acc.median += row.medianCtc;
        if (row.domain) acc.domains[row.domain] = (acc.domains[row.domain] || 0) + 1;
        if (row.tier) acc.tiers[row.tier] = (acc.tiers[row.tier] || 0) + 1;
        return acc;
      },
      { median: 0, domains: {}, tiers: {} }
    );

    const pickTop = (map) =>
      Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      avgMedian: totals.median / filteredRoles.length,
      topDomain: pickTop(totals.domains),
      topTier: pickTop(totals.tiers),
    };
  }, [filteredRoles]);

  const chartData = filteredRoles.slice(0, 10).map((row) => ({
    name: `${row.company.split(" ")[0]} • ${row.title}`,
    ctc: row.medianCtc,
    base: row.base,
  }));

  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((story) => (roleFilter ? story.role === roleFilter : true))
      .filter((story) => (locationFilter ? story.location === locationFilter : true))
      .filter((story) => (tierFilter ? story.tier === tierFilter : true))
      .filter((story) =>
        query.trim()
          ? `${story.company} ${story.role} ${story.summary}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          : true
      )
      .slice(0, 12);
  }, [experiences, roleFilter, locationFilter, tierFilter, query]);

  const experienceSignals = useMemo(() => {
    if (!filteredExperiences.length) {
      return {
        avgScore: null,
        commonDifficulty: "—",
        commonLocation: "—",
        recentHighlights: [],
      };
    }

    const difficultyCounts = {};
    const locationCounts = {};
    let totalScore = 0;

    filteredExperiences.forEach((story) => {
      if (story.difficulty) {
        difficultyCounts[story.difficulty] = (difficultyCounts[story.difficulty] || 0) + 1;
      }
      if (story.location) {
        locationCounts[story.location] = (locationCounts[story.location] || 0) + 1;
      }
      totalScore += story.overallScore || 0;
    });

    const pickTop = (map) =>
      Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      avgScore: totalScore ? (totalScore / filteredExperiences.length).toFixed(1) : null,
      commonDifficulty: pickTop(difficultyCounts),
      commonLocation: pickTop(locationCounts),
      recentHighlights: filteredExperiences.slice(0, 3).map((story) => ({
        id: story.id,
        company: story.company,
        role: story.role,
        summary: story.summary?.slice(0, 100) || "",
      })),
    };
  }, [filteredExperiences]);

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-white p-5 shadow-[0_12px_50px_rgba(15,23,42,0.06)] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-slate-900 text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)]">
              <FunnelIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-slate-400">Signal console</p>
              <h2 className="text-xl font-semibold text-slate-900">Filter compensation intelligence</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-[0_5px_14px_rgba(15,23,42,0.07)] transition hover:bg-white"
          >
            <ArrowPathIcon className="h-4 w-4" /> Reset
          </button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="space-y-3.5">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search company, role, keyword"
                className="w-full rounded-full border border-slate-200/80 bg-white/70 px-14 py-3.5 text-sm font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All roles</option>
                {filters.roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All locations</option>
                {filters.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <select
                value={tierFilter}
                onChange={(event) => setTierFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All tiers</option>
                {filters.tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
              <select
                value={domainFilter}
                onChange={(event) => setDomainFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-[0_5px_12px_rgba(15,23,42,0.04)] focus:border-slate-400 focus:outline-none"
              >
                <option value="">All domains</option>
                {filters.domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-[26px] border border-slate-100 bg-white/95 p-4 text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.42em] text-slate-400">
              <span>Min median CTC</span>
              <span>58 LPA+</span>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={minCtc}
                onChange={(event) => setMinCtc(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-400 accent-slate-900"
              />
            </div>
            <p className="mt-1.5 text-right text-xs font-semibold text-slate-500">Set to {minCtc} LPA</p>
            <div className="mt-5 grid grid-cols-3 gap-2.5 text-[10px] font-semibold uppercase tracking-[0.42em] text-slate-400">
              <div>
                <p>Results</p>
                <p className="mt-1 text-xl font-semibold tracking-normal text-slate-900">{filteredRoles.length}</p>
              </div>
              <div>
                <p>Avg median</p>
                <p className="mt-1 text-xl font-semibold tracking-normal text-slate-900">
                  {filteredRoles.length ? formatLpa(roleStats.avgMedian) : "—"}
                </p>
              </div>
              <div>
                <p>Stories</p>
                <p className="mt-1 text-xl font-semibold tracking-normal text-slate-900">{filteredExperiences.length}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs text-slate-500">
              <div className="rounded-[16px] border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.45em] text-slate-400">Top domain</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{roleStats.topDomain}</p>
              </div>
              <div className="rounded-[16px] border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.45em] text-slate-400">Top tier</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{roleStats.topTier}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex h-[520px] flex-col rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.38em] text-slate-400">Top matches</p>
              <h3 className="text-lg font-semibold text-slate-900">Compensation radar</h3>
            </div>
            <span className="text-xs text-slate-500">{filteredRoles.length} roles</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100/80 px-3 py-1">Domain focus: {roleStats.topDomain}</span>
            <span className="rounded-full bg-slate-100/80 px-3 py-1">Tier bias: {roleStats.topTier}</span>
            <span className="rounded-full bg-slate-100/80 px-3 py-1">Min CTC: {minCtc} LPA</span>
          </div>
          <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-slate-100">
            <div className="h-full overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm">
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                    <th className="px-3 py-2.5">Company • Role</th>
                    <th className="px-3 py-2.5">Median</th>
                    <th className="px-3 py-2.5">Base</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">Offers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((row) => (
                      <tr key={row.id} className="bg-white/70 transition hover:bg-slate-50">
                        <td className="px-3 py-2.5">
                          <p className="font-semibold text-slate-900">{row.company}</p>
                          <p className="text-xs text-slate-500">{row.title}</p>
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-slate-900">{formatLpa(row.medianCtc)}</td>
                        <td className="px-3 py-2.5 text-slate-600">{formatLpa(row.base)}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.location}</td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {row.offersAccepted}/{row.offersMade}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-12 text-center text-sm text-slate-400">
                        No roles match your filters. Try adjusting criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex h-[520px] flex-col rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-slate-400">
                Median CTC trend
              </p>
              <h3 className="text-lg font-semibold text-slate-900">Comp curves</h3>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Median
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Base
              </span>
            </div>
          </div>
          <div className="mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, left: 0, right: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="ctcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c72ff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#4c72ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-10}
                  dy={12}
                />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={formatLpa} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [formatLpa(value), name === "ctc" ? "Median CTC" : "Base pay"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                />
                <Area type="monotone" dataKey="ctc" stroke="#4c72ff" strokeWidth={2.5} fill="url(#ctcGradient)" />
                <Area type="monotone" dataKey="base" stroke="#38bdf8" strokeWidth={2} fill="url(#baseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Overlay compares accepted median packages with base pay. Use filters to contrast domains or tiers quickly.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Interview intel</p>
              <h3 className="text-xl font-semibold text-slate-900">Stories matching your filters</h3>
            </div>
            <span className="text-sm text-slate-500">{filteredExperiences.length} stories</span>
          </div>
          <div className="mt-4 max-h-[480px] space-y-4 overflow-y-auto pr-3">
            {filteredExperiences.map((story) => (
              <article key={story.id} className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{story.company}</p>
                    <p className="text-lg font-semibold text-slate-900">{story.role}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {story.difficulty}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                    {story.location || "Remote"}
                  </span>
                  {story.batch ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                      Batch {story.batch}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-slate-600">{story.summary}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-500">
                  {(story.roundHighlights?.slice(0, 2) || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {story.tips ? (
                  <p className="mt-3 text-xs italic text-slate-500">Tip: {story.tips}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 text-slate-900 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Signal stack</p>
          <h3 className="mt-1 text-2xl font-semibold">Interview climate</h3>
          <div className="mt-6 grid gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Common difficulty</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{experienceSignals.commonDifficulty}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Popular location</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{experienceSignals.commonLocation}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Avg overall score</p>
              <p className="mt-1 text-4xl font-semibold text-slate-900">
                {experienceSignals.avgScore ? experienceSignals.avgScore : "—"}
              </p>
              <p className="text-xs text-slate-500">Rated by contributors</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Fresh highlights</p>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {experienceSignals.recentHighlights.length ? (
                experienceSignals.recentHighlights.map((item) => (
                  <li key={item.id}>
                    <p className="font-semibold text-slate-900">{item.company}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                    <p className="text-xs text-slate-500">{item.summary}</p>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500">No recent stories in this segment.</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
