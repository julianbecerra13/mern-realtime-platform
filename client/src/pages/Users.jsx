import { useState, useEffect } from 'react';
import { FiSearch, FiSend, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Users.css';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendTo, setSendTo] = useState(null);
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (q = '') => {
    try {
      const { data } = await api.get(`/users?search=${q}&limit=50`);
      setUsers(data.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/notifications', {
        recipient: sendTo._id,
        ...notifForm,
      });
      toast.success(`Notification sent to ${sendTo.name}`);
      setSendTo(null);
      setNotifForm({ title: '', message: '', type: 'info' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="users-page">
      <div className="container">
        <div className="users-header animate-fade-up">
          <div>
            <h1>Users</h1>
            <p>{users.length} registered users</p>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <FiSearch className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="users-grid">
            {users.map((u, i) => (
              <div key={u._id} className="user-card animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="user-card-avatar">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} />
                  ) : (
                    <span>{getInitials(u.name)}</span>
                  )}
                </div>
                <div className="user-card-info">
                  <span className="user-card-name">{u.name}</span>
                  <span className="user-card-email">{u.email}</span>
                  <span className="user-card-role">{u.role}</span>
                </div>
                {u._id !== currentUser?._id && (
                  <button onClick={() => setSendTo(u)} className="user-card-action" title="Send notification">
                    <FiSend size={16} />
                  </button>
                )}
                {u._id === currentUser?._id && (
                  <span className="user-card-you">You</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Send Notification Modal */}
        {sendTo && (
          <div className="modal-overlay" onClick={() => setSendTo(null)}>
            <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Send Notification</h2>
                <button onClick={() => setSendTo(null)} className="modal-close"><FiX size={20} /></button>
              </div>
              <p className="modal-subtitle">To: <strong>{sendTo.name}</strong></p>
              <form onSubmit={handleSendNotification}>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={notifForm.type}
                    onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={notifForm.title}
                    onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={notifForm.message}
                    onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                    placeholder="Write your message..."
                    rows={3}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
