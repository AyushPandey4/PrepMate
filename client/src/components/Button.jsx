export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  style = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    fontFamily: 'inherit',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.55 : 1,
    transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '7px 16px',  fontSize: 13, borderRadius: 10 },
    md: { padding: '10px 22px', fontSize: 14, borderRadius: 12 },
    lg: { padding: '13px 30px', fontSize: 15, borderRadius: 14 },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
    },
    secondary: {
      background: '#ffffff',
      color: '#374151',
      border: '1.5px solid #e4e7f0',
      boxShadow: '0 1px 3px rgba(17,24,39,0.06)',
    },
    coral: {
      background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(234,88,12,0.28)',
    },
    ghost: {
      background: 'transparent',
      color: '#6b7280',
      border: '1.5px solid #e4e7f0',
    },
    danger: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1.5px solid #fecaca',
    },
  };

  const combined = { ...base, ...sizes[size], ...variants[variant], ...style };

  function onEnter(e) {
    if (disabled || loading) return;
    const el = e.currentTarget;
    if (variant === 'primary') {
      el.style.transform = 'translateY(-1px)';
      el.style.boxShadow = '0 6px 22px rgba(79,70,229,0.42)';
    } else if (variant === 'coral') {
      el.style.transform = 'translateY(-1px)';
      el.style.boxShadow = '0 6px 22px rgba(234,88,12,0.38)';
    } else if (variant === 'secondary') {
      el.style.transform = 'translateY(-1px)';
      el.style.background = '#f9fafb';
      el.style.borderColor = '#c8cedf';
      el.style.boxShadow = '0 4px 10px rgba(17,24,39,0.1)';
    } else if (variant === 'ghost') {
      el.style.background = '#f3f4f6';
      el.style.color = '#374151';
    }
  }

  function onLeave(e) {
    const el = e.currentTarget;
    el.style.transform = 'translateY(0)';
    if (variant === 'primary')    el.style.boxShadow = '0 4px 14px rgba(79,70,229,0.3)';
    if (variant === 'coral')      el.style.boxShadow = '0 4px 14px rgba(234,88,12,0.28)';
    if (variant === 'secondary') { el.style.background = '#fff'; el.style.borderColor = '#e4e7f0'; el.style.boxShadow = '0 1px 3px rgba(17,24,39,0.06)'; }
    if (variant === 'ghost')     { el.style.background = 'transparent'; el.style.color = '#6b7280'; }
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={combined} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {loading ? (
        <>
          <span style={{
            width: 13, height: 13,
            border: '2px solid rgba(255,255,255,0.35)',
            borderTopColor: variant === 'secondary' ? '#4f46e5' : '#fff',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }}/>
          Loading...
        </>
      ) : children}
    </button>
  );
}
