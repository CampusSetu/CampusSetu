import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { getAnalyticsData } from '../../api/mockAnalytics';
import { getRecruitmentHistory } from '../../api/mockRecruitmentHistory';
import Navbar from '../../components/Navbar';
import CompanyTable from './CompanyTable';

const piePalette = ['#737373', '#a1a1aa', '#94a3b8', '#e5e7eb', '#bae6fd', '#c4b5fd'];

const numberFormatter = new Intl.NumberFormat('en-IN');
const formatNumber = (value = 0) => numberFormatter.format(Math.round(value));

const LoadingState = () => (
  <div className="min-h-screen bg-slate-100">
    <Navbar />
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-48 rounded-3xl border border-slate-200 bg-white/70" />
        ))}
      </div>
    </div>
  </div>
);

const Card = ({ className = '', children }) => (
  <div className={`flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.4)] ${className}`}>
    {children}
  </div>
);

const SummaryCard = ({ title, value, change, footnote, children }) => (
  <Card>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        {change && (
          <p className="mt-1 text-xs font-medium text-emerald-600">{change}</p>
        )}
      </div>
      {footnote && <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">{footnote}</span>}
    </div>
    <div className="mt-4 grow">{children}</div>
  </Card>
);

const ResponsiveChart = ({ minHeight = 140, children }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {width ? (
        children(width)
      ) : (
        <div style={{ height: minHeight }} className="w-full" />
      )}
    </div>
  );
};

const buildCalendarMatrix = (referenceDate) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let cursor = 1 - startOffset;

  while (cursor <= daysInMonth) {
    const week = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(year, month, cursor + idx);
      return {
        date,
        inMonth: date.getMonth() === month,
      };
    });
    weeks.push(week);
    cursor += 7;
  }

  return weeks;
};

const CalendarCard = ({ referenceDate, highlights = [] }) => {
  const monthLabel = referenceDate.toLocaleString('default', { month: 'long' });
  const year = referenceDate.getFullYear();
  const weeks = useMemo(() => buildCalendarMatrix(referenceDate), [referenceDate]);
  const today = new Date();
  const isToday = (date) => date.toDateString() === today.toDateString();
  const highlightSet = new Set(highlights.map((day) => `${year}-${referenceDate.getMonth()}-${day}`));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{monthLabel} {year}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>◀</span>
          <span>▶</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-3 space-y-1 text-sm">
        {weeks.map((week, idx) => (
          <div key={idx} className="grid grid-cols-7 gap-1">
            {week.map(({ date, inMonth }) => {
              const day = date.getDate();
              const isHighlighted = inMonth && highlightSet.has(`${year}-${referenceDate.getMonth()}-${day}`);
              return (
                <span
                  key={date.toISOString()}
                  className={`flex aspect-square items-center justify-center rounded-full text-xs font-medium transition ${
                    inMonth ? 'text-slate-700' : 'text-slate-300'
                  } ${
                    isToday(date)
                      ? 'bg-slate-900 text-white'
                      : isHighlighted
                        ? 'bg-slate-900/10 text-slate-900'
                        : 'hover:bg-slate-100'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
};

const GoalCard = ({ goal, value, data }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Conversion Goal</p>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{value}</p>
        <p className="mt-2 text-xs text-slate-500">Target hires per week</p>
      </div>
      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
        Adjust
      </button>
    </div>
    <div className="mt-6">
      <ResponsiveChart minHeight={120}>
        {(width) => (
          <BarChart
            width={width}
            height={140}
            series={[{ data, color: '#111827', label: 'Hires' }]}
            xAxis={[{ data: data.map((_, idx) => idx + 1), scaleType: 'band' }]}
            yAxis={[{ hide: true }]}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            slotProps={{ legend: { hidden: true } }}
            sx={{
              '.MuiBarElement-root': { rx: 6 },
              '.MuiChartsAxis-line': { stroke: 'transparent' },
              '.MuiChartsAxis-tickLabel': { display: 'none' },
              '.MuiChartsAxis-tick': { display: 'none' },
            }}
          />
        )}
      </ResponsiveChart>
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
      <span>Weekly goal</span>
      <span>{goal} hires</span>
    </div>
  </Card>
);

const PlanCard = () => (
  <Card className="gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Upgrade your subscription</p>
      <p className="mt-3 text-sm text-slate-600">Move off the free plan to unlock recruiter collaboration, automated reports, and workflow automations.</p>
    </div>
    <form className="grid gap-3 text-sm text-slate-700">
      <div className="grid gap-2">
        <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Name</label>
        <input className="rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none" placeholder="Jane Cooper" />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Email</label>
        <input className="rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none" placeholder="jane@campussetu.com" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 grid gap-2">
          <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Card number</label>
          <input className="rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none" placeholder="4242 4242 4242 4242" />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">CVC</label>
          <input className="rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none" placeholder="123" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" className="rounded border-slate-300" defaultChecked /> Accept terms
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" className="rounded border-slate-300" defaultChecked /> Email updates
        </label>
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Plan</label>
        <div className="grid gap-2">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <span>Starter</span>
            <input type="radio" name="plan" defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <span>Growth</span>
            <input type="radio" name="plan" />
          </label>
        </div>
      </div>
      <button
        type="button"
        className="mt-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Upgrade to pro
      </button>
    </form>
  </Card>
);

const InviteCard = () => (
  <Card className="gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Invite a collaborator</p>
      <p className="mt-3 text-sm text-slate-600">Let hiring managers track funnel health and approvals directly.</p>
    </div>
    <div className="flex flex-col gap-3">
      <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Continue with GitHub
      </button>
      <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Continue with Google
      </button>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none" placeholder="email@company.com" />
      <input type="password" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none" placeholder="Temporary password" />
      <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Send invitation
      </button>
    </div>
  </Card>
);

const ConversationCard = () => (
  <Card className="gap-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Support</p>
        <p className="mt-2 text-sm text-slate-600">Sofia Davis • sofia@campussetu.com</p>
      </div>
      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-400">+</button>
    </div>
    <div className="grid gap-3 text-sm text-slate-600">
  <div className="self-start rounded-2xl border border-slate-200 bg-white px-4 py-3">Hi, how can I help you today?</div>
  <div className="ml-auto rounded-2xl bg-slate-900 px-4 py-3 text-white">We need help configuring the recruiter dashboard for fall hiring.</div>
  <div className="self-start rounded-2xl border border-slate-200 bg-white px-4 py-3">Sure thing. I've shared the playbook and will stay online for follow ups.</div>
    </div>
  </Card>
);

const PlacementTableCard = ({ companies }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Recent placement teams</p>
        <p className="mt-2 text-sm text-slate-500">Monitor partner activity and committed offers.</p>
      </div>
      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">Add partner</button>
    </div>
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.24em] text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Offers</th>
            <th className="px-4 py-3 font-semibold">Hires</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-t border-slate-100">
              <td className="px-4 py-3 text-xs font-semibold text-emerald-600">{company.successRate > 0.6 ? 'Active' : 'Processing'}</td>
              <td className="px-4 py-3 font-medium text-slate-700">{company.name}</td>
              <td className="px-4 py-3 text-slate-500">{company.offers}</td>
              <td className="px-4 py-3 text-slate-500">{company.hires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalyticsData(), getRecruitmentHistory()])
      .then(([analyticsResponse, historyResponse]) => {
        setAnalytics(analyticsResponse);
        setHistory(historyResponse);
      })
      .finally(() => setLoading(false));
  }, []);

  const placements = useMemo(() => history?.yearlyStats ?? [], [history]);
  const placementChange = useMemo(() => {
    if (placements.length < 2) return null;
    const current = placements[placements.length - 1].totalPlacements;
    const previous = placements[placements.length - 2].totalPlacements;
    if (!previous) return null;
    const delta = ((current - previous) / previous) * 100;
    return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% vs last year`;
  }, [placements]);

  const applicationTrend = useMemo(() => history?.funnelByYear ?? [], [history]);
  const applicationChange = useMemo(() => {
    if (!applicationTrend.length) return null;
    const latest = applicationTrend[applicationTrend.length - 1];
    const total = latest.applied;
    const previous = applicationTrend[applicationTrend.length - 2]?.applied ?? null;
    if (!previous) return null;
    const delta = ((total - previous) / previous) * 100;
    return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% vs last year`;
  }, [applicationTrend]);

  const goalData = useMemo(() => {
    const hired = analytics?.funnel?.find((stage) => stage.stage === 'Hired')?.count ?? 0;
    return Array.from({ length: 12 }, (_, idx) => Math.max(Math.round(hired / 12 + (idx % 3) * 3 - 4), 4));
  }, [analytics]);

  const funnelSeries = useMemo(() => {
    if (!applicationTrend.length) return null;
    const years = applicationTrend.map((item) => `${item.year}`);
    const shortlisted = applicationTrend.map((item) => item.shortlisted);
    const hired = applicationTrend.map((item) => item.hired);
    const interview = applicationTrend.map((item) => item.interview);
    return { years, shortlisted, hired, interview };
  }, [applicationTrend]);

  const locationSeries = useMemo(() => {
    if (!analytics?.jobsByLocation) return [];
    return analytics.jobsByLocation.map((location, idx) => ({
      id: idx,
      value: location.value,
      label: location.type,
    }));
  }, [analytics]);

  if (loading) return <LoadingState />;
  if (!analytics || !history) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-32 text-center text-sm text-red-500">
          Unable to load analytics right now.
        </div>
      </div>
    );
  }

  const latestYear = placements[placements.length - 1];
  const latestPlacements = latestYear?.totalPlacements ?? 0;
  const totalApplications = analytics.kpis.totalApplications;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-3">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Analytics</span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Placement intelligence</h1>
          <p className="max-w-2xl text-sm text-slate-500">A calm control center designed with shadcn-inspired cards and Material UI charts to visualize hiring velocity, funnel strength, and partner momentum.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total placements" value={formatNumber(latestPlacements)} change={placementChange} footnote="Season">
            <ResponsiveChart>
              {(width) => (
                <LineChart
                  width={width}
                  height={140}
                  series={[{ data: placements.map((item) => item.totalPlacements), area: true, showMark: false, color: '#111827' }]}
                  xAxis={[{ data: placements.map((item) => `${item.year}`), scaleType: 'point' }]}
                  yAxis={[{ hide: true }]}
                  margin={{ top: 10, bottom: 20, left: 10, right: 10 }}
                  slotProps={{ legend: { hidden: true } }}
                  sx={{
                    '.MuiAreaElement-root': { fillOpacity: 0.12 },
                    '.MuiLineElement-root': { strokeWidth: 2 },
                    '.MuiChartsAxis-root': { display: 'none' },
                    '.MuiMarkElement-root': { display: 'none' },
                  }}
                />
              )}
            </ResponsiveChart>
          </SummaryCard>

          <SummaryCard title="Total Applications" value={formatNumber(totalApplications)} change={applicationChange} footnote="YoY">
            <ResponsiveChart>
              {(width) => (
                <LineChart
                  width={width}
                  height={140}
                  series={[{ data: applicationTrend.map((item) => item.applied), color: '#18181b', showMark: false, area: true }]}
                  xAxis={[{ data: applicationTrend.map((item) => `${item.year}`), scaleType: 'point' }]}
                  yAxis={[{ hide: true }]}
                  margin={{ top: 10, bottom: 20, left: 10, right: 10 }}
                  slotProps={{ legend: { hidden: true } }}
                  sx={{
                    '.MuiAreaElement-root': { fillOpacity: 0.12 },
                    '.MuiLineElement-root': { strokeWidth: 2 },
                    '.MuiChartsAxis-root': { display: 'none' },
                    '.MuiMarkElement-root': { display: 'none' },
                  }}
                />
              )}
            </ResponsiveChart>
          </SummaryCard>

          <CalendarCard referenceDate={new Date()} highlights={[5, 12, 13, 18]} />

          <GoalCard goal={Math.round((analytics.funnel.find((stage) => stage.stage === 'Hired')?.count ?? 0) / 12)} value={goalData[goalData.length - 1]} data={goalData} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Funnel velocity</p>
                <p className="mt-2 text-sm text-slate-500">Compare shortlisted, interview, and hired signals across cohorts.</p>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">Download</button>
            </div>
            <div className="mt-6">
              {funnelSeries && (
                <ResponsiveChart>
                  {(width) => (
                    <LineChart
                      width={width}
                      height={220}
                      series={[
                        { id: 'shortlisted', data: funnelSeries.shortlisted, label: 'Shortlisted', color: '#d4d4d4', showMark: false },
                        { id: 'interview', data: funnelSeries.interview, label: 'Interview', color: '#737373', showMark: false },
                        { id: 'hired', data: funnelSeries.hired, label: 'Hired', color: '#0a0a0a', showMark: false },
                      ]}
                      xAxis={[{ data: funnelSeries.years, scaleType: 'point' }]}
                      yAxis={[{ label: 'Count' }]}
                      margin={{ top: 20, bottom: 30, left: 20, right: 20 }}
                      slotProps={{ legend: { direction: 'row', position: { vertical: 'top', horizontal: 'right' } } }}
                      sx={{
                        '.MuiChartsLegend-root': { marginBottom: -12 },
                        '.MuiLineElement-root': { strokeWidth: 2 },
                        '.MuiMarkElement-root': { display: 'none' },
                        '.MuiChartsAxis-tickLabel': { fontSize: 11, fill: '#475569' },
                        '.MuiChartsAxis-label': { fontSize: 11, fill: '#94a3b8' },
                      }}
                    />
                  )}
                </ResponsiveChart>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Jobs by location</p>
                <p className="mt-2 text-sm text-slate-500">Where partners are hiring from this season.</p>
              </div>
            </div>
            <div className="mt-6">
              <ResponsiveChart minHeight={220}>
                {(width) => (
                  <PieChart
                    width={width}
                    height={240}
                    series={[{
                      innerRadius: 40,
                      outerRadius: 90,
                      paddingAngle: 4,
                      cornerRadius: 6,
                      data: locationSeries,
                      colors: piePalette,
                    }]}
                    slotProps={{ legend: { hidden: false, direction: 'column', position: { vertical: 'middle', horizontal: 'right' } } }}
                    sx={{
                      '.MuiChartsLegend-root': { fontSize: 11, color: '#475569' },
                      '.MuiPieArc-root': { stroke: 'transparent' },
                    }}
                  />
                )}
              </ResponsiveChart>
            </div>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <PlanCard />
          <InviteCard />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <ConversationCard />
          <PlacementTableCard companies={history.companies.slice(0, 5)} />
        </section>

        <section className="mt-10">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Partner directory</p>
                <p className="mt-2 text-sm text-slate-500">Full record of every recruiter actively collaborating with the campus.</p>
              </div>
            </div>
            <div className="mt-6">
              <CompanyTable />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
