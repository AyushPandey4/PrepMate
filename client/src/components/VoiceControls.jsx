export default function VoiceControls({
  isListening,
  onToggleMic,
  micSupported,
  autoSpeak,
  onToggleAutoSpeak,
  isSpeaking,
  onReplayQuestion,
  ttsSupported,
}) {
  const iconBtn = (onClick, disabled, title, children, active) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 5, padding: '6px 12px', borderRadius: 9999,
        fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, transition: 'all 180ms ease',
        fontFamily: 'inherit',
        background: active ? '#eef2ff' : '#f7f8fd',
        color: active ? '#4338ca' : '#6b7280',
        border: active ? '1.5px solid #c7d2fe' : '1.5px solid #e4e7f0',
        boxShadow: active ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
      }}
      onMouseEnter={e => { if (!disabled && !active) { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#4f46e5'; }}}
      onMouseLeave={e => { if (!disabled && !active) { e.currentTarget.style.borderColor = '#e4e7f0'; e.currentTarget.style.color = '#6b7280'; }}}
    >
      {children}
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

      {/* Mic / Dictate */}
      <button
        type="button"
        onClick={onToggleMic}
        disabled={!micSupported}
        title={
          !micSupported
            ? 'Speech recognition not supported (use Chrome/Edge)'
            : isListening ? 'Stop recording' : 'Dictate answer'
        }
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 9999,
          fontSize: 12, fontWeight: 700, cursor: micSupported ? 'pointer' : 'not-allowed',
          opacity: micSupported ? 1 : 0.45, transition: 'all 200ms ease',
          fontFamily: 'inherit',
          background: isListening ? '#fef2f2' : '#f7f8fd',
          color: isListening ? '#dc2626' : '#6b7280',
          border: isListening ? '1.5px solid #fca5a5' : '1.5px solid #e4e7f0',
          boxShadow: isListening ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
        }}
      >
        {isListening ? (
          <>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
              display: 'inline-block', animation: 'pulseMic 1s infinite alternate ease-in-out',
            }} />
            <style>{`@keyframes pulseMic { from { opacity: 0.5; transform: scale(0.8); } to { opacity: 1; transform: scale(1.3); } }`}</style>
            Stop
          </>
        ) : (
          <>🎙️ Dictate</>
        )}
      </button>

      {/* TTS Toggle */}
      {ttsSupported && iconBtn(
        onToggleAutoSpeak,
        false,
        autoSpeak ? 'Mute AI voice' : 'Enable AI voice readout',
        <>{autoSpeak ? '🔊' : '🔇'} {autoSpeak ? 'Voice On' : 'Voice Off'}</>,
        autoSpeak
      )}

      {/* Replay */}
      {ttsSupported && onReplayQuestion && iconBtn(
        onReplayQuestion,
        isSpeaking,
        'Replay current question',
        <>{isSpeaking ? '💬 Speaking…' : '🔁 Replay'}</>,
        false
      )}
    </div>
  );
}
