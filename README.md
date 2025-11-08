# CampusSetu

CampusSetu is a modern, clean, and user-friendly web application designed to streamline the campus placement process for students and recruiters. This project is built as a frontend prototype using React, Vite, and Tailwind CSS, and features a mock API for data handling.

## Application Routes

### Public Routes
- `GET /`: The public-facing homepage.
- `GET /jobs/:id`: A detailed view of a specific job posting.
- `GET /analytics`: A public dashboard with platform-wide analytics.

### Student Routes (Protected)
- `GET /student`: The main dashboard for students, showing a feed of available jobs.
- `GET /student/applications`: A list of all jobs the student has applied to.
- `GET /student/profile`: The student's profile page.

### Recruiter Routes (Protected)
- `GET /recruiter/dashboard`: The main dashboard for recruiters.
- `GET /recruiter/jobs`: A list of all jobs posted by the recruiter.
- `GET /recruiter/post-job`: A form to create a new job listing.
- `GET /recruiter/edit-job/:id`: A form to edit an existing job listing.
- `GET /recruiter/jobs/:id/applicants`: A list of all applicants for a specific job.

### CGC Routes (Protected)
- `GET /placement/dashboard`: The main dashboard for the CGC team.
- `GET /placement/approvals`: A queue to review and approve pending job listings.
- `GET /placement/students`: A page to manage student data.

## Key Features

- **Modal-Based Authentication:** A seamless sign-in and sign-up experience for both Students and Recruiters.
- **Role-Based Access:** Distinct, protected dashboards and functionalities for Students and Recruiters.
- **Student Dashboard:** A dynamic, filterable job feed for students to find and apply for opportunities.
- **Recruiter Dashboard:** A comprehensive suite of tools for recruiters to post, manage, and track job listings.
- **Full Job Lifecycle Management:** Recruiters can create, view, edit, and delete their job postings.
- **Applicant Tracking System (ATS):** Recruiters can view all applicants for a specific job and change their status (Pending, Shortlisted, Rejected).
- **Analytics Dashboard:** A comprehensive dashboard visualizing key metrics about jobs, applications, and placements.
- **Responsive Design:** A mobile-first approach ensuring the application is usable on various screen sizes.

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API (`zustand` is available but the primary flow uses context)
- **API:** Mock API using local data (`.json` files) loaded via the browser's `fetch` API to simulate backend interactions.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Authentication Flow

The project uses a mock, frontend-only authentication system that utilizes the browser's `localStorage` to persist user sessions.

- **Easy Login:** For development purposes, the **Sign In** form is pre-filled with credentials for both a default student (`riya@example.com`) and a default recruiter. You can log in with a single click.
- **Registration:** You can also toggle to the **Sign Up** form to create a new user with either a 'Student' or 'Recruiter' role.
- **Protected Routes:** Role-specific pages (e.g., `/student/*`, `/recruiter/*`) are protected. Unauthorized users will be redirected to the homepage where they can log in.

## Recruiter Features

The recruiter dashboard provides a complete set of tools to manage the hiring process:

- **Dashboard (`/recruiter/dashboard`):** A central hub for recruiters.
- **Post a Job (`/recruiter/post-job`):** A dedicated form to create new job listings with details like title, description, skills, and deadline.
- **My Job Listings (`/recruiter/jobs`):** View all jobs you have posted in a clean, tabular format. From here, you can:
    - **Edit:** Navigate to a pre-filled form to update any detail of the job posting.
    - **Delete:** Remove a job posting.
    - **View Applicants:** Navigate to the applicants page for a specific job.
- **View Applicants (`/recruiter/jobs/:id/applicants`):** See a list of all students who have applied for a job. You can review their details and update their application status directly from this table.

## CGC Features

The CGC dashboard is designed for administrative oversight of the placement process.

- **Dashboard (`/placement/dashboard`):** A central hub for CGC coordinators.
- **Job Approvals (`/placement/approvals`):** A critical feature where coordinators can view a queue of all jobs submitted by recruiters that are pending approval. They can approve jobs, which makes them visible to students in the job feed.

## Analytics Dashboard

The application includes a public-facing analytics dashboard available at `/analytics`. It provides a high-level overview of the platform's activity through a variety of charts and KPIs, including:

- **Key Metrics:** KPI cards for total jobs, applications, students, and companies.
- **Hiring Funnel:** A funnel chart visualizing the candidate progression from application to hiring.
- **Jobs by Location:** A donut chart showing the geographic distribution of job postings.
- **Placements by Department:** A bar chart displaying the number of students hired from different academic departments.
- **Top Skills in Demand:** A word cloud highlighting the most frequently requested skills in job descriptions.

### Profile Data Persistence

Due to browser security restrictions, the application cannot directly modify local files. Therefore, when you update your profile on the "My Profile" page:

1.  Changes are immediately saved to your browser's `localStorage` for session persistence and UI updates.
2.  To permanently save these changes to the `src/data/users.json` file in your codebase, you will need to instruct me (the CLI agent) to do so. After making changes in the UI, simply tell me: **"Commit the profile changes to the JSON file."** I will then execute the necessary commands to update `users.json`.

## Project Structure

A brief overview of the key directories:

- `src/api`: Contains mock API functions that simulate fetching data (e.g., `mockJobs.js`, `mockAnalytics.js`).
- `src/assets`: Static assets like images and SVGs.
- `src/components`: Reusable React components (e.g., `JobCard`, `AuthModal`, `JobForm`, `ApplicantsTable`).
- `src/contexts`: Global state management using React Context (e.g., `AuthContext`, `UIContext`).
- `src/data`: JSON files that act as a mock database for users, jobs, etc.
- `src/pages`: Top-level components for each page/route, organized by role (e.g., `Student/Dashboard.jsx`, `Recruiter/Dashboard.jsx`, `Analytics/AnalyticsDashboard.jsx`).
- `src/routes`: Components related to routing, such as `ProtectedRoute`.
