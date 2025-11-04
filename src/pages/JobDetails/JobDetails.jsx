import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobById } from '../../api/mockJobs';
import { getCompanyById } from '../../api/mockCompanies';
import CompanyCard from '../../components/CompanyCard';
import ApplyModal from '../../components/ApplyModal';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getJobById(id)
      .then(j => {
        if (!mounted) return;
        if (!j) {
          setJob(null);
          setLoading(false);
          return;
        }
        setJob(j);
        return getCompanyById(j.companyId);
      })
      .then(c => {
        if (!mounted) return;
        setCompany(c);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return (
    <div className="p-8">
      <div className="mb-4"><Link to="/" className="text-primary">← Back</Link></div>
      <h2 className="text-xl font-semibold">Job not found</h2>
      <div className="mt-4">
        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg border">Go home</button>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{job.title}</h1>
            <div className="text-sm text-muted mt-1">{company?.name} • {company?.location}</div>
          </div>
          <div>
            <div className="text-sm text-muted mb-2">{job.type}</div>
            <button onClick={() => setShowApply(true)} className="px-4 py-2 rounded-full bg-accent text-white">Apply</button>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
        </section>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">Skills & Eligibility</h3>
          <div className="flex gap-2 flex-wrap">
            {job.skills?.map(s => <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{s}</span>)}
            {job.minCgpa && <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Min CGPA {job.minCgpa}</span>}
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <CompanyCard company={company} />
      </div>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} onApplied={() => {}} />}
    </main>
  );
}
