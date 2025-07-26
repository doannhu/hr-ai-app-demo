import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CandidateForm from './components/CandidateForm';
import EmployerLogin from './components/EmployerLogin';
import EmployerDashboard from './components/EmployerDashboard';

/**
 * Root application component.
 *
 * It defines top‑level routes for the candidate form, employer login,
 * and employer dashboard.  Unknown routes redirect to the candidate form.
 */
const App = () => {
  return (
    <Routes>
      {/* Candidate submission page */}
      <Route path="/" element={<CandidateForm />} />
      {/* Employer login page */}
      <Route path="/employer" element={<EmployerLogin />} />
      {/* Employer dashboard showing candidate submissions */}
      <Route path="/dashboard" element={<EmployerDashboard />} />
      {/* Redirect any unknown paths to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;