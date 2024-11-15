

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// src/App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Lazy load components
const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./components/auth/RegisterPage'));
const ResetPassword = React.lazy(() => import('./components/auth/ResetPassword'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const ProjectSection = React.lazy(() => import('./components/dashboard/ProjectSection'));
const TaskSection = React.lazy(() => import('./components/dashboard/TaskSection'));
const FinanceSection = React.lazy(() => import('./components/dashboard/FinanceSection'));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/" /> : <RegisterPage />} 
        />
        <Route 
          path="/reset-password" 
          element={currentUser ? <Navigate to="/" /> : <ResetPassword />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                {/* Add your main dashboard layout here */}
                <main className="flex-1">
                  <Routes>
                    <Route path="projects" element={<ProjectSection />} />
                    <Route path="tasks" element={<TaskSection />} />
                    <Route path="finances" element={<FinanceSection />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold text-gray-800">404</h1>
              <p className="text-gray-600">Page not found</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Go Back
              </button>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default App;
