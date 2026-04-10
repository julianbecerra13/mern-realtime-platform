import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import { FiBell, FiUsers, FiActivity, FiZap } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { connected } = useSocket();

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-welcome">
          <h1>Welcome, {user?.name}</h1>
          <p>Here's what's happening in your platform</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ede9fe' }}>
              <FiBell size={24} color="#7c3aed" />
            </div>
            <div className="stat-info">
              <div className="stat-value">{unreadCount}</div>
              <div className="stat-label">Unread Notifications</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <FiZap size={24} color="#16a34a" />
            </div>
            <div className="stat-info">
              <div className="stat-value">{connected ? 'Active' : 'Inactive'}</div>
              <div className="stat-label">Realtime Connection</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <FiUsers size={24} color="#2563eb" />
            </div>
            <div className="stat-info">
              <div className="stat-value">{user?.role}</div>
              <div className="stat-label">Account Role</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <FiActivity size={24} color="#d97706" />
            </div>
            <div className="stat-info">
              <div className="stat-value">Healthy</div>
              <div className="stat-label">System Status</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/notifications" className="action-card">
              <FiBell size={20} />
              <span>View Notifications</span>
            </a>
            <a href="/profile" className="action-card">
              <FiUsers size={20} />
              <span>Edit Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
