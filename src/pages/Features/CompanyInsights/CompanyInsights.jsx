import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowTrendingUpIcon,
  SparklesIcon,
  BanknotesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../../../components/Navbar";
import {
  fetchAggregates,
  fetchCompensationRows,
  fetchInterviewExperiences,
  fetchRatingDistribution,
} from "../../../api/mockCompanyInsights";

const ratingLabels = {
  transparency: "Process transparency",
  difficulty: "Interview difficulty",
  negotiation: "Offer negotiation",
  culture: "Work culture",
};

const badgeColors = {
  transparency: "from-sky-100 to-sky-200 text-sky-800",
  difficulty: "from-violet-100 to-violet-200 text-violet-800",
  negotiation: "from-amber-100 to-amber-200 text-amber-800",
  culture: "from-emerald-100 to-emerald-200 text-emerald-800",
};

const formatLakhs = (value = 0) => `${Number(value).toFixed(1)} LPA`;

const ExperienceCard = ({ exp }) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          {exp.company}
        </p>
        <h3 className="text-lg font-semibold text-slate-900">{exp.role}</h3>
      </div>
      <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
        Batch {exp.batch}
      </span>
    </div>
    <p className="text-sm text-slate-600">{exp.summary}</p>
    <ul className="list-disc space-y-1 text-sm text-slate-500 pl-5">
      {exp.roundHighlights.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
        {exp.location}
      </span>
      <span>Difficulty: {exp.difficulty}</span>
      <span className="font-semibold text-slate-700">Score {exp.overallScore}</span>
    </div>
    <p className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
      {exp.tips}
    </p>
  </article>
);

export default function CompanyInsights() {
  const [loading, setLoading] = useState(true);
  const [compRows, setCompRows] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [ratingSummary, setRatingSummary] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filters, setFilters] = useState({ role: "", location: "" });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [compData, agg, ratings] = await Promise.all([
          fetchCompensationRows(),
          fetchAggregates(),
          fetchRatingDistribution(),
        ]);
        if (!cancelled) {
          setCompRows(compData);
          setAggregates(agg);
          setRatingSummary(ratings);
        }
      } catch (error) {
        console.error("Failed to load company insights", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadExperiences() {
      try {
        const data = await fetchInterviewExperiences({
          limit: 40,
          role: filters.role,
          location: filters.location,
        });
        if (!cancelled) {
          setExperiences(data);
        }
      } catch (error) {
        console.error("Failed to load interview experiences", error);
      }
    }
    loadExperiences();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const uniqueRoles = useMemo(
    () => Array.from(new Set(compRows.map((row) => row.title))).sort(),
    [compRows]
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(compRows.map((row) => row.location))).sort(),
    [compRows]
  );

  const filteredCompRows = useMemo(() => {
    return compRows
      .filter((row) =>
        (!filters.role || row.title === filters.role) &&
        (!filters.location || row.location === filters.location)
      )
      .sort((a, b) => b.medianCtc - a.medianCtc)
      .slice(0, 12);
  }, [compRows, filters]);

  const chartData = useMemo(() => {
    return filteredCompRows.slice(0, 6).map((row) => ({
      role: `${row.company.split(" ")[0]} • ${row.title}`,
      base: row.base,
      bonus: row.bonus,
      stock: row.stock,
      other: row.other,
    }));
  }, [filteredCompRows]);

  const acceptanceSnapshot = useMemo(() => {
    const bestAcceptance = [...compRows]
      .sort((a, b) => b.acceptanceRate - a.acceptanceRate)
      .slice(0, 4);
    const dropoutWatch = [...compRows]
      .sort((a, b) => b.dropoutRate - a.dropoutRate)
      .slice(0, 4);
    return { bestAcceptance, dropoutWatch };
  }, [compRows]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-slate-500 transition-colors hover:text-brand-600"
          >
            ← Back to Home
          </Link>
        </div>

        <section className="mb-12 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Glassdoor for Campus
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
                Placement transparency powered by your campus community
              </h1>
              <p className="max-w-3xl text-lg text-slate-600">
                Benchmark compensation, evaluate interview rigor, and read anonymized experiences before you step into the hiring room. Built with the same calm aesthetic as the CampusSetu workspace.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card-elevated p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.38em] text-slate-400">
                Companies tracked
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : aggregates?.companies}
              </p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BanknotesIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.38em] text-slate-400">
                Avg median CTC
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : formatLakhs(aggregates?.avgCtc)}
              </p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <UsersIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.38em] text-slate-400">
                Offers tracked
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : aggregates?.totalOffers}
              </p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ArrowTrendingUpIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.38em] text-slate-400">
                Acceptance rate
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {loading ? "—" : `${aggregates?.acceptanceRate}%`}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Peer sourced ratings
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Rate every stage of the placement experience
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ratingSummary.map((rating) => {
              const colorClass = badgeColors[rating.category] || "from-slate-100 to-slate-200 text-slate-800";
              return (
                <div
                  key={rating.category}
                  className={`rounded-2xl border border-white/70 bg-gradient-to-br ${colorClass} p-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.65)]`}
                >
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
                  {ratingLabels[rating.category] || rating.category}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-4xl font-semibold text-slate-900">
                    {rating.average.toFixed(1)}
                  </p>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Highest rated
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {rating.topCompany?.name}
                    </p>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12 space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Compensation intelligence
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Real CTC breakdowns shared by alumni and seniors
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.role}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, role: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
              >
                <option value="">All roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={filters.location}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, location: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
              >
                <option value="">All locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Company • Role</th>
                    <th className="px-4 py-3">Median CTC</th>
                    <th className="px-4 py-3">Base</th>
                    <th className="px-4 py-3">Bonus</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Offers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm">
                  {filteredCompRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{row.company}</div>
                        <p className="text-xs text-slate-500">
                          {row.title} • {row.location}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {formatLakhs(row.medianCtc)}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatLakhs(row.base)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatLakhs(row.bonus)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatLakhs(row.stock)}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {row.offersAccepted}/{row.offersMade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Breakdown visual
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Top compensation mixes this season
              </h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="role" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} angle={-10} dy={10} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value, name) => [formatLakhs(value), name]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar dataKey="base" stackId="ctc" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bonus" stackId="ctc" fill="#a855f7" />
                    <Bar dataKey="stock" stackId="ctc" fill="#f97316" />
                    <Bar dataKey="other" stackId="ctc" fill="#10b981" radius={[0, 0, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Stacked bars show proportion of each component in the overall offer. Hover to view absolute values.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Acceptance & dropout intelligence
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Spot the safest bets and fragile offers
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-500">
                High conversions
              </p>
              <ul className="mt-4 space-y-3">
                {acceptanceSnapshot.bestAcceptance.map((row) => (
                  <li key={`${row.company}-${row.title}`} className="flex items-center justify-between rounded-2xl bg-emerald-50/50 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">{row.company}</p>
                      <p className="text-xs text-slate-500">{row.title}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700">
                      {(row.acceptanceRate * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
                Dropout watchlist
              </p>
              <ul className="mt-4 space-y-3">
                {acceptanceSnapshot.dropoutWatch.map((row) => (
                  <li key={`${row.company}-${row.title}-drop`} className="flex items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">{row.company}</p>
                      <p className="text-xs text-slate-500">{row.title}</p>
                    </div>
                    <span className="text-sm font-semibold text-rose-600">
                      {(row.dropoutRate * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Interview experiences
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Anonymous playbooks from seniors who made it
              </h2>
            </div>
            <div className="text-sm text-slate-500">
              {experiences.length} stories filtered
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-brand-50 to-brand-100 p-10 text-center shadow-soft">
          <h2 className="text-3xl font-semibold text-slate-900">
            Extend the loop: share your offer or interview story
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600">
            Help future batches avoid blind spots. Upload compensation slips, rate every round, and publish anonymized debriefs directly from your CampusSetu dashboard.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-500"
            >
              Go to dashboard
            </Link>
            <Link
              to="/analytics"
              className="inline-flex items-center rounded-full border border-white/70 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm"
            >
              View analytics
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
