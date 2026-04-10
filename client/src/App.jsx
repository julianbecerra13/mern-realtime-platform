import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AuthCallback from './components/auth/AuthCallback';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotificationPanel from './components/notifications/NotificationPanel';

const App = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e1e2e' : '#ffffff',
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          },
        }}
      />
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterForm />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
