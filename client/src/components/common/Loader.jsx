const Loader = ({ size = 'md', text = '', fullPage = false }) => {
  const sizeMap = {
    sm: { spinner: 24, border: 3 },
    md: { spinner: 40, border: 4 },
    lg: { spinner: 56, border: 5 },
  };

  const { spinner, border } = sizeMap[size] || sizeMap.md;

  const spinnerStyle = {
    width: spinner,
    height: spinner,
    border: `${border}px solid var(--border-color)`,
    borderTopColor: 'var(--saffron)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 'var(--space-4)',
        }}
      >
        <div style={spinnerStyle} />
        {text && (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-5)',
      }}
    >
      <div style={spinnerStyle} />
      {text && (
        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>{text}</span>
      )}
    </div>
  );
};

export default Loader;
