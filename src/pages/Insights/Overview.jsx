import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInsights } from "../../contexts/InsightsContext";

const rangeOptions = [
  { label: "Last 3 months", key: "3m" },
  { label: "Last 30 days", key: "30d" },
  { label: "Last 7 days", key: "7d" },
];

const rangeSlices = { "3m": 12, "30d": 10, "7d": 7 };

const tableTabs = [
  { label: "Outline", key: "outline" },
  { label: "Past Performance", key: "performance", badge: 3 },
  { label: "Key Personnel", key: "people", badge: 2 },
  { label: "Focus Documents", key: "documents" },
];

const statusTokens = [
  { label: "Done", color: "bg-emerald-50 text-emerald-700" },
  { label: "In Process", color: "bg-amber-50 text-amber-700" },
  { label: "Review", color: "bg-slate-100 text-slate-700" },
];

export default function Overview() {
  const { aggregates, roles, experiences } = useInsights();
  const [range, setRange] = useState("3m");
  const [activeTab, setActiveTab] = useState("outline");

  const stats = useMemo(() => {
    const avgBase = roles.length
      ? roles.reduce((sum, row) => sum + (row.base || 0), 0) / roles.length
      : null;
    return [
      {
        label: "Median CTC",
        value: aggregates?.avgCtc ? `${aggregates.avgCtc.toFixed(1)} LPA` : "—",
        helper: "Trending up this season",
        delta: "+12.5%",
      },
      {
        label: "Offers tracked",
        value: aggregates?.totalOffers ?? "—",
        helper: "Down 8% vs last term",
        delta: "−8%",
      },
      {
        label: "Active accounts",
        value: roles.length ? roles.reduce((sum, row) => sum + (row.offersAccepted || 0), 0) : "—",
        helper: "Strong student retention",
        delta: "+6.1%",
      },
      {
        label: "Avg base",
        value: avgBase ? `${avgBase.toFixed(1)} LPA` : "—",
        helper: "Steady performance",
        delta: "+4.5%",
      },
    ];
  }, [aggregates, roles]);

  const chartData = useMemo(() => {
    const base = roles.slice(0, 16).map((row, index) => ({
      label: `Apr ${3 + index}`,
      visitors: row.medianCtc * 2 + index * 3,
      watchers: row.offersAccepted * 6 + 80,
    }));
    const fallback = Array.from({ length: 12 }, (_, index) => ({
      label: `Week ${index + 1}`,
      visitors: 160 + Math.sin(index) * 30,
      watchers: 120 + Math.cos(index / 2) * 20,
    }));
    const series = base.length ? base : fallback;
    return series.slice(-rangeSlices[range]);
  }, [roles, range]);

  const tableRows = useMemo(() => {
    const reviewers = experiences.map((exp) => exp.company);
    const baseRows = roles.slice(0, 10).map((row, index) => ({
      id: row.id,
      section: row.company,
      type: row.title,
      status: statusTokens[index % statusTokens.length],
      target: row.offersMade || 0,
      limit: row.offersAccepted || 0,
      reviewer: reviewers[index] || "Career Cell",
    }));
    if (activeTab === "people") {
      return baseRows.sort((a, b) => b.limit - a.limit);
    }
    if (activeTab === "performance") {
      return baseRows.sort((a, b) => b.target - a.target);
    }
    if (activeTab === "documents") {
      return baseRows.slice(0, 5);
    }
    return baseRows;
  }, [roles, experiences, activeTab]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <article key={card.label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-card">
            <div className="flex items-start justify-between text-sm text-slate-500">
              <span>{card.label}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {card.delta}
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.helper}</p>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total visitors</p>
            <h2 className="text-2xl font-semibold text-slate-900">Campus traffic for the selected window</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  range === option.key ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="watchers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#475569" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                itemStyle={{ fontSize: 12 }}
                contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#0f172a" fillOpacity={1} fill="url(#visitors)" />
              <Area type="monotone" dataKey="watchers" stroke="#475569" fillOpacity={1} fill="url(#watchers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {tableTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${
                activeTab === tab.key ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="rounded-full bg-white/20 px-2 text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
              Customize Columns
            </button>
            <button className="rounded-2xl border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              + Add Section
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Outline</th>
                <th className="px-4 py-3">Section Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-4 py-3 text-slate-500">{row.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${row.status.color}`}>
                      {row.status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.target}</td>
                  <td className="px-4 py-3 text-slate-500">{row.limit}</td>
                  <td className="px-4 py-3 text-slate-500">{row.reviewer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
