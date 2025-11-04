import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobById } from '../../api/mockJobs';
import { getCompanyById } from '../../api/mockCompanies';
import ApplyModal from '../../components/ApplyModal';
import Navbar from '../../components/Navbar'; // Import the Navbar

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setLoading(true);
    getJobById(id)
      .then(j => {
        if (!j) {
          setJob(null);
          setLoading(false);
          return null; // Stop promise chain
        }
        setJob(j);
        return getCompanyById(j.postedBy); // Use postedBy to get company
      })
      .then(c => {
        if (c) setCompany(c);
      })
      .catch(() => { /* Handle errors silently */ })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">This job listing may have been removed or the link is incorrect.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-primary text-white font-semibold">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-primary mb-1">{company?.name || '...'}</p>
              <h1 className="text-4xl font-extrabold text-gray-800">{job.title}</h1>
              <p className="mt-2 text-gray-600">{company?.location || 'Location not specified'}</p>
            </div>
            <div className="flex-shrink-0">
              <button 
                onClick={() => setShowApply(true)} 
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-accent text-white font-bold text-lg transform hover:scale-105 transition-transform"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description & Skills */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
            </section>
            <section className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Skills Required</h3>
              <div className="flex gap-2 flex-wrap">
                {job.skills?.map(s => <span key={s} className="text-sm px-3 py-1 bg-primary-light text-primary-dark font-medium rounded-full">{s}</span>)}
              </div>
            </section>
          </div>

          {/* Right Column: Details & Company Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h3>
              <div className="space-y-4">
                <DetailItem label="Job Type" value={job.type} />
                {job.minCgpa && <DetailItem label="Minimum CGPA" value={job.minCgpa} />}
                <DetailItem label="Application Deadline" value={new Date(job.deadline).toLocaleDateString()} />
              </div>
            </div>
            {company && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About the Company</h3>
                <p className="text-gray-700 mb-4">{company.description}</p>
                <a href={company.website} target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline">
                  Visit Website →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} onApplied={() => {}} />}
    </div>
  );
}
