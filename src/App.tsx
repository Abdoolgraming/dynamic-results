import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import AuthGuard from './components/auth/AuthGuard';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Timetable from './pages/Timetable';
import { Toast } from './components/ui/Toast';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toast />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginForm />} />

          {/* Protected routes */}
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/results" element={<Results />} />
            <Route path="/timetable" element={<Timetable />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;