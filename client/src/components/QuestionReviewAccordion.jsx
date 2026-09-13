import { useState } from 'react';

export default function QuestionReviewAccordion({
  questionFeedback = [],
  transcript = [],
  mode = 'technical',
}) {
  const isHR = mode === 'hr';

  // Track expanded state for all items
  const [expandedIndices, setExpandedIndices] = useState(() => {
    // Expand first two by default
    const init = {};
    questionFeedback.forEach((_, i) => {
      init[i] = i < 2;
    });
    return init;
  });

  // Filter state: 'all' | 'high' (>=8) | 'growth' (<8)
  const [filter, setFilter] = useState('all');

  if (!questionFeedback || questionFeedback.length === 0) {
    return null;
  }

  // Correlate transcript metadata (topics, followups) if available
  const getQuestionTopic = (index) => {
    if (!Array.isArray(transcript)) return null;
    let aiCount = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].role === 'ai') {
        if (aiCount === index) {
          return transcript[i].topic || null;
        }
        aiCount++;
      }
    }
    return null;
  };

  const toggleIndex = (index) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const all = {};
    questionFeedback.forEach((_, i) => {
      all[i] = true;
    });
    setExpandedIndices(all);
  };

  const collapseAll = () => {
    const none = {};
    questionFeedback.forEach((_, i) => {
      none[i] = false;
    });
    setExpandedIndices(none);
  };

  const getScoreMeta = (score) => {
    if (score >= 8) {
      return {
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        label: 'Strong',
        emoji: '✓',
      };
    }
    if (score >= 6) {
      return {
        color: '#4f46e5',
        bg: '#eef2ff',
        border: '#c7d2fe',
        label: 'Proficient',
        emoji: '⭐',
      };
    }
    if (score >= 4) {
      return {
        color: '#d97706',
        bg: '#fefce8',
        border: '#fde68a',
        label: 'Developing',
        emoji: '▲',
      };
    }
    return {
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fca5a5',
      label: 'Needs Work',
      emoji: '!',
    };
  };

  // Filter questions
  const filteredFeedback = questionFeedback.map((item, originalIndex) => ({
    ...item,
    originalIndex,
    topic: getQuestionTopic(originalIndex),
  })).filter((q) => {
    if (filter === 'high') return q.score >= 8;
    if (filter === 'growth') return q.score < 8;
    return true;
  });

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 24,
        border: '1.5px solid #e4e7f0',
        boxShadow: '0 8px 30px rgba(17, 24, 39, 0.05), 0 2px 6px rgba(17, 24, 39, 0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeUp 350ms ease both',
      }}
    >
      {/* ─── Top Control Header ─── */}
      <div
        style={{
          padding: '24px 28px 20px',
          borderBottom: '1.5px solid #f1f3fa',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                  border: '1.5px solid #c7d2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                💬
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Interactive Q&A & Transcript Breakdown
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  Explore conversation turns with interviewer prompts, your recorded response, and AI hiring feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Expand / Collapse Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              onClick={expandAll}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter Pills & Question Jump Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 12,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: `All (${questionFeedback.length})` },
              {
                key: 'high',
                label: `⭐ High Score (${questionFeedback.filter((q) => q.score >= 8).length})`,
              },
              {
                key: 'growth',
                label: `📈 Focus Areas (${questionFeedback.filter((q) => q.score < 8).length})`,
              },
            ].map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 9999,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: active ? '#4f46e5' : '#f1f3fa',
                    color: active ? '#ffffff' : '#4b5563',
                    border: `1.5px solid ${active ? '#4f46e5' : '#e4e7f0'}`,
                    transition: 'all 150ms ease',
                    boxShadow: active ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quick Jump Question Indicator Chips */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9ca3af', marginRight: 4 }}>
              JUMP TO:
            </span>
            {questionFeedback.map((q, idx) => {
              const sm = getScoreMeta(q.score);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setExpandedIndices((prev) => ({ ...prev, [idx]: true }));
                    const el = document.getElementById(`qa-card-${idx}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  title={`Question ${idx + 1}: ${q.score}/10`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: sm.bg,
                    color: sm.color,
                    border: `1.5px solid ${sm.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Question Cards List ─── */}
      <div
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {filteredFeedback.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: 14,
            }}
          >
            No questions match this filter.
          </div>
        ) : (
          filteredFeedback.map((q) => {
            const idx = q.originalIndex;
            const isExpanded = !!expandedIndices[idx];
            const scoreMeta = getScoreMeta(q.score);
            const wordCount = q.answer
              ? q.answer.trim().split(/\s+/).filter(Boolean).length
              : 0;

            return (
              <div
                key={idx}
                id={`qa-card-${idx}`}
                style={{
                  borderRadius: 18,
                  border: `1.5px solid ${isExpanded ? '#c7d2fe' : '#e4e7f0'}`,
                  background: '#ffffff',
                  boxShadow: isExpanded
                    ? '0 6px 20px rgba(79, 70, 229, 0.06)'
                    : '0 2px 8px rgba(17, 24, 39, 0.03)',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                }}
              >
                {/* ─── Card Header Bar (Always Clickable) ─── */}
                <div
                  onClick={() => toggleIndex(idx)}
                  style={{
                    padding: '18px 22px',
                    background: isExpanded ? '#fafbff' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: 16,
                    borderBottom: isExpanded ? '1.5px solid #edf0f8' : 'none',
                    userSelect: 'none',
                  }}
                >
                  {/* Left: Question Badge & Title Preview */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {/* Number Badge */}
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: '#eef2ff',
                        color: '#4f46e5',
                        border: '1px solid #c7d2fe',
                        fontSize: 12,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      Q{idx + 1}
                    </span>

                    {/* Topic if available */}
                    {q.topic && (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: 9999,
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                          fontSize: 11.5,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          flexShrink: 0,
                        }}
                      >
                        {q.topic}
                      </span>
                    )}

                    {/* Question text preview */}
                    <span
                      style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: 1.45,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                      }}
                    >
                      {q.question}
                    </span>
                  </div>

                  {/* Right: Score Pill & Chevron */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    {/* Score pill */}
                    <div
                      style={{
                        padding: '5px 12px',
                        borderRadius: 9999,
                        background: scoreMeta.bg,
                        color: scoreMeta.color,
                        border: `1.5px solid ${scoreMeta.border}`,
                        fontSize: 12.5,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                    >
                      <span>{scoreMeta.emoji}</span>
                      <span>{q.score} / 10</span>
                      <span style={{ fontSize: 11, opacity: 0.85 }}>• {scoreMeta.label}</span>
                    </div>

                    {/* Chevron icon */}
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: isExpanded ? '#e0e7ff' : '#f1f5f9',
                        color: isExpanded ? '#4f46e5' : '#64748b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        transition: 'transform 200ms ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* ─── Card Body: Visual Q→A Dialogue & Evaluator Analysis ─── */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '24px 26px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 22,
                      background: '#fafbfe',
                    }}
                  >
                    {/* Turn 1: Interviewer Prompt (Q) */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 14,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: isHR
                            ? 'linear-gradient(135deg, #059669, #10b981)'
                            : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          boxShadow: '0 3px 10px rgba(79, 70, 229, 0.22)',
                        }}
                      >
                        {isHR ? '🤝' : '🤖'}
                      </div>

                      {/* Bubble */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: isHR ? '#059669' : '#4f46e5',
                              letterSpacing: '0.02em',
                            }}
                          >
                            AI Interviewer
                          </span>
                          <span style={{ fontSize: 11.5, color: '#9ca3af' }}>
                            • Question Prompt
                          </span>
                        </div>

                        <div
                          style={{
                            padding: '14px 18px',
                            borderRadius: '4px 18px 18px 18px',
                            background: '#ffffff',
                            border: '1.5px solid #e0e7ff',
                            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.04)',
                            color: '#1e1b4b',
                            fontSize: 14.5,
                            fontWeight: 600,
                            lineHeight: 1.6,
                          }}
                        >
                          {q.question}
                        </div>
                      </div>
                    </div>

                    {/* Turn 2: Candidate Recorded Response (A) */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 14,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          boxShadow: '0 3px 10px rgba(234, 88, 12, 0.22)',
                        }}
                      >
                        👤
                      </div>

                      {/* Bubble */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: '#ea580c',
                              letterSpacing: '0.02em',
                            }}
                          >
                            Your Answer
                          </span>
                          <span style={{ fontSize: 11.5, color: '#9ca3af' }}>
                            • {wordCount > 0 ? `${wordCount} words recorded` : 'No verbal answer recorded'}
                          </span>
                        </div>

                        <div
                          style={{
                            padding: '14px 18px',
                            borderRadius: '4px 18px 18px 18px',
                            background: '#ffffff',
                            border: '1.5px solid #e4e7f0',
                            boxShadow: '0 2px 8px rgba(17, 24, 39, 0.03)',
                            color: q.answer ? '#374151' : '#9ca3af',
                            fontSize: 14,
                            lineHeight: 1.65,
                            fontStyle: q.answer ? 'normal' : 'italic',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {q.answer || 'No answer recorded for this question.'}
                        </div>
                      </div>
                    </div>

                    {/* Evaluator Analysis & Score Critique */}
                    <div
                      style={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        paddingTop: 18,
                        borderTop: '1.5px dashed #e2e8f0',
                      }}
                    >
                      {/* Critique Box */}
                      <div
                        style={{
                          padding: '16px 18px',
                          borderRadius: 14,
                          background: '#ffffff',
                          border: '1.5px solid #e4e7f0',
                          boxShadow: '0 2px 8px rgba(17, 24, 39, 0.03)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 6,
                              background: '#eef2ff',
                              color: '#4f46e5',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                            }}
                          >
                            📋
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: '#4f46e5',
                            }}
                          >
                            Evaluator Assessment & Feedback
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: 13.5,
                            color: '#374151',
                            lineHeight: 1.65,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {q.critique || 'Good effort. Continue elaborating on trade-offs and edge cases.'}
                        </p>
                      </div>

                      {/* 10/10 Ideal Keypoints Box */}
                      {q.idealAnswerKeypoints && (
                        <div
                          style={{
                            padding: '16px 18px',
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
                            border: '1.5px solid #c7d2fe',
                            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.05)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: '#e0e7ff',
                                color: '#4338ca',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                              }}
                            >
                              🎯
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: '#4338ca',
                              }}
                            >
                              What a 10/10 Model Response Includes
                            </span>
                          </div>

                          <p
                            style={{
                              fontSize: 13.5,
                              color: '#312e81',
                              lineHeight: 1.65,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {q.idealAnswerKeypoints}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
