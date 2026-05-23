import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TrainerLogin from './pages/TrainerLogin';
import TrainerDashboard from './pages/TrainerDashboard';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, role }) => {
  const { admin, trainer, member, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <span className="text-4xl text-primary animate-pulse mb-4">⚡</span>
        <p className="text-textSecondary font-heading font-bold tracking-widest text-lg">SECURE PORTAL AUTHORIZATION...</p>
      </div>
    );
  }

  if (role === 'admin') {
    return admin ? children : <Navigate to="/admin/login" replace />;
  }
  if (role === 'trainer') {
    return trainer ? children : <Navigate to="/trainer/login" replace />;
  }
  if (role === 'member') {
    return member ? children : <Navigate to="/member/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Trainer Portal */}
          <Route path="/trainer/login" element={<TrainerLogin />} />
          <Route 
            path="/trainer/dashboard" 
            element={
              <ProtectedRoute role="trainer">
                <TrainerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Member Portal */}
          <Route path="/member/login" element={<MemberLogin />} />
          <Route 
            path="/member/dashboard" 
            element={
              <ProtectedRoute role="member">
                <MemberDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
