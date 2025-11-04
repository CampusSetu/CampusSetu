import React, { useEffect, useState, useMemo } from "react";
import { getApplications } from "../../api/mockApplications";
import { getJobById } from "../../api/mockJobs";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  const statusClasses = {
    Shortlisted: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

export default function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationsData = async () => {
      const studentId = 1; // mock studentId = 1
      const fetchedApplications = getApplications(studentId);

      const enrichedApplications = await Promise.all(
        fetchedApplications.map(async (app) => {
          const job = await getJobById(app.jobId);
          return {
            ...app,
            jobTitle: job ? job.title : "Unknown Job",
            companyName: job ? job.companyName : "Unknown Company",
          };
        })
      );
      setApps(enrichedApplications);
      setLoading(false);
    };

    fetchApplicationsData();
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Applications</h1>
        <p className="text-lg text-gray-500">Track the status of all your job applications in one place.</p>
      </header>

      {loading ? (
        <div className="text-center text-gray-500">Loading applications...</div>
      ) : apps.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl text-center text-gray-600">
          <h3 className="text-xl font-semibold">No Applications Found</h3>
          <p className="mt-2">You haven't applied to any jobs yet. Start exploring the Job Feed!</p>
          <Link to="/student" className="mt-4 inline-block px-6 py-2 rounded-full bg-primary text-white font-semibold">Find Jobs</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Job Title</th>
                <th className="p-4 font-semibold text-gray-600">Company</th>
                <th className="p-4 font-semibold text-gray-600">Date Applied</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{app.jobTitle}</td>
                  <td className="p-4 text-gray-600">{app.companyName}</td>
                  <td className="p-4 text-gray-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4"><StatusBadge status={app.status} /></td>
                  <td className="p-4">
                    <Link to={`/jobs/${app.jobId}`} className="text-primary hover:underline text-sm font-medium">View Job</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

