import React from "react";

export function PlacementDashboard() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">CGC Dashboard</h1>
        <p className="text-lg text-gray-500">Oversee job approvals, CGC drives, and student management.</p>
      </header>

      <div className="p-10 bg-white rounded-2xl text-center text-gray-600 shadow-lg">
        <h3 className="text-xl font-semibold">Welcome, CGC Coordinator!</h3>
        <p className="mt-2">Use the navigation above to manage jobs and students.</p>
      </div>
    </div>
  );
}
