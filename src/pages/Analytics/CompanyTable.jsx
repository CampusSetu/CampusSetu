import React, { useMemo, useState } from 'react';
import { getRecruitmentHistory } from '../../api/mockRecruitmentHistory';

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: 'hires', dir: 'desc' });

  React.useEffect(() => {
    getRecruitmentHistory().then(res => {
      setCompanies(res.companies);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const base = companies.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    return base.sort((a,b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      if (sort.dir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
  }, [companies, query, sort]);

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  };

  return (
    <div className="scroll-mt-24 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-800">Company Activity</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search company..."
            className="rounded-xl border border-white/60 bg-white/85 px-4 py-2 text-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => {
              const headers = ['Name','Hires','Offers','SuccessRate'];
              const rows = filtered.map(c => [c.name,c.hires,c.offers,`${Math.round(c.successRate*100)}%`]);
              const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'company_activity.csv'; a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-full border border-brand-500 bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_-18px_rgba(59,130,246,0.9)] transition hover:shadow-[0_14px_32px_-16px_rgba(59,130,246,0.95)]"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur">
        <table className="w-full text-sm">
          <thead className="bg-white/70 text-slate-500">
            <tr>
              <Th label="Company" onClick={() => toggleSort('name')} active={sort.key === 'name'} dir={sort.dir} />
              <Th label="Hires" onClick={() => toggleSort('hires')} active={sort.key === 'hires'} dir={sort.dir} />
              <Th label="Offers" onClick={() => toggleSort('offers')} active={sort.key === 'offers'} dir={sort.dir} />
              <Th label="Success" onClick={() => toggleSort('successRate')} active={sort.key === 'successRate'} dir={sort.dir} />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="border-t border-white/40">
                    <td colSpan={4} className="px-4 py-4">
                      <div className="flex gap-3">
                        <div className="h-4 w-32 rounded-full bg-white/70 animate-pulse" />
                        <div className="h-4 flex-1 rounded-full bg-white/60 animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              : filtered.length === 0
              ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      No companies match your search.
                    </td>
                  </tr>
                )
              : filtered.map((c) => (
                  <tr key={c.id} className="border-t border-white/50 transition hover:bg-white/70">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-700">{c.hires}</td>
                    <td className="px-4 py-3 text-slate-700">{c.offers}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-medium text-slate-800">{Math.round(c.successRate * 100)}%</span>
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500/80">Success % = hires ÷ offers accepted (approx). Data is mock and for layout demonstration.</p>
    </div>
  );
}

function Th({ label, onClick, active, dir }) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-900"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span className="text-slate-400">{dir === 'asc' ? '▲' : '▼'}</span>
        )}
      </span>
    </th>
  );
}
