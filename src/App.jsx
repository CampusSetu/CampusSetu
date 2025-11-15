import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import JobDetails from "./pages/JobDetails/JobDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthModal from "./components/AuthModal";

// Student Pages
import {
  StudentDashboard,
  StudentApplications,
  StudentProfile,
  StudentInterviewHub,
  StudentResumeLab,
} from "./pages/Student";

// Recruiter Pages
import {
  RecruiterDashboard,
  PostJob,
  JobListings,
  Applicants,
  EditJob,
  RecruiterInterviewHub,
  RecruiterResumeHub,
} from "./pages/Recruiter";

// Placement (CGC) Pages
import {
  PlacementDashboard,
  JobApprovals,
  ManageStudents,
} from "./pages/Placement";

// Analytics Page
import { AnalyticsDashboard } from "./pages/Analytics";

// Feature Pages
import {
  AlumniNetwork,
  InterviewScheduling,
  ResumeIntelligence,
} from "./pages/Features";

// Insights System
import InsightsLayout from "./pages/Insights/InsightsLayout";
import Overview from "./pages/Insights/Overview";
import Explorer from "./pages/Insights/Explorer";
import Stories from "./pages/Insights/Stories";
import Share from "./pages/Insights/Share";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/insights" element={<InsightsLayout />}>
          <Route index element={<Overview />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="stories" element={<Stories />} />
          <Route path="share" element={<Share />} />
        </Route>

        {/* Feature Pages */}
        <Route
          path="/features/company-insights"
          element={<Navigate to="/insights" replace />}
        />
        <Route
          path="/features/company-insights"
          element={<Navigate to="/insights" replace />}
        />
        <Route path="/features/alumni-network" element={<AlumniNetwork />} />
        <Route
          path="/features/interview-scheduling"
          element={<InterviewScheduling />}
        />
        <Route
          path="/features/resume-intelligence"
          element={<ResumeIntelligence />}
        />

        {/* Protected Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute>
              <StudentApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/interview-hub"
          element={
            <ProtectedRoute>
              <StudentInterviewHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/resume-lab"
          element={
            <ProtectedRoute>
              <StudentResumeLab />
            </ProtectedRoute>
          }
        />

        {/* Protected Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute>
              <JobListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/edit-job/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/interview-hub"
          element={
            <ProtectedRoute>
              <RecruiterInterviewHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/resume-hub"
          element={
            <ProtectedRoute>
              <RecruiterResumeHub />
            </ProtectedRoute>
          }
        />

        {/* Protected CGC Routes */}
        <Route
          path="/placement/dashboard"
          element={
            <ProtectedRoute>
              <PlacementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/approvals"
          element={
            <ProtectedRoute>
              <JobApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/students"
          element={
            <ProtectedRoute>
              <ManageStudents />
            </ProtectedRoute>
          }
        />

        {/* Not Found Route */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Page not found</div>}
        />
      </Routes>
      <AuthModal />
    </>
  );
}
