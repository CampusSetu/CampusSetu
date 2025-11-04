import React from 'react';
import { Outlet } from 'react-router-dom';

// This is a basic layout for the recruiter section.
// You can add a shared sidebar, header, etc. here.
export default function RecruiterLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
