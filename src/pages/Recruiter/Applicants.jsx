import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicationsByJob,
  patchApplicationStatus,
} from "../../api/mockApplications";
import ApplicantsTable from "../../components/ApplicantsTable";

export default function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(getApplicationsByJob(parseInt(id)));
  }, [id]);

  const handleStatusChange = (appId, newStatus) => {
    patchApplicationStatus(appId, newStatus);
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Applicants for Job #{id}</h1>
      {apps.length ? (
        <ApplicantsTable
          applicants={apps}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <p>No applicants yet.</p>
      )}
    </div>
  );
}
