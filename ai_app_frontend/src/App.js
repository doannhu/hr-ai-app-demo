import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import CandidateForm from './components/CandidateForm';
import EmployerLogin from './components/EmployerLogin';
import EmployerDashboard from './components/EmployerDashboard';

/**
 * Root application component.
 *
 * It defines top‑level routes for the welcome page, candidate form, employer login,
 * and employer dashboard.  Unknown routes redirect to the welcome page.
 */
const App = () => {
  return (
    <Routes>
      {/* Welcome page with two cards */}
      <Route path="/" element={<Welcome />} />
      {/* Candidate submission page */}
      <Route path="/candidate" element={<CandidateForm />} />
      {/* Employer login page */}
      <Route path="/employer" element={<EmployerLogin />} />
      {/* Employer dashboard showing candidate submissions */}
      <Route path="/dashboard" element={<EmployerDashboard />} />
      {/* Redirect any unknown paths to the welcome page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;