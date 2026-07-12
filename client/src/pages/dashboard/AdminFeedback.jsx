import { useState, useEffect } from 'react';
import { MessageSquare, Star, Reply, Building2 } from 'lucide-react';
import { feedbackAPI } from '../../services/api';
import { formatDate, getStarArray } from '../../utils/helpers';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const AdminFeedback = () => {
  const { addNotification } = useNotification();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await feedbackAPI.getByTemple('all', { limit: 50 });
        setFeedbacks(res.data.data || []);
      } catch { setFeedbacks([]); }
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  const handleReply = async (id) => {
    try {
      await feedbackAPI.reply(id, { reply: replyText });
      setFeedbacks((prev) => prev.map((f) => f._id === id ? { ...f, reply: replyText } : f));
      addNotification('Reply sent!', 'success');
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to reply', 'error');
    }
  };

  if (loading) return <Loader fullPage text="Loading feedback..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          <span className="gradient-text">Feedback</span> Management
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Review and respond to user feedback</p>
      </div>

      {feedbacks.length === 0 ? (
        <EmptyState icon="💬" title="No feedback yet" message="User feedback will appear here." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {feedbacks.map((fb) => (
            <div key={fb._id} style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)', border: '1px solid var(--border-light)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <h6 style={{ margin: 0 }}>{fb.subject || 'Feedback'}</h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 4, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    <span>{fb.user?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <Building2 size={12} /> {fb.temple?.name || 'Temple'}
                    <span>•</span>
                    {formatDate(fb.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {getStarArray(fb.rating).map((s, i) => (
                    <Star key={i} size={14} fill={s === 'full' ? 'var(--soft-gold)' : 'transparent'} stroke={s === 'empty' ? 'var(--border-color)' : 'var(--soft-gold)'} />
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>{fb.message}</p>

              {fb.reply ? (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--saffron)',
                }}>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--saffron)', fontWeight: 'var(--fw-semibold)', marginBottom: 4 }}>Your Reply</div>
                  <p style={{ fontSize: 'var(--fs-sm)', margin: 0, color: 'var(--text-secondary)' }}>{fb.reply}</p>
                </div>
              ) : replyingTo === fb._id ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'start' }}>
                  <textarea className="form-control" rows={2} placeholder="Write your reply..."
                    value={replyText} onChange={(e) => setReplyText(e.target.value)} style={{ flex: 1 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <button className="btn btn-primary" onClick={() => handleReply(fb._id)}
                      style={{ padding: '8px 16px', fontSize: 'var(--fs-sm)' }}>Send</button>
                    <button className="btn btn-ghost" onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      style={{ padding: '8px 16px', fontSize: 'var(--fs-sm)' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-ghost" onClick={() => setReplyingTo(fb._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-sm)' }}
                >
                  <Reply size={14} /> Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
