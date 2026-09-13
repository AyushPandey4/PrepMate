export default function InterviewProgress({
  current = 1,
  total = 15,
  role = 'Software Engineer',
  company = 'Target Company',
  mode = 'technical',
  onEndInterview,
  isEnding = false,
}) {
  const isTechnical = mode === 'technical';
  const dots = Array.from({ length: total }, (_, i) => i < current);

  return (
    <header style={{
      borderBottom: '1px solid #e4e7f0',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(17,24,39,0.06)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>

        {/* Left: Logo + mode + role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/prepmate_logo.png"
              alt="PrepMate Logo"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                objectFit: 'cover',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              }}
            />
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', color: '#111827' }}>
              Prep<span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mate</span>
            </span>
          </div>

          <div style={{ width: 1, height: 20, background: '#e4e7f0' }} />

          {/* Mode pill */}
          <span style={{
            fontSize: 11.5, fontWeight: 700,
            padding: '3px 10px', borderRadius: 9999,
            background: isTechnical ? '#eef2ff' : '#ecfdf5',
            color: isTechnical ? '#4338ca' : '#059669',
            border: `1.5px solid ${isTechnical ? '#c7d2fe' : '#a7f3d0'}`,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {isTechnical ? '⚡' : '🤝'} {isTechnical ? 'Technical' : 'Behavioural'}
          </span>

          {/* Role & company */}
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
            <strong style={{ color: '#111827', fontWeight: 700 }}>{role}</strong>
            <span style={{ margin: '0 4px', color: '#9ca3af' }}>at</span>
            <span style={{ color: '#4f46e5', fontWeight: 600 }}>{company}</span>
          </span>
        </div>

        {/* Center: Progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {dots.map((filled, i) => (
            <div
              key={i}
              title={`Question ${i + 1}`}
              style={{
                width: filled ? 10 : 8,
                height: filled ? 10 : 8,
                borderRadius: '50%',
                background: filled
                  ? isTechnical ? '#4f46e5' : '#059669'
                  : '#e4e7f0',
                border: filled
                  ? `2px solid ${isTechnical ? '#4f46e5' : '#059669'}`
                  : '2px solid #d1d5db',
                transition: 'all 250ms ease',
                boxShadow: filled ? `0 0 6px ${isTechnical ? 'rgba(79,70,229,0.5)' : 'rgba(5,150,105,0.4)'}` : 'none',
              }}
            />
          ))}
          <span style={{
            fontSize: 12, fontWeight: 600, color: '#9ca3af',
            marginLeft: 4,
          }}>{current}/{total}</span>
        </div>

        {/* Right: End button */}
        <button
          onClick={onEndInterview}
          disabled={isEnding}
          style={{
            padding: '7px 16px', borderRadius: 9999,
            background: isEnding ? '#fca5a5' : '#ef4444',
            color: '#fff', fontWeight: 700, fontSize: 12.5,
            border: 'none', cursor: isEnding ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', letterSpacing: '0.01em',
            transition: 'all 150ms ease',
            boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { if (!isEnding) e.currentTarget.style.background = '#dc2626'; }}
          onMouseLeave={e => { if (!isEnding) e.currentTarget.style.background = '#ef4444'; }}
        >
          {isEnding ? (
            'Ending…'
          ) : (
            '⏹ End Session'
          )}
        </button>
      </div>
    </header>
  );
}
