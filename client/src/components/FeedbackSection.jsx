export default function FeedbackSection({
  title = 'Section',
  items = [],
  icon = '💡',
  accentColor = '#4f46e5',
  subtitle = null,
}) {
  if (!items || items.length === 0) return null;

  const isEmerald = accentColor === '#059669' || accentColor === '#10b981';
  const isAmber = accentColor === '#d97706' || accentColor === '#f59e0b' || accentColor === '#ea580c';

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 22,
        border: '1.5px solid #e4e7f0',
        boxShadow: '0 4px 20px rgba(17, 24, 39, 0.05), 0 1px 3px rgba(17, 24, 39, 0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeUp 350ms ease both',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '22px 24px 18px',
          borderBottom: '1.5px solid #f1f3fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `${accentColor}12`,
              border: `1.5px solid ${accentColor}28`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          <div>
            <h3
              style={{
                fontSize: 16.5,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: 12.5, color: '#6b7280', marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Count Badge */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 11px',
            borderRadius: 9999,
            background: `${accentColor}10`,
            color: accentColor,
            border: `1px solid ${accentColor}25`,
            flexShrink: 0,
          }}
        >
          {items.length} {items.length === 1 ? 'Point' : 'Points'}
        </span>
      </div>

      {/* List of points */}
      <div
        style={{
          padding: '18px 24px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 14,
              background: '#fcfdfe',
              border: '1px solid #edf0f8',
              transition: 'all 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${accentColor}06`;
              e.currentTarget.style.borderColor = `${accentColor}30`;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fcfdfe';
              e.currentTarget.style.borderColor = '#edf0f8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Custom Icon Pill */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isEmerald ? '#ecfdf5' : isAmber ? '#fefce8' : '#eef2ff',
                color: accentColor,
                border: `1.5px solid ${accentColor}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isEmerald || isAmber ? 12 : 11,
                fontWeight: 800,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {isEmerald ? '✓' : isAmber ? '!' : index + 1}
            </div>

            {/* Text */}
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: '#374151',
                flex: 1,
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
