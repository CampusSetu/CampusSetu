# Campus SETU

Campus SETU is a modern, clean, and user-friendly web application designed to streamline the campus placement process for students and recruiters. This project is built as a frontend prototype using React, Vite, and Tailwind CSS, and features a mock API for data handling.

## Key Features

- **Modal-Based Authentication:** A seamless sign-in and sign-up experience that appears as a modal over the homepage, rather than a separate page.
- **Role-Based Access:** The application is designed with distinct roles for Students and Recruiters (though current development has focused on the student flow).
- **Dynamic Job Dashboard:** A redesigned, continuous-scrolling student dashboard with a top-mounted filter bar inspired by modern e-commerce sites.
- **Client-Side Filtering:** Instantly filter the job feed by title, company, location, and job type.
- **Application Tracking:** A dedicated "My Applications" page for students to track the status of their job applications in a clean, table-based layout with clear status indicators.
- **Responsive Design:** A mobile-first approach ensuring the application is usable on various screen sizes.

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API (`zustand` is available but the primary flow uses context)
- **API:** Mock API using local data (`.json` files) to simulate backend interactions.

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

- **Easy Login:** For development purposes, the **Sign In** form is pre-filled with the credentials of a default student user (`riya@example.com`). You can log in with a single click.
- **Registration:** You can also toggle to the **Sign Up** form to create a new user with either a 'Student' or 'Recruiter' role.
- **Protected Routes:** The student-specific pages (`/student`, `/student/applications`, etc.) are protected. Unauthorized users will be redirected to the homepage where they can log in via the authentication modal.

## Project Structure

A brief overview of the key directories:

- `src/api`: Contains mock API functions that simulate fetching data.
- `src/assets`: Static assets like images and SVGs.
- `src/components`: Reusable React components used throughout the application (e.g., `JobCard`, `AuthModal`, `FilterBar`).
- `src/contexts`: Global state management using React Context (e.g., `AuthContext`, `UIContext`).
- `src/data`: JSON files that act as a mock database for users, jobs, etc.
- `src/pages`: Top-level components for each page or route in the application.
- `src/routes`: Components related to routing, such as `ProtectedRoute`.
