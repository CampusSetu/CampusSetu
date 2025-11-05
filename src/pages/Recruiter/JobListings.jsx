import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../../api/mockJobs";
import { JobListTable } from "../../components/JobListTable";

export function JobListings() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const recruiterId = 101; // mock logged-in recruiter
    getJobs({ postedBy: recruiterId }).then(setJobs);
  }, []);

  const handleDelete = (id) => {
    deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Job Listings</h1>
        <p className="text-lg text-gray-500">Manage your active job postings.</p>
      </header>
      {jobs.length ? (
        <JobListTable jobs={jobs} onDelete={handleDelete} />
      ) : (
        <div className="p-10 bg-white rounded-2xl text-center text-gray-600 shadow-lg">
          <h3 className="text-xl font-semibold">No Jobs Found</h3>
          <p className="mt-2">You have not posted any jobs yet. Click 'Post a Job' to create one.</p>
        </div>
      )}
    </>
  );
}
