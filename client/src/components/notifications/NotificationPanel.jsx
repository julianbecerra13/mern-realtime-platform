import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import './Notifications.css';

const typeIcons = {
  info: <FiInfo className="notif-icon info" />,
  success: <FiCheckCircle className="notif-icon success" />,
  warning: <FiAlertTriangle className="notif-icon warning" />,
  error: <FiAlertCircle className="notif-icon error" />,
  system: <FiBell className="notif-icon system" />,
};

const NotificationPanel = () => {
  const { notifications, unreadCount, pagination, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-secondary">
              <FiCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <FiBell size={48} />
              <h3>No notifications yet</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
                <div className="notification-icon-wrap">
                  {typeIcons[notif.type] || typeIcons.info}
                </div>
                <div className="notification-body">
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-meta">
                    {notif.sender && <span>{notif.sender.name}</span>}
                    <span>{formatTime(notif.createdAt)}</span>
                  </div>
                </div>
                <div className="notification-actions">
                  {!notif.read && (
                    <button onClick={() => markAsRead(notif._id)} className="action-btn" title="Mark as read">
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif._id)} className="action-btn delete" title="Delete">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchNotifications(i + 1)}
                className={`pagination-btn ${pagination.page === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
