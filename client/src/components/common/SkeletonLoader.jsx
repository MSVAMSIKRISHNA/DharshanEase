const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderCard = (key) => (
    <div key={key} className="skeleton-card animate-pulse" style={{ marginBottom: 'var(--space-4)' }}>
      <div className="skeleton skeleton-img" style={{ marginBottom: 'var(--space-4)' }} />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
        <div className="skeleton" style={{ width: '80px', height: '28px' }} />
        <div className="skeleton" style={{ width: '60px', height: '28px' }} />
      </div>
    </div>
  );

  const renderRow = (key) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-light)' }}>
      <div className="skeleton skeleton-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '10px' }} />
      </div>
      <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: 'var(--radius-full)' }} />
    </div>
  );

  const renderText = (key) => (
    <div key={key} style={{ marginBottom: 'var(--space-4)' }}>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" style={{ width: '100%' }} />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
      <div className="skeleton skeleton-text" style={{ width: '75%' }} />
    </div>
  );

  const renderStats = (key) => (
    <div key={key} className="skeleton-card animate-pulse" style={{ padding: 'var(--space-5)' }}>
      <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' }} />
      <div className="skeleton" style={{ width: '60%', height: '28px', marginBottom: 'var(--space-2)' }} />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
    </div>
  );

  const renderers = { card: renderCard, row: renderRow, text: renderText, stats: renderStats };
  const render = renderers[type] || renderCard;

  return <>{items.map((i) => render(i))}</>;
};

export default SkeletonLoader;
