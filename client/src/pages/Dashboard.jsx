import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import {
  FiBell, FiActivity, FiZap, FiShield, FiArrowUpRight,
  FiCheckCircle, FiClock, FiTrendingUp, FiServer,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const { connected } = useSocket();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentNotifications = notifications.slice(0, 5);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Hero Section */}
        <div className="dash-hero animate-fade-up">
          <div className="dash-hero-content">
            <span className="dash-greeting">{getGreeting()}</span>
            <h1 className="dash-title">{user?.name}</h1>
            <p className="dash-subtitle">Here's what's happening with your platform today</p>
          </div>
          <div className="dash-hero-visual">
            <div className="hero-orb orb-1" />
            <div className="hero-orb orb-2" />
            <div className="hero-orb orb-3" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap purple">
                <FiBell size={20} />
              </div>
              <FiArrowUpRight className="stat-trend" size={16} />
            </div>
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread Notifications</div>
            <div className="stat-bar">
              <div className="stat-bar-fill purple" style={{ width: `${Math.min(unreadCount * 10, 100)}%` }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-card-header">
              <div className={`stat-icon-wrap ${connected ? 'green' : 'gray'}`}>
                <FiZap size={20} />
              </div>
              <span className={`stat-status ${connected ? 'active' : ''}`}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="stat-value">{connected ? 'Live' : 'Offline'}</div>
            <div className="stat-label">WebSocket Status</div>
            <div className="stat-bar">
              <div className={`stat-bar-fill ${connected ? 'green' : 'gray'}`} style={{ width: connected ? '100%' : '0%' }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap blue">
                <FiShield size={20} />
              </div>
            </div>
            <div className="stat-value capitalize">{user?.role}</div>
            <div className="stat-label">Account Role</div>
            <div className="stat-bar">
              <div className="stat-bar-fill blue" style={{ width: user?.role === 'admin' ? '100%' : '40%' }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap cyan">
                <FiServer size={20} />
              </div>
              <span className="stat-status active">Operational</span>
            </div>
            <div className="stat-value">Healthy</div>
            <div className="stat-label">System Status</div>
            <div className="stat-bar">
              <div className="stat-bar-fill cyan" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="dash-grid">
          {/* Activity Feed */}
          <div className="dash-section animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="section-header">
              <h2><FiActivity size={18} /> Recent Activity</h2>
              <Link to="/notifications" className="section-link">View all <FiArrowUpRight size={14} /></Link>
            </div>
            <div className="activity-feed">
              {recentNotifications.length === 0 ? (
                <div className="empty-feed">
                  <FiClock size={32} />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentNotifications.map((notif, i) => (
                  <div key={notif._id} className="activity-item" style={{ animationDelay: `${0.6 + i * 0.05}s` }}>
                    <div className={`activity-dot ${notif.type}`} />
                    <div className="activity-content">
                      <span className="activity-title">{notif.title}</span>
                      <span className="activity-time">{formatTime(notif.createdAt)}</span>
                    </div>
                    {!notif.read && <div className="activity-unread" />}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-section animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="section-header">
              <h2><FiTrendingUp size={18} /> Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/notifications" className="action-card">
                <div className="action-icon purple"><FiBell size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Notifications</span>
                  <span className="action-desc">View and manage alerts</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>

              <Link to="/profile" className="action-card">
                <div className="action-icon blue"><FiShield size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Security</span>
                  <span className="action-desc">Profile & password</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>

              <div className="action-card">
                <div className="action-icon green"><FiCheckCircle size={22} /></div>
                <div className="action-info">
                  <span className="action-name">API Health</span>
                  <span className="action-desc">All systems operational</span>
                </div>
                <span className="action-badge">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
