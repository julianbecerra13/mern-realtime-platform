import { useState } from 'react';
import { FiUser, FiLock, FiMail, FiShield, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const getInitials = (n) => n?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await api.patch('/users/profile', { name });
      await fetchUser();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoadingPassword(true);
    try {
      await api.patch('/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoadingPassword(false);
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-heading animate-fade-up">Settings</h1>

        {/* Profile Banner */}
        <div className="profile-banner animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="profile-banner-bg" />
          <div className="profile-banner-content">
            <div className="profile-avatar-lg">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{getInitials(user?.name)}</span>
              )}
            </div>
            <div className="profile-banner-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <div className="profile-badges">
                <span className="profile-badge">
                  <FiShield size={12} />
                  {user?.role}
                </span>
                <span className="profile-badge">
                  <FiCalendar size={12} />
                  Joined {joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Account Info */}
          <div className="profile-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="profile-card-header">
              <FiUser size={18} />
              <h2>Account Info</h2>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-readonly">
                  <FiMail size={16} />
                  <span>{user?.email}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Role</label>
                <div className="input-readonly">
                  <FiShield size={16} />
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                {loadingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="profile-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="profile-card-header">
              <FiLock size={18} />
              <h2>Security</h2>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loadingPassword}>
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
