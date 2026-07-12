import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, message, action, onAction, actionText, actionLink, image }) => {
  const displayMessage = description || message;
  const handleAction = action || onAction;

  return (
    <div className="empty-state animate-fade-in-up">
      {image ? (
        <img
          src={image}
          alt={title}
          style={{
            width: 200,
            height: 200,
            objectFit: 'contain',
            margin: '0 auto var(--space-5)',
            opacity: 0.6,
          }}
        />
      ) : typeof Icon === 'string' ? (
        <div className="empty-state-icon">{Icon}</div>
      ) : Icon ? (
        <div className="empty-state-icon">
          <Icon size={64} strokeWidth={1} color="var(--text-muted)" />
        </div>
      ) : (
        <div className="empty-state-icon">🙏</div>
      )}
      <h4>{title}</h4>
      <p>{displayMessage}</p>
      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
      {handleAction && actionText && !actionLink && (
        <button className="btn btn-primary" onClick={handleAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
