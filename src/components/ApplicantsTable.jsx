import React from "react";

export default function ApplicantsTable({ applicants, onStatusChange }) {
  return (
    <table className="w-full border-collapse bg-white shadow rounded-2xl overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Applied At</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((a) => (
          <tr key={a.id} className="border-t">
            <td className="p-3">{a.name}</td>
            <td className="p-3">{a.email}</td>
            <td className="p-3">
              {new Date(a.appliedAt).toLocaleDateString()}
            </td>
            <td className="p-3">{a.status}</td>
            <td className="p-3 text-right">
              <select
                value={a.status}
                onChange={(e) => onStatusChange(a.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
