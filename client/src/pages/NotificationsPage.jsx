import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { getRelativeTime } from '../utils/helpers';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await notificationAPI.getAll();
        setNotifications(res.data.data || []);
      } catch { setNotifications([]); }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch { /* */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* */ }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    const icons = {
      booking: '🎫', payment: '💰', cancellation: '❌', reminder: '⏰',
      promotion: '🎉', system: '⚙️',
    };
    return icons[type] || '🔔';
  };

  if (loading) return <Loader fullPage text="Loading notifications..." />;

  return (
    <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            <span className="gradient-text">Notifications</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost" onClick={handleMarkAllRead}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          message="You're all caught up! We'll notify you about bookings, payments, and updates."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              style={{
                display: 'flex', alignItems: 'start', gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                background: notif.read ? 'var(--bg-card)' : 'rgba(var(--saffron-rgb),0.04)',
                border: `1px solid ${notif.read ? 'var(--border-light)' : 'rgba(var(--saffron-rgb),0.15)'}`,
                transition: 'all var(--transition-base)',
                cursor: notif.read ? 'default' : 'pointer',
              }}
              onClick={() => !notif.read && handleMarkRead(notif._id)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-lg)', flexShrink: 0,
                background: notif.read
                  ? 'var(--bg-secondary)'
                  : 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.12), rgba(var(--deep-maroon-rgb),0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'var(--space-2)' }}>
                  <h6 style={{
                    margin: 0, fontSize: 'var(--fs-base)',
                    fontWeight: notif.read ? 'var(--fw-medium)' : 'var(--fw-semibold)',
                  }}>
                    {notif.title}
                  </h6>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {getRelativeTime(notif.createdAt)}
                  </span>
                </div>
                <p style={{
                  margin: '4px 0 0', fontSize: 'var(--fs-sm)',
                  color: 'var(--text-muted)', lineHeight: 1.5,
                }}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div style={{
                  width: 8, height: 8, borderRadius: 'var(--radius-full)',
                  background: 'var(--saffron)', flexShrink: 0, marginTop: 8,
                }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
