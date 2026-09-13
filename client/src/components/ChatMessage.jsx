export default function ChatMessage({ message, mode = 'technical' }) {
  const isAI = message.role === 'ai';
  const isHR = mode === 'hr';

  return (
    <div style={{
      marginBottom: 10,
      display: 'flex',
      flexDirection: isAI ? 'row' : 'row-reverse',
      gap: 8,
      alignItems: 'flex-start',
    }}>
      {/* Avatar dot */}
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: isAI
          ? (isHR ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)')
          : '#e0e7ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, color: isAI ? '#fff' : '#4f46e5', fontWeight: 700,
      }}>
        {isAI ? (isHR ? '🤝' : '🤖') : 'Y'}
      </div>

      <div style={{ maxWidth: '80%' }}>
        {/* Topic badge */}
        {isAI && message.topic && (
          <div style={{
            fontSize: 10, fontWeight: 700, color: isHR ? '#059669' : '#4f46e5',
            marginBottom: 3, textTransform: 'capitalize',
          }}>
            {message.isFollowUp ? '↩ Follow-up · ' : ''}{message.topic}
          </div>
        )}

        {/* Bubble */}
        <div style={{
          padding: '8px 12px',
          borderRadius: isAI ? '3px 12px 12px 12px' : '12px 3px 12px 12px',
          background: isAI ? '#fff' : (isHR ? '#ecfdf5' : '#eef2ff'),
          border: `1px solid ${isAI ? '#e4e7f0' : (isHR ? '#a7f3d0' : '#c7d2fe')}`,
          color: '#374151',
          fontSize: 12.5,
          lineHeight: 1.55,
          wordBreak: 'break-word',
        }}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
