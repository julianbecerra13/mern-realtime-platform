import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiAlertCircle, FiInfo, FiAlertTriangle, FiInbox } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import './Notifications.css';

const typeConfig = {
  info: { icon: <FiInfo />, className: 'info' },
  success: { icon: <FiCheckCircle />, className: 'success' },
  warning: { icon: <FiAlertTriangle />, className: 'warning' },
  error: { icon: <FiAlertCircle />, className: 'error' },
  system: { icon: <FiBell />, className: 'system' },
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
    <div className="notif-page">
      <div className="container">
        <div className="notif-header animate-fade-up">
          <div className="notif-header-left">
            <h1>Notifications</h1>
            <span className="notif-count">{unreadCount} unread</span>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-secondary">
              <FiCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty animate-fade-up">
              <div className="empty-icon-wrap">
                <FiInbox size={40} />
              </div>
              <h3>All caught up</h3>
              <p>No notifications to show right now</p>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const config = typeConfig[notif.type] || typeConfig.info;
              return (
                <div
                  key={notif._id}
                  className={`notif-item ${notif.read ? 'read' : 'unread'} animate-fade-up`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className={`notif-icon-wrap ${config.className}`}>
                    {config.icon}
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-meta">
                      {notif.sender && <span className="notif-sender">{notif.sender.name}</span>}
                      <span className="notif-time">{formatTime(notif.createdAt)}</span>
                    </div>
                  </div>
                  <div className="notif-actions">
                    {!notif.read && (
                      <button onClick={() => markAsRead(notif._id)} className="notif-action-btn" title="Mark as read">
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notif._id)} className="notif-action-btn delete" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="notif-pagination">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchNotifications(i + 1)}
                className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
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
