import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterview, sendMessage, completeInterview } from '../services/api';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import InterviewProgress from '../components/InterviewProgress';
import ChatMessage from '../components/ChatMessage';
import VoiceControls from '../components/VoiceControls';
import Button from '../components/Button';

// Typing indicator 
function ThinkingBubble({ mode }) {
  const isHR = mode === 'hr';
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '10px 14px', borderRadius: '3px 12px 12px 12px',
      background: '#fff', border: '1px solid #e4e7f0',
      width: 'fit-content', marginBottom: 10,
      boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
    }}>
      {[0, 160, 320].map(delay => (
        <span key={delay} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isHR ? '#059669' : '#4f46e5',
          display: 'inline-block',
          animation: `typingBounce 1.2s ${delay}ms infinite ease-in-out`,
        }} />
      ))}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Current Question Card 
function QuestionCard({ question, questionNumber, total, mode, isThinking }) {
  const isHR = mode === 'hr';
  const accentColor = isHR ? '#059669' : '#4f46e5';
  const accentLight = isHR ? '#ecfdf5' : '#eef2ff';
  const accentBorder = isHR ? '#a7f3d0' : '#c7d2fe';
  const gradFrom = isHR ? '#059669' : '#4f46e5';
  const gradTo = isHR ? '#10b981' : '#7c3aed';

  return (
    <div style={{
      flex: 1,
      background: '#fff',
      borderRadius: 24,
      border: `1.5px solid ${accentBorder}`,
      boxShadow: `0 0 0 5px ${accentLight}, 0 12px 32px rgba(17,24,39,0.09)`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeUp 300ms ease both',
    }}>
      {/* Top gradient stripe */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
        flexShrink: 0,
      }} />

      {/* Card body */}
      <div style={{ flex: 1, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Top row: topic badge + Q count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {question?.topic && (
              <span style={{
                padding: '4px 12px', borderRadius: 9999,
                background: accentLight, color: accentColor,
                border: `1.5px solid ${accentBorder}`,
                fontSize: 11.5, fontWeight: 700, textTransform: 'capitalize',
              }}>
                {isHR ? '🤝' : '⚡'} {question.topic}
              </span>
            )}
            {question?.isFollowUp && (
              <span style={{
                padding: '4px 10px', borderRadius: 9999,
                background: '#fefce8', color: '#d97706',
                border: '1.5px solid #fde68a',
                fontSize: 11, fontWeight: 700,
              }}>↩ Follow-up</span>
            )}
          </div>

          <span style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af' }}>
            <span style={{ color: accentColor, fontSize: 18 }}>Q{questionNumber}</span>
            <span style={{ fontSize: 13 }}> / {total}</span>
          </span>
        </div>

        {/* AI Avatar + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            boxShadow: `0 4px 16px rgba(79,70,229,0.3)`,
            animation: isThinking ? 'aiPulse 1.8s infinite ease-in-out' : 'none',
          }}>
            {isHR ? '🤝' : '🤖'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: '#111827' }}>
              {isHR ? 'PrepMate HR Partner' : 'PrepMate Tech Interviewer'}
            </div>
            <div style={{ fontSize: 11.5, color: '#6b7280', marginTop: 1 }}>
              {isThinking ? '✦ Evaluating your response...' : 'AI-Powered Mock Interviewer'}
            </div>
          </div>
          <style>{`
            @keyframes aiPulse {
              0%, 100% { box-shadow: 0 4px 16px rgba(79,70,229,0.3); }
              50% { box-shadow: 0 4px 24px rgba(79,70,229,0.6); transform: scale(1.05); }
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes questionIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* The Question */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isThinking ? (
            <div style={{ paddingTop: 8 }}>
              <ThinkingBubble mode={mode} />
            </div>
          ) : question ? (
            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.6,
              letterSpacing: '-0.02em',
              animation: 'questionIn 400ms ease both',
            }}>
              {question.content || question.message}
            </p>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: 15 }}>
              Preparing your first question…
            </p>
          )}
        </div>

        {/* Hint footer */}
        {!isThinking && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', borderRadius: 10,
            background: '#f7f8fd', border: '1px solid #e4e7f0',
            fontSize: 12, color: '#6b7280',
          }}>
            <span>💡</span>
            <span>
              {isHR
                ? 'Structure your answer using STAR — Situation, Task, Action, Result.'
                : 'Think aloud before answering. Mention trade-offs and edge cases.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page
export default function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const { speak, cancel: cancelSpeech, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis();
  const { isListening, isSupported: micSupported, error: speechError, toggleListening, stopListening } = useSpeechRecognition();

  const textareaRef = useRef(null);
  const transcriptBottomRef = useRef(null);

  // Load interview
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setIsLoading(true); setError(null);
        const data = await getInterview(id);
        if (!isMounted) return;
        const iv = data.interview;
        setInterview(iv);
        setTranscript(iv.transcript || []);
        if (iv.status === 'completed') setIsCompleted(true);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load interview session.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    if (id) load();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (!isLoading && !isSubmitting && !isCompleted) textareaRef.current?.focus();
  }, [isLoading, isSubmitting, isCompleted]);

  useEffect(() => { if (speechError) setError(speechError); }, [speechError]);

  // Auto-scroll right panel transcript
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isSubmitting]);

  // Auto-speak new AI question
  useEffect(() => {
    if (autoSpeak && transcript.length > 0) {
      const last = transcript[transcript.length - 1];
      if (last?.role === 'ai') speak(last.content);
    }
  }, [transcript, autoSpeak, speak]);

  // Handlers
  function handleToggleMic() {
    if (isSpeaking) cancelSpeech();
    toggleListening(({ final }) => {
      if (final) {
        setCurrentAnswer(prev => {
          const t = prev.trim();
          return t ? `${t} ${final.trim()}` : final.trim();
        });
      }
    });
  }

  function handleReplayQuestion() {
    const lastAI = [...transcript].reverse().find(t => t.role === 'ai');
    if (lastAI?.content) speak(lastAI.content);
  }

  async function handleSend() {
    if (isListening) stopListening();
    if (isSpeaking) cancelSpeech();
    const answerText = currentAnswer.trim();
    if (!answerText || isSubmitting || isCompleted) return;

    setError(null);
    setIsSubmitting(true);
    const userTurn = { role: 'user', content: answerText, timestamp: new Date().toISOString() };
    setTranscript(prev => [...prev, userTurn]);
    setCurrentAnswer('');

    try {
      const res = await sendMessage(id, answerText);
      if (res.transcript) {
        setTranscript(res.transcript);
      } else if (res.question) {
        setTranscript(prev => [...prev, {
          role: 'ai',
          content: res.question.message,
          topic: res.question.topic || 'general',
          isFollowUp: Boolean(res.question.isFollowUp),
          timestamp: new Date().toISOString(),
        }]);
      }
      if (interview) {
        setInterview(prev => ({ ...prev, question_count: res.questionCount || prev.question_count + 1 }));
      }
      if (res.isComplete || res.shouldContinue === false) setIsCompleted(true);
    } catch (err) {
      setError(err.message || 'Failed to send answer. Please try again.');
      setCurrentAnswer(answerText);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSend(); }
  }

  async function handleConfirmEnd() {
    if (isListening) stopListening();
    if (isSpeaking) cancelSpeech();
    try {
      setIsEnding(true);
      await completeInterview(id);
      setShowEndModal(false);
      setIsCompleted(true);
    } catch (err) {
      setError(err.message || 'Failed to end interview.');
      setIsEnding(false);
    }
  }

  // Derived
  const currentCount = interview?.question_count || 1;
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  const isHR = interview?.mode === 'hr';

  // The current (latest AI) question for the left panel
  const latestAI = [...transcript].reverse().find(m => m.role === 'ai');

  // Loading
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f7f8fd',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, animation: 'spin 1s linear infinite',
        }}>🤖</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 600 }}>Preparing your interview arena…</p>
      </div>
    );
  }

  // Error (no interview loaded)
  if (error && !interview) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f7f8fd',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          maxWidth: 480, background: '#fff', borderRadius: 20, padding: 36, textAlign: 'center',
          border: '1.5px solid #fca5a5', boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Unable to Load Interview</h2>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 24px', borderRadius: 9999,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 700, fontSize: 14, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // Completed screen
  if (isCompleted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f8fd', fontFamily: 'var(--font)' }}>
        <InterviewProgress
          current={currentCount} total={15}
          role={interview?.target_role} company={interview?.target_company}
          mode={interview?.mode} onEndInterview={() => {}} isEnding={false}
        />
        <div style={{
          maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 28, padding: '48px 40px',
            border: '1.5px solid #a7f3d0', boxShadow: '0 0 0 6px #ecfdf5, 0 20px 40px rgba(5,150,105,0.1)',
            animation: 'fadeUp 400ms ease both',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em',
              color: '#111827', marginBottom: 10,
            }}>
              Interview Complete!
            </h2>
            <p style={{ color: '#6b7280', fontSize: 15.5, lineHeight: 1.6, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              Great work! All your responses have been recorded.
              Your personalized feedback report is now ready — let's see how you did.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/feedback/${id}`)}
                style={{
                  padding: '12px 28px', borderRadius: 9999,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff', fontWeight: 700, fontSize: 14.5, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
                }}
              >
                View Feedback Report →
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '12px 24px', borderRadius: 9999,
                  background: '#f7f8fd', color: '#374151',
                  fontWeight: 600, fontSize: 14, border: '1.5px solid #e4e7f0',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); }}`}</style>
      </div>
    );
  }

  // Main Interview Room
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#f7f8fd', fontFamily: 'var(--font)',
      overflow: 'hidden',
    }}>
      {/* Top header */}
      <InterviewProgress
        current={currentCount} total={15}
        role={interview?.target_role} company={interview?.target_company}
        mode={interview?.mode}
        onEndInterview={() => setShowEndModal(true)}
        isEnding={isEnding}
      />

      {/* Error banner */}
      {error && (
        <div style={{
          padding: '10px 24px', background: '#fef2f2',
          borderBottom: '1px solid #fca5a5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 13, color: '#dc2626', fontWeight: 600,
        }}>
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} style={{
            background: 'none', border: 'none', color: '#dc2626',
            cursor: 'pointer', fontWeight: 800, fontSize: 16, lineHeight: 1,
          }}>✕</button>
        </div>
      )}

      {/* Split layout */}
      <div style={{
        flex: 1, display: 'flex', overflow: 'hidden',
        maxWidth: 1260, width: '100%', margin: '0 auto',
        padding: '20px 20px 20px',
        gap: 20,
      }}>

        {/* LEFT PANEL: Current Question */}
        <div style={{
          flex: '0 0 55%', display: 'flex', flexDirection: 'column',
          minWidth: 0,
        }}>
          <QuestionCard
            question={latestAI}
            questionNumber={currentCount}
            total={15}
            mode={interview?.mode || 'technical'}
            isThinking={isSubmitting}
          />
        </div>

        {/* RIGHT PANEL: History + Input */}
        <div style={{
          flex: '0 0 calc(45% - 20px)', display: 'flex', flexDirection: 'column',
          minWidth: 0, gap: 12,
        }}>

          {/* Mini transcript history */}
          <div style={{
            flex: 1, overflowY: 'auto',
            background: '#fff', borderRadius: 18,
            border: '1.5px solid #e4e7f0',
            boxShadow: '0 4px 16px rgba(17,24,39,0.06)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 18px 10px',
              borderBottom: '1px solid #f1f3fa',
              fontWeight: 700, fontSize: 12, color: '#9ca3af',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#4f46e5', display: 'inline-block',
              }} />
              Conversation History
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {transcript.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', gap: 8, color: '#9ca3af',
                  padding: 24, textAlign: 'center',
                }}>
                  <span style={{ fontSize: 32 }}>{isHR ? '🤝' : '⚡'}</span>
                  <span style={{ fontSize: 13 }}>Your conversation will appear here</span>
                </div>
              ) : (
                transcript.map((msg, i) => (
                  <ChatMessage key={i} message={msg} mode={interview?.mode} />
                ))
              )}
              {isSubmitting && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 32, marginTop: 4 }}>
                  <ThinkingBubble mode={interview?.mode} />
                </div>
              )}
              <div ref={transcriptBottomRef} style={{ height: 1 }} />
            </div>
          </div>

          {/* Answer input card */}
          <div style={{
            background: '#fff', borderRadius: 18,
            border: '1.5px solid #e4e7f0',
            boxShadow: '0 4px 16px rgba(17,24,39,0.06)',
            padding: '16px 18px',
            flexShrink: 0,
          }}>
            {/* Label + voice controls row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 10, gap: 8, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Answer
              </span>
              <VoiceControls
                isListening={isListening}
                onToggleMic={handleToggleMic}
                micSupported={micSupported}
                autoSpeak={autoSpeak}
                onToggleAutoSpeak={() => {
                  const next = !autoSpeak;
                  setAutoSpeak(next);
                  if (!next) cancelSpeech();
                }}
                isSpeaking={isSpeaking}
                onReplayQuestion={handleReplayQuestion}
                ttsSupported={ttsSupported}
              />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting || isCompleted}
              placeholder={
                isHR
                  ? 'Share your experience using STAR…  (Ctrl+Enter to submit)'
                  : 'Type your technical answer… Think aloud!  (Ctrl+Enter to submit)'
              }
              rows={4}
              style={{
                width: '100%', background: '#f7f8fd',
                border: '1.5px solid #e4e7f0', outline: 'none',
                borderRadius: 12, padding: '12px 14px',
                color: '#111827', fontSize: 14, lineHeight: 1.6,
                resize: 'none', fontFamily: 'inherit',
                transition: 'border-color 150ms ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e4e7f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />

            {/* Bottom strip */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 10, flexWrap: 'wrap', gap: 10,
            }}>
              <span style={{ fontSize: 11.5, color: '#9ca3af', fontWeight: 500 }}>
                {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'Start typing…'}
                {wordCount > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 11, padding: '2px 8px', borderRadius: 9999,
                    background: wordCount >= 30 ? '#ecfdf5' : '#fefce8',
                    color: wordCount >= 30 ? '#059669' : '#d97706',
                    border: `1px solid ${wordCount >= 30 ? '#a7f3d0' : '#fde68a'}`,
                    fontWeight: 600,
                  }}>
                    {wordCount < 20 ? 'Too short' : wordCount < 30 ? 'Good start' : 'Great length ✓'}
                  </span>
                )}
              </span>

              <button
                onClick={handleSend}
                disabled={!currentAnswer.trim() || isSubmitting || isCompleted}
                style={{
                  padding: '9px 22px', borderRadius: 9999,
                  background: (!currentAnswer.trim() || isSubmitting)
                    ? '#e4e7f0'
                    : 'linear-gradient(135deg, #ea580c, #f97316)',
                  color: (!currentAnswer.trim() || isSubmitting) ? '#9ca3af' : '#fff',
                  fontWeight: 700, fontSize: 13.5, border: 'none',
                  cursor: (!currentAnswer.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 150ms ease',
                  boxShadow: (currentAnswer.trim() && !isSubmitting)
                    ? '0 4px 14px rgba(234,88,12,0.35)' : 'none',
                }}
              >
                {isSubmitting ? 'Sending…' : 'Send Answer →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* End Interview Modal */}
      {showEndModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: '36px 32px', textAlign: 'center',
            maxWidth: 440, width: '100%',
            border: '1.5px solid #fca5a5',
            boxShadow: '0 0 0 6px rgba(239,68,68,0.08), 0 24px 48px rgba(17,24,39,0.18)',
            animation: 'fadeUp 250ms ease both',
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: 18,
              background: '#fef2f2', border: '1.5px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.12)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8, letterSpacing: '-0.02em' }}>
              End Interview Early?
            </h3>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              All questions and answers recorded so far will be saved, and you'll still be able to view your feedback report.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowEndModal(false)}
                disabled={isEnding}
                style={{
                  padding: '10px 22px', borderRadius: 9999,
                  background: '#f7f8fd', color: '#374151',
                  fontWeight: 600, fontSize: 14, border: '1.5px solid #e4e7f0',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Keep Going</button>
              <button
                onClick={handleConfirmEnd}
                disabled={isEnding}
                style={{
                  padding: '10px 22px', borderRadius: 9999,
                  background: '#ef4444', color: '#fff',
                  fontWeight: 700, fontSize: 14, border: 'none',
                  cursor: isEnding ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', opacity: isEnding ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
                }}
              >{isEnding ? 'Ending…' : 'Yes, End Session'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
