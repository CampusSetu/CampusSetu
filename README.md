# Campus SETU

This project is a web application for a campus job portal, built with React and Vite.

## Pages

The application includes the following pages:

- **Home (`src/pages/Home/Home.jsx`):** The main landing page.
- **Authentication (Modal):** A modal overlay on the homepage handles user login and registration.
- **Job Details (`src/pages/JobDetails/JobDetails.jsx`):** Shows the detailed description of a single job posting.

### Student Section

- **Student Dashboard (`src/pages/Student/Dashboard.jsx`):** The main dashboard for students after logging in.
- **My Applications (`src/pages/Student/Applications.jsx`):** Lists all the jobs a student has applied to.
- **My Profile (`src/pages/Student/Profile.jsx`):** Allows students to view and edit their profile information.

### Recruiter Section

- **Post a Job (`src/pages/Recruiter/PostJob.jsx`):** A form for recruiters to create new job listings.
- **Job Listings (`src/pages/Recruiter/JobListings.jsx`):** A view for recruiters to see and manage all the jobs they have posted.
- **Applicants (`src/pages/Recruiter/Applicants.jsx`):** Allows recruiters to see a table of all students who have applied to a specific job.

## Authentication

This project uses a mock, frontend-only authentication system. User sessions and details are stored in the browser's `localStorage`.

### How it Works

- **Login / Registration:** When a user clicks "Get Started", a modal appears. The default view is for signing in, but users can toggle to a sign-up form.
- **User Data:** User information is saved to `localStorage` upon registration.
- **Protected Routes:** The student and recruiter dashboards (e.g., `/student` and `/recruiter`) are protected. If a user is not logged in, they will be redirected to the homepage, and can open the authentication modal from there.
- **Session Persistence:** The user's session persists across page reloads by loading the authentication state from `localStorage` when the app starts.

---

*This README was updated by Gemini.*