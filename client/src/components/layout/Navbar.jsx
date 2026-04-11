import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBell, FiLogOut, FiUser, FiSun, FiMoon, FiHome, FiMenu, FiX, FiUsers, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { connected } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-icon">&#9889;</span>
          </div>
          <span className="brand-text">Nexus</span>
        </Link>

        {user && (
          <>
            <div className={`navbar-center ${mobileOpen ? 'mobile-open' : ''}`}>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <FiHome size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/tasks" className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}>
                <FiClipboard size={18} />
                <span>Tasks</span>
              </Link>
              <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>
                <FiUsers size={18} />
                <span>Users</span>
              </Link>
              <Link to="/notifications" className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}>
                <FiBell size={18} />
                <span>Notifications</span>
                {unreadCount > 0 && <span className="nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </Link>
            </div>

            <div className="navbar-actions">
              <div className="connection-indicator">
                <span className={`pulse-dot ${connected ? 'online' : 'offline'}`} />
                <span className="connection-label">{connected ? 'Live' : 'Offline'}</span>
              </div>

              <button onClick={toggleTheme} className="nav-icon-btn" title="Toggle theme">
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-initials">{getInitials(user.name)}</div>
                  )}
                </button>

                {profileOpen && (
                  <div className="dropdown-menu animate-scale-in">
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item">
                      <FiUser size={16} />
                      Profile Settings
                    </Link>
                    <button onClick={logout} className="dropdown-item dropdown-item-danger">
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
