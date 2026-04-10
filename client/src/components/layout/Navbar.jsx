import { Link } from 'react-router-dom';
import { FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { connected } = useSocket();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          MERN Platform
        </Link>

        {user && (
          <div className="navbar-actions">
            <div className="connection-status">
              <span className={`status-dot ${connected ? 'online' : 'offline'}`} />
              <span className="status-text">{connected ? 'Live' : 'Offline'}</span>
            </div>

            <Link to="/notifications" className="nav-icon-btn">
              <FiBell size={20} />
              {unreadCount > 0 && <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>

            <Link to="/profile" className="nav-icon-btn">
              <FiUser size={20} />
            </Link>

            <button onClick={logout} className="nav-icon-btn" title="Logout">
              <FiLogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
