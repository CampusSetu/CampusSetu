import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../../api/mockJobs";
import JobListTable from "../../components/JobListTable";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const recruiterId = 101; // mock logged-in recruiter
    setJobs(getJobs({ postedBy: recruiterId }));
  }, []);

  const handleDelete = (id) => {
    deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">My Job Listings</h1>
      {jobs.length ? (
        <JobListTable jobs={jobs} onDelete={handleDelete} />
      ) : (
        <p>No jobs posted yet.</p>
      )}
    </div>
  );
}
