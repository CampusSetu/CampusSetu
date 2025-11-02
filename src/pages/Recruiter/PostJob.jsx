import React from "react";
import JobForm from "../../components/JobForm";
import { createJob } from "../../api/mockJobs";

export default function PostJob() {
  const handleSubmit = (job) => {
    const recruiterId = 101; // mock user
    createJob({ ...job, postedBy: recruiterId });
    alert("Job posted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6">Post a New Job</h1>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}
