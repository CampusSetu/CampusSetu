import React from "react";
import { Link } from "react-router-dom";

export default function JobListTable({ jobs, onDelete }) {
  return (
    <table className="w-full border-collapse bg-white shadow rounded-2xl overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-3">Title</th>
          <th className="p-3">Created</th>
          <th className="p-3">Deadline</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-t">
            <td className="p-3">{job.title}</td>
            <td className="p-3">
              {new Date(job.createdAt).toLocaleDateString()}
            </td>
            <td className="p-3">{job.deadline}</td>
            <td className="p-3 text-right space-x-3">
              <Link
                to={`/recruiter/jobs/${job.id}/applicants`}
                className="text-blue-600"
              >
                View
              </Link>
              <button onClick={() => onDelete(job.id)} className="text-red-600">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
