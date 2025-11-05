import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobForm from "../../components/JobForm";
import { getJobById, updateJob } from "../../api/mockJobs";

export function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  const handleSubmit = (updatedData) => {
    updateJob(id, { ...job, ...updatedData }).then(() => {
      alert("Job updated successfully");
      navigate("/recruiter/jobs");
    });
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Edit Job</h1>
        <p className="text-lg text-gray-500">Update the details for your job listing.</p>
      </header>
      <JobForm onSubmit={handleSubmit} initialData={job} />
    </>
  );
}
