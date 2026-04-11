import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import {
  FiBell, FiActivity, FiZap, FiUsers, FiArrowUpRight,
  FiCheckCircle, FiClock, FiTrendingUp, FiClipboard,
  FiPlay, FiCheck,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const { connected } = useSocket();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

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

  const taskTotal = stats?.tasks?.total || 0;
  const taskCompleted = stats?.tasks?.completed || 0;
  const taskProgress = taskTotal > 0 ? Math.round((taskCompleted / taskTotal) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="container">
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

        <div className="stats-grid">
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap purple"><FiBell size={20} /></div>
              <Link to="/notifications" className="stat-trend"><FiArrowUpRight size={16} /></Link>
            </div>
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread Notifications</div>
            <div className="stat-bar">
              <div className="stat-bar-fill purple" style={{ width: `${Math.min(unreadCount * 10, 100)}%` }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap blue"><FiUsers size={20} /></div>
              <Link to="/users" className="stat-trend"><FiArrowUpRight size={16} /></Link>
            </div>
            <div className="stat-value">{stats?.users || 0}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-bar">
              <div className="stat-bar-fill blue" style={{ width: `${Math.min((stats?.users || 0) * 20, 100)}%` }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrap cyan"><FiClipboard size={20} /></div>
              <Link to="/tasks" className="stat-trend"><FiArrowUpRight size={16} /></Link>
            </div>
            <div className="stat-value">{taskTotal}</div>
            <div className="stat-label">Total Tasks ({taskProgress}% done)</div>
            <div className="stat-bar">
              <div className="stat-bar-fill cyan" style={{ width: `${taskProgress}%` }} />
            </div>
          </div>

          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-card-header">
              <div className={`stat-icon-wrap ${connected ? 'green' : 'gray'}`}><FiZap size={20} /></div>
              <span className={`stat-status ${connected ? 'active' : ''}`}>{connected ? 'Connected' : 'Offline'}</span>
            </div>
            <div className="stat-value">{connected ? 'Live' : 'Offline'}</div>
            <div className="stat-label">WebSocket Status</div>
            <div className="stat-bar">
              <div className={`stat-bar-fill ${connected ? 'green' : 'gray'}`} style={{ width: connected ? '100%' : '0%' }} />
            </div>
          </div>
        </div>

        {/* Task Summary */}
        {stats && taskTotal > 0 && (
          <div className="task-summary animate-fade-up" style={{ animationDelay: '0.45s' }}>
            <div className="task-summary-item">
              <FiClock size={16} className="ts-pending" />
              <span>{stats.tasks.pending} pending</span>
            </div>
            <div className="task-summary-item">
              <FiPlay size={16} className="ts-progress" />
              <span>{stats.tasks.in_progress} in progress</span>
            </div>
            <div className="task-summary-item">
              <FiCheck size={16} className="ts-done" />
              <span>{stats.tasks.completed} completed</span>
            </div>
          </div>
        )}

        <div className="dash-grid">
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

          <div className="dash-section animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="section-header">
              <h2><FiTrendingUp size={18} /> Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/tasks" className="action-card">
                <div className="action-icon cyan"><FiClipboard size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Tasks</span>
                  <span className="action-desc">Create and manage tasks</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>

              <Link to="/users" className="action-card">
                <div className="action-icon blue"><FiUsers size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Users</span>
                  <span className="action-desc">Browse and notify users</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>

              <Link to="/notifications" className="action-card">
                <div className="action-icon purple"><FiBell size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Notifications</span>
                  <span className="action-desc">View and manage alerts</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>

              <Link to="/profile" className="action-card">
                <div className="action-icon green"><FiCheckCircle size={22} /></div>
                <div className="action-info">
                  <span className="action-name">Profile</span>
                  <span className="action-desc">Settings & security</span>
                </div>
                <FiArrowUpRight className="action-arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
