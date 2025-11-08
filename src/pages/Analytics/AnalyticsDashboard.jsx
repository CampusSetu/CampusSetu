import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '../../api/mockAnalytics';
import { getRecruitmentHistory } from '../../api/mockRecruitmentHistory';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../../components/ui/chart';
import CompanyTable from './CompanyTable';
import Navbar from '../../components/Navbar';

const KPICard = ({ title, value }) => (
  <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.55)] backdrop-blur">
    <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500/90">
      {title}
    </p>
    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
  </div>
);

const SectionCard = ({ title, children, config }) => (
  <ChartContainer config={config} className="h-full">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        {title}
      </h3>
    </div>
    <div className="mt-4 flex-grow min-h-[240px]">{children}</div>
  </ChartContainer>
);

const LoadingState = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]">
    <Navbar />
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="mb-12 space-y-4 text-center">
        <div className="mx-auto h-9 w-32 rounded-full bg-white/70 animate-pulse" />
        <div className="mx-auto h-10 w-2/3 max-w-xl rounded-full bg-white/70 animate-pulse" />
        <div className="mx-auto h-4 w-3/4 max-w-2xl rounded-full bg-white/60 animate-pulse" />
      </div>
      <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.6)] backdrop-blur md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-20 rounded-2xl bg-white/70 animate-pulse" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-72 rounded-3xl border border-white/60 bg-white/80 p-6 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  // Derived insight state
  const [insights, setInsights] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    Promise.all([getAnalyticsData(), getRecruitmentHistory()])
      .then(([analytics, hist]) => {
        setData(analytics);
        setHistory(hist);
        if (hist?.yearlyStats?.length) {
          const ys = hist.yearlyStats.sort((a,b)=>a.year-b.year);
          const prev = ys[ys.length - 2];
          const latest = ys[ys.length - 1];
          const placementGrowth = prev ? ((latest.totalPlacements - prev.totalPlacements) / prev.totalPlacements) * 100 : null;
          const successDelta = prev ? (latest.successRate - prev.successRate) * 100 : null;
          const topCompany = hist.companies.reduce((m,c)=> c.hires > m.hires ? c : m, hist.companies[0]);
          const topSkill = analytics.topSkills?.[0];
          setInsights({ placementGrowth, successDelta, topCompany, topSkill, latestYear: latest.year });
          setSelectedYear('All');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Could not load analytics data.</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_58%)]">
      <Navbar />
      <header className="border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center lg:px-6">
          <span className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            Analytics
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 md:text-[2.9rem]">
            Recruitment intelligence hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Explore historical placement patterns, funnel efficiency, and evolving skill demand. Surface the stories recruiters need to collaborate with campus teams and plan proactive engagement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-slate-600">
            {['Live season', '3-year trend', 'Company activity'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/60 bg-white/80 px-3 py-1 font-semibold text-slate-500 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.65)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <nav className="border-t border-white/50 bg-white/65 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 lg:gap-6">
            {[
              { href: '#overview', label: 'Overview' },
              { href: '#metrics', label: 'KPIs' },
              { href: '#charts', label: 'Charts' },
              { href: '#history', label: 'History' },
              { href: '#companies', label: 'Companies' },
              { href: '#insights', label: 'Insights' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative inline-flex items-center transition-colors duration-150 ease-out hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

  {/* Overview & Definitions */}
  <section id="overview" className="mb-12 px-4 scroll-mt-24 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Overview</h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">Data shown covers the current season and historical traction for the last three academic placement cycles. Metrics are aggregated from mock activity (jobs, applications, and offers) to emulate a production environment and highlight structure, not real institution data.</p>
            {insights && (
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-white/60 bg-white/90 p-4 space-y-1 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                  <p className="text-xs uppercase tracking-wide text-slate-500">YoY Placement Growth</p>
                  <p className="text-2xl font-semibold text-primary">
                    {insights.placementGrowth ? `${Math.round(insights.placementGrowth)}%` : '—'}
                  </p>
                  <p className="text-xs text-slate-500">Compared to previous year</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/90 p-4 space-y-1 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Success Rate Delta</p>
                  <p className="text-2xl font-semibold text-emerald-600">
                    {insights.successDelta ? `${insights.successDelta > 0 ? '+' : ''}${insights.successDelta.toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-xs text-slate-500">Change since prior cycle</p>
                </div>
              </div>
            )}
          </div>
          <aside className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Definitions</h3>
            <ul className="space-y-4 text-xs md:text-sm text-slate-600">
              <li><span className="font-medium text-slate-700">Applications:</span> All submitted student intents across active jobs.</li>
              <li><span className="font-medium text-slate-700">Hiring Funnel:</span> Progression counts through shortlist → interview → hire stages.</li>
              <li><span className="font-medium text-slate-700">Success Rate:</span> Hires ÷ Offers accepted; historical values approximate efficiency.</li>
              <li><span className="font-medium text-slate-700">Skill Demand:</span> Frequency of required skills across posted jobs (top 8 displayed).</li>
            </ul>
            {insights?.topCompany && (
              <div className="mt-2 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Highlight</p>
                <p className="mt-1 text-sm text-slate-700"><span className="font-medium">{insights.topCompany.name}</span> leads hires ({insights.topCompany.hires}) with a {Math.round(insights.topCompany.successRate * 100)}% success rate.</p>
                {insights.topSkill && <p className="mt-1 text-xs text-slate-600">Most requested skill: <span className="font-medium text-slate-700">{insights.topSkill.name}</span>.</p>}
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* KPI Section */}
  <section id="metrics" className="px-4 lg:px-6 scroll-mt-24">
        <div className="mx-auto mb-10 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard title="Total Jobs" value={data.kpis.totalJobs} />
          <KPICard title="Applications" value={data.kpis.totalApplications} />
          <KPICard title="Students" value={data.kpis.totalStudents} />
          <KPICard title="Companies" value={data.kpis.totalCompanies} />
        </div>
      </section>

      {/* Main Charts Section */}
  <section id="charts" className="px-4 lg:px-6 scroll-mt-24">
        <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Charts</h2>
          {history?.years && (
            <div className="flex items-center gap-2">
              {['All', ...history.years].map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selectedYear === y
                      ? 'border border-brand-500 bg-brand-500 text-white shadow-[0_10px_24px_-18px_rgba(59,130,246,0.9)]'
                      : 'border border-white/60 bg-white/80 text-slate-600 backdrop-blur hover:bg-white/90'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SectionCard
            title="Hiring Funnel"
            config={{ applied: { color: 'hsl(220 90% 56%)' }, shortlisted: { color: 'hsl(199 89% 48%)' }, interview: { color: 'hsl(38 92% 50%)' }, hired: { color: 'hsl(142 71% 45%)' } }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={(function(){
                if(!history || selectedYear==='All') return data.funnel;
                const fy = history.funnelByYear?.find(f=>f.year===selectedYear);
                if(!fy) return data.funnel;
                return [
                  { stage:'Applied', count: fy.applied },
                  { stage:'Shortlisted', count: fy.shortlisted },
                  { stage:'Interview', count: fy.interview },
                  { stage:'Hired', count: fy.hired },
                ];
              })()} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-applied)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard
            title="Jobs by Location"
            config={{ location: { color: 'hsl(25 95% 53%)' } }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={(function(){
                  if(!history || selectedYear==='All') return data.jobsByLocation;
                  const yl = history.jobsByLocationByYear?.find(x=>x.year===selectedYear)?.data;
                  return yl || data.jobsByLocation;
                })()} dataKey="value" nameKey="type" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {(selectedYear==='All' ? data.jobsByLocation : (history?.jobsByLocationByYear?.find(x=>x.year===selectedYear)?.data || data.jobsByLocation)).map((_, idx) => (
                    <Cell key={idx} fill={`hsl(${220 + idx * 20} 90% 60%)`} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="type" labelKey="value" />} />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard
            title="Placements by Department"
            config={{ value: { color: 'hsl(220 90% 56%)' } }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={(function(){
                if(!history || selectedYear==='All') return data.placementsByDept;
                const yd = history.placementsByDeptByYear?.find(x=>x.year===selectedYear)?.data;
                return yd || data.placementsByDept;
              })()} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard
            title="Top Skills in Demand"
            config={{ value: { color: 'hsl(199 89% 48%)' } }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.topSkills.slice(0, 8)} layout="vertical" margin={{ left: 24 }} accessibilityLayer>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      </section>

      {/* Recruitment History */}
      {history && (
  <section id="history" className="px-4 lg:px-6 pb-4 scroll-mt-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Placements Over 3 Years" config={{ placements: { color: 'hsl(220 90% 56%)' }, rate: { color: 'hsl(142 71% 45%)' } }}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={history.yearlyStats} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="totalPlacements" name="Placements" stroke="var(--color-placements)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Success Rate (Last 3 Years)" config={{ rate: { color: 'hsl(25 95% 53%)' } }}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={history.yearlyStats} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="successRate" name="Success Rate" stroke="var(--color-rate)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
          {/* Running band of companies */}
          <div className="max-w-6xl mx-auto mt-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white/90 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white/90 to-transparent" />
              <div className="whitespace-nowrap flex gap-4 py-4 animate-[marquee_25s_linear_infinite]" style={{}}>
                {[...history.companies, ...history.companies].map((c, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full border border-white/60 bg-white/90 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          {/* Narrative Insights */}
          {insights && (
            <div id="insights" className="mx-auto mt-12 grid max-w-6xl gap-6 scroll-mt-24 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Performance Narrative</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Year {insights.latestYear} shows a placement growth of <span className="font-semibold text-primary">{Math.round(insights.placementGrowth)}%</span> over the previous cycle, while success efficiency improved by <span className="font-semibold text-emerald-600">{insights.successDelta.toFixed(1)}%</span>. This indicates stronger alignment between candidate preparation and recruiter expectations.</p>
                <p className="text-sm text-slate-600 leading-relaxed">Top hiring momentum is driven by <span className="font-medium text-slate-700">{insights.topCompany.name}</span>, suggesting deeper partnership leverage opportunities (e.g. early project showcases, curated candidate pools).</p>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Strategic Recommendations</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-primary" />Prioritize workshops around high-demand skill <span className="font-medium text-slate-700">{insights.topSkill?.name}</span> to sustain funnel velocity.</li>
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-accent" />Expand shortlist calibration with departments showing lower conversion to lift overall success rate.</li>
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />Formalize partnership tiering with leading companies for early role previews and feedback loops.</li>
                </ul>
              </div>
            </div>
          )}
        </section>
      )}
      {/* Companies Table Section */}
  <section id="companies" className="px-4 pb-20 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur">
          <CompanyTable />
        </div>
      </section>
    </div>
  );
}
