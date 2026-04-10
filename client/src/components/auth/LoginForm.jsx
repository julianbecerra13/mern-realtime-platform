import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield, FiZap, FiBell } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <div className="floating-shapes">
          <div className="floating-shape" />
          <div className="floating-shape" />
          <div className="floating-shape" />
        </div>
        <div className="auth-branding-content">
          <h1>Build faster. Ship smarter.</h1>
          <p>
            Real-time collaboration platform with enterprise-grade security and modern developer experience.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><FiShield size={20} /></div>
              JWT authentication with token rotation
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><FiZap size={20} /></div>
              WebSocket-powered real-time updates
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><FiBell size={20} /></div>
              Instant push notifications
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue to Nexus</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-icon">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FiMail className="icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FiLock className="icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <button onClick={handleGoogleLogin} className="btn-google">
            <FcGoogle size={20} />
            Google
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
