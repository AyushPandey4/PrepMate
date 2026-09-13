export default function ScoreCard({ overallScore = 0, scores = {}, mode = 'technical' }) {
  const isTechnical = mode === 'technical';

  const getScoreMeta = (score) => {
    if (score >= 85) {
      return {
        color: '#059669',
        gradient: 'linear-gradient(135deg, #059669, #10b981)',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        label: 'Excellent',
        emoji: '🏆',
        benchmark: 'Exceeds hiring bar',
      };
    }
    if (score >= 70) {
      return {
        color: '#4f46e5',
        gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        bg: '#eef2ff',
        border: '#c7d2fe',
        label: 'Proficient',
        emoji: '⭐',
        benchmark: 'Meets candidate target',
      };
    }
    if (score >= 55) {
      return {
        color: '#d97706',
        gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
        bg: '#fefce8',
        border: '#fde68a',
        label: 'Developing',
        emoji: '📈',
        benchmark: 'Near target with polish',
      };
    }
    return {
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626, #f87171)',
      bg: '#fef2f2',
      border: '#fca5a5',
      label: 'Needs Work',
      emoji: '💪',
      benchmark: 'Targeted revision required',
    };
  };

  const overallMeta = getScoreMeta(overallScore);

  const subScores = [
    {
      label: isTechnical ? 'Technical Depth & Accuracy' : 'Behavioral & Situational Depth',
      value: scores.technicalOrBehavioralDepth ?? scores.technicalDepth ?? 75,
      emoji: isTechnical ? '⚡' : '🤝',
      color: '#4f46e5',
      lightBg: '#eef2ff',
    },
    {
      label: 'Problem Solving & Logic',
      value: scores.problemSolving ?? 75,
      emoji: '🧩',
      color: '#059669',
      lightBg: '#ecfdf5',
    },
    {
      label: 'Communication & Articulation',
      value: scores.communication ?? 75,
      emoji: '💬',
      color: '#0284c7',
      lightBg: '#f0f9ff',
    },
    {
      label: 'Role & Culture Alignment',
      value: scores.roleFit ?? 75,
      emoji: '🎯',
      color: '#d97706',
      lightBg: '#fefce8',
    },
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 24,
        border: '1.5px solid #e4e7f0',
        boxShadow: '0 8px 30px rgba(17, 24, 39, 0.05), 0 2px 6px rgba(17, 24, 39, 0.02)',
        overflow: 'hidden',
        animation: 'fadeUp 350ms ease both',
      }}
    >
      {/* Colorful top gradient stripe */}
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg, ${overallMeta.color} 0%, #6366f1 50%, ${isTechnical ? '#7c3aed' : '#10b981'} 100%)`,
        }}
      />

      <div
        style={{
          padding: '32px 36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          alignItems: 'center',
        }}
      >
        {/* Left: Overall Score Radial Ring & Verdict */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 16,
          }}
        >
          {/* Circular Score Gauge */}
          <div
            style={{
              position: 'relative',
              width: 156,
              height: 156,
              borderRadius: '50%',
              background: `radial-gradient(closest-side, #ffffff 75%, transparent 77% 100%), conic-gradient(${overallMeta.color} ${overallScore}%, #f1f3fa 0)`,
              boxShadow: `0 0 0 8px ${overallMeta.bg}, 0 8px 26px ${overallMeta.color}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: '#111827',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {overallScore}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  fontWeight: 800,
                  marginTop: 4,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Score / 100
              </span>
            </div>
          </div>

          {/* Verdict Pill & Benchmark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                padding: '6px 18px',
                borderRadius: 9999,
                background: overallMeta.bg,
                color: overallMeta.color,
                border: `1.5px solid ${overallMeta.border}`,
                fontSize: 13.5,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(17, 24, 39, 0.04)',
              }}
            >
              <span>{overallMeta.emoji}</span>
              <span>{overallMeta.label}</span>
            </span>

            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
              {overallMeta.benchmark}
            </span>
          </div>
        </div>

        {/* Right: Competency Breakdown Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#9ca3af',
              }}
            >
              Competency Breakdown
            </h4>
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
              4 Dimensions Assessed
            </span>
          </div>

          {subScores.map(({ label, value, emoji, color, lightBg }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: lightBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </span>
                  {label}
                </span>

                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: color,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {value}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div
                style={{
                  width: '100%',
                  height: 9,
                  borderRadius: 999,
                  background: '#f1f3fa',
                  overflow: 'hidden',
                  padding: 1.5,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(Math.max(value, 0), 100)}%`,
                    background: color,
                    borderRadius: 999,
                    transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
