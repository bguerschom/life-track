

// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated, otherwise to dashboard
  const defaultRoute = currentUser ? '/dashboard' : '/login';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        currentUser ? <Navigate to="/dashboard" /> : <LoginPage />
      } />
      <Route path="/register" element={
        currentUser ? <Navigate to="/dashboard" /> : <RegisterPage />
      } />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Default Route - Redirect to login or dashboard */}
      <Route path="/" element={<Navigate to={defaultRoute} />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to={defaultRoute} />} />
    </Routes>
  );
}

export default App;
