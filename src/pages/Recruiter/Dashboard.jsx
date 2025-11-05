import React from "react";

export function RecruiterDashboard() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Recruiter Dashboard</h1>
        <p className="text-lg text-gray-500">Manage your job listings and applicants.</p>
      </header>
      
      {/* Content for the recruiter dashboard will go here */}
      <div className="p-10 bg-white rounded-2xl text-center text-gray-600 shadow-lg">
        <h3 className="text-xl font-semibold">Welcome, Recruiter!</h3>
        <p className="mt-2">This is your dashboard. You can manage your job listings and view applicants here.</p>
      </div>
    </div>
  );
}
