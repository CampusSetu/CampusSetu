import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  GlobeAltIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { getRecruitmentHistory } from "../../api/mockRecruitmentHistory";

const toPercentDelta = (current, previous) => {
  if (previous === undefined || previous === null) {
    return current > 0 ? "+100%" : "0%";
  }
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const delta = ((current - previous) / previous) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
};

export function PlacementDashboard() {
  const [history, setHistory] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getRecruitmentHistory();
        if (!active) return;
        setHistory(data);
        setSelectedYear(data.years[data.years.length - 1]);
      } catch (error) {
        console.error("Failed to load placement dashboard", error);
        if (active) {
          setHistory(null);
          setSelectedYear(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const yearlyTrend = useMemo(() => {
    if (!history?.yearlyStats) return [];
    return history.yearlyStats.map((item) => ({
      year: item.year.toString(),
      placements: item.totalPlacements,
      success: Math.round(item.successRate * 100),
    }));
  }, [history]);

  const selectedStats = useMemo(() => {
    if (!history?.yearlyStats || !selectedYear) return null;
    return (
      history.yearlyStats.find((item) => item.year === selectedYear) || null
    );
  }, [history, selectedYear]);

  const previousStats = useMemo(() => {
    if (!history?.years || !selectedYear) return null;
    const index = history.years.indexOf(selectedYear);
    if (index > 0) {
      const previousYear = history.years[index - 1];
      return (
        history.yearlyStats.find((item) => item.year === previousYear) || null
      );
    }
    return null;
  }, [history, selectedYear]);

  const selectedFunnel = useMemo(() => {
    if (!history?.funnelByYear || !selectedYear) return null;
    return (
      history.funnelByYear.find((item) => item.year === selectedYear) || null
    );
  }, [history, selectedYear]);

  const selectedDepartments = useMemo(() => {
    if (!history?.placementsByDeptByYear || !selectedYear) return [];
    const entry = history.placementsByDeptByYear.find(
      (item) => item.year === selectedYear
    );
    return entry?.data || [];
  }, [history, selectedYear]);

  const selectedLocations = useMemo(() => {
    if (!history?.jobsByLocationByYear || !selectedYear) return [];
    const entry = history.jobsByLocationByYear.find(
      (item) => item.year === selectedYear
    );
    return entry?.data || [];
  }, [history, selectedYear]);

  const topCompanies = useMemo(() => {
    if (!history?.companies) return [];
    return [...history.companies].sort((a, b) => b.hires - a.hires).slice(0, 6);
  }, [history]);

  const successRate = Math.round((selectedStats?.successRate ?? 0) * 100);
  const placementsTotal = selectedStats?.totalPlacements ?? 0;
  const companiesVisited = selectedStats?.companiesVisited ?? 0;
  const departmentsCount = selectedDepartments.length;

  const previousSuccess = Math.round((previousStats?.successRate ?? 0) * 100);
  const previousPlacements = previousStats?.totalPlacements ?? null;
  const previousCompanies = previousStats?.companiesVisited ?? null;

  const funnelData = selectedFunnel
    ? [
        { stage: "Applied", value: selectedFunnel.applied },
        { stage: "Shortlisted", value: selectedFunnel.shortlisted },
        { stage: "Interview", value: selectedFunnel.interview },
        { stage: "Hired", value: selectedFunnel.hired },
      ]
    : [];

  const maxDeptValue = selectedDepartments.reduce(
    (max, item) => Math.max(max, item.value),
    1
  );

  const maxLocationValue = selectedLocations.reduce(
    (max, item) => Math.max(max, item.value),
    1
  );

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-elevated relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/60" />
          <div className="relative flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <AcademicCapIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Placements secured
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : placementsTotal}
              </p>
            </div>
            <p className="mt-auto text-xs font-medium text-indigo-600">
              {toPercentDelta(placementsTotal, previousPlacements)} vs last
              session
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Success rate
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : `${successRate}%`}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              {toPercentDelta(successRate, previousSuccess)} conversion uplift
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BuildingOfficeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Companies engaged
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : companiesVisited}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              {toPercentDelta(companiesVisited, previousCompanies)} new
              partnerships
            </p>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ChartBarSquareIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Departments aligned
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {loading ? "—" : departmentsCount}
              </p>
            </div>
            <p className="mt-auto text-xs text-slate-500">
              Cross-campus coverage for placement drives
            </p>
          </div>
        </div>
      </section>

      <section className="card-elevated p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ArrowTrendingUpIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Multi-year placement momentum
            </h2>
            <p className="text-sm text-slate-500">
              Compare conversion trends to back up placement strategies.
            </p>
          </div>
          {history?.years && (
            <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              <span>{history.years[0]}</span>
              <span className="text-slate-300">→</span>
              <span>{history.years[history.years.length - 1]}</span>
            </div>
          )}
        </div>

        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={yearlyTrend}
              margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="placementTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(221,83%,53%)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(221,83%,53%)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="placementSuccess"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(160,64%,45%)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(160,64%,45%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(148,163,184,0.35)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                width={36}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{
                  stroke: "rgba(148,163,184,0.4)",
                  strokeDasharray: "4 2",
                }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(203,213,225,0.6)",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 20px 50px -24px rgba(30,41,59,0.35)",
                }}
              />
              <Area
                type="monotone"
                dataKey="placements"
                name="Placements"
                stroke="hsl(221,83%,53%)"
                strokeWidth={2}
                fill="url(#placementTotal)"
              />
              <Area
                type="monotone"
                dataKey="success"
                name="Success %"
                stroke="hsl(160,64%,45%)"
                strokeWidth={2}
                fill="url(#placementSuccess)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <TrophyIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Placement pipeline breakdown
              </h2>
              <p className="text-sm text-slate-500">
                Quantify each stage for {selectedYear || "—"} cohorts.
              </p>
            </div>
            {history?.years && (
              <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                {history.years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      year === selectedYear
                        ? "bg-brand-600 text-white shadow"
                        : "text-slate-500 hover:text-brand-600"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{ top: 10, right: 16, bottom: 0, left: -10 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148,163,184,0.35)"
                  vertical={false}
                />
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={36}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148,163,184,0.08)" }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(203,213,225,0.6)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(221,83%,53%)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={64}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Top hiring partners
            </h2>
            <p className="text-sm text-slate-500">
              Focus on accounts driving offer momentum.
            </p>
            <div className="mt-5 space-y-4">
              {topCompanies.length > 0 ? (
                topCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {company.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {company.hires} hires · {company.offers} offers
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      {(company.successRate * 100).toFixed(0)}% success
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                  No partner data yet—sync analytics to populate.
                </div>
              )}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Geographic coverage
            </h2>
            <p className="text-sm text-slate-500">
              See where opportunities emerged for this batch.
            </p>
            <div className="mt-5 space-y-3">
              {selectedLocations.map((location) => (
                <div key={location.type}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {location.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {location.value}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{
                        width: `${Math.round(
                          (location.value / maxLocationValue) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Department performance
          </h2>
          <p className="text-sm text-slate-500">
            Align program interventions with placement outcomes.
          </p>
          <div className="mt-5 space-y-4">
            {selectedDepartments.map((dept) => (
              <div key={dept.type}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {dept.type}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {dept.value}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${Math.round(
                        (dept.value / maxDeptValue) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Global outreach
          </h2>
          <p className="text-sm text-slate-500">
            Partner with alumni chapters to unlock new regional cohorts.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/70 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Launch alumni drive
                </p>
                <p className="text-xs text-slate-500">
                  Curate role briefs and success stories for outreach mailers.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-500"
            >
              Share campaign kit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
