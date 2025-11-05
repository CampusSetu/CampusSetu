import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/mockJobs";
import {
  getApplicationsByJob,
  patchApplicationStatus,
} from "../../api/mockApplications";
import ApplicantsTable from "../../components/ApplicantsTable";

export function Applicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const jobId = parseInt(id, 10);
    getJobById(jobId).then(setJob);
    getApplicationsByJob(jobId).then(setApps);
  }, [id]);

  const handleStatusChange = (appId, newStatus) => {
    patchApplicationStatus(appId, newStatus).then(() => {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    });
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Applicants for {job ? `"${job.title}"` : `Job #${id}`}
        </h1>
        <p className="text-lg text-gray-500">Review and manage applications for your job posting.</p>
      </header>
      {apps.length ? (
        <ApplicantsTable
          applicants={apps}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="p-10 bg-white rounded-2xl text-center text-gray-600 shadow-lg">
          <h3 className="text-xl font-semibold">No Applicants Found</h3>
          <p className="mt-2">There are currently no applicants for this job.</p>
        </div>
      )}
    </>
  );
}
