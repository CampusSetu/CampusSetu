import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/Auth/Auth";
import JobDetails from "./pages/JobDetails/JobDetails";
import StudentLayout from "./pages/Student/StudentLayout";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentApplications from "./pages/Student/Applications";
import StudentProfile from "./pages/Student/Profile";
import PostJob from "./pages/Recruiter/PostJob";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="applications" element={<StudentApplications />} />
      </Route>

      <Route
        path="*"
        element={<div style={{ padding: 40 }}>Page not found</div>}
      />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/recruiter/post-job" element={<PostJob />} />
    </Routes>
  );
}
