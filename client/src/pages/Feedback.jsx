import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFeedback } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import FeedbackSection from '../components/FeedbackSection';
import QuestionReviewAccordion from '../components/QuestionReviewAccordion';
import Button from '../components/Button';

export default function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReport() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getFeedback(id);
        if (!isMounted) return;

        setReport(data.feedback);
        setInterview(data.interview);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to generate performance evaluation.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) {
      loadReport();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 32,
          textAlign: 'center',
          background: '#f7f8fd',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 64,
            height: 64,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              border: '4px solid #e0e7ff',
              borderTopColor: '#4f46e5',
              borderRadius: '50%',
              animation: 'spin 0.85s linear infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            📊
          </div>
        </div>

        <div style={{ maxWidth: 460 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#111827',
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}
          >
            Generating Your AI Evaluation Report...
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14.5, lineHeight: 1.6 }}>
            Analyzing technical accuracy, structured communication, STAR storytelling, and building a personalized interview breakdown.
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !report) {
    return (
      <div
        style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#f7f8fd',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            padding: 36,
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: 22,
            border: '1.5px solid #fecaca',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.08)',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
            Unable to Load Feedback
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
            {error || 'Feedback report could not be found or generated.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isTechnical = interview?.mode === 'technical';
  const role = interview?.target_role || 'Candidate';
  const company = interview?.target_company || 'Target Company';
  const completedDate = interview?.completed_at
    ? new Date(interview.completed_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Session';

  const overallScore = report.overallScore || 0;

  // Dynamic headline & banner styling based on score
  const getVerdictHero = (score) => {
    if (score >= 85) {
      return {
        emoji: '🎉',
        title: 'Outstanding Performance!',
        subtitle: 'You demonstrated strong depth, clear communication, and are well-aligned with senior expectations.',
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
      };
    }
    if (score >= 70) {
      return {
        emoji: '⭐',
        title: 'Strong Interview Session!',
        subtitle: 'Solid foundational knowledge and logical structuring with just a few areas to refine before the real round.',
        color: '#4f46e5',
        bg: '#eef2ff',
        border: '#c7d2fe',
      };
    }
    if (score >= 55) {
      return {
        emoji: '📈',
        title: 'Good Practice Session!',
        subtitle: 'You showed clear potential. Review the evaluator keypoints and targeted study steps below to push over the bar.',
        color: '#d97706',
        bg: '#fefce8',
        border: '#fde68a',
      };
    }
    return {
      emoji: '💪',
      title: 'Valuable Revision Session!',
      subtitle: 'Great mock practice! Focus on the key areas for growth below and try another practice round to build confidence.',
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fed7aa',
    };
  };

  const verdict = getVerdictHero(overallScore);
  const questionFeedbackList = report.questionFeedback || [];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f8fd',
        backgroundImage: 'radial-gradient(at 0% 0%, #eef2ff 0px, transparent 50%), radial-gradient(at 100% 0%, #fdf2f8 0px, transparent 50%)',
        padding: '36px 20px 100px',
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Breadcrumb & Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#6b7280' }}>
            <Link
              to="/dashboard"
              style={{
                color: '#4f46e5',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                transition: 'opacity 150ms ease',
              }}
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span style={{ color: '#9ca3af' }}>Interviews</span>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#111827' }}>Performance Report</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
            >
              🖨️ Print / PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/interview/setup')}
            >
              Practice Again →
            </Button>
          </div>
        </div>

        {/* Header Info Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 22,
            border: '1.5px solid #e4e7f0',
            padding: '24px 28px',
            boxShadow: '0 4px 18px rgba(17, 24, 39, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: isTechnical ? '#eef2ff' : '#ecfdf5',
                  color: isTechnical ? '#4f46e5' : '#059669',
                  border: `1.5px solid ${isTechnical ? '#c7d2fe' : '#a7f3d0'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{isTechnical ? '⚡' : '🤝'}</span>
                <span>{isTechnical ? 'Technical Interview' : 'HR Behavioral Interview'}</span>
              </span>

              <span
                style={{
                  fontSize: 12.5,
                  color: '#6b7280',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                📅 {completedDate}
              </span>
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.03em',
                marginBottom: 6,
              }}
            >
              Interview Performance Report
            </h1>

            <p style={{ color: '#4b5563', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              Targeting <strong style={{ color: '#111827', fontWeight: 800 }}>{role}</strong> at{' '}
              <strong style={{ color: '#111827', fontWeight: 800 }}>{company}</strong>
            </p>
          </div>

          {/* Quick Metrics Chip Strip */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>
                {questionFeedbackList.length}
              </div>
              <div style={{ fontSize: 11.5, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                Questions
              </div>
            </div>

            <div
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
                {report.strengths?.length || 0}
              </div>
              <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                Strengths
              </div>
            </div>

            <div
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                background: '#fefce8',
                border: '1px solid #fde68a',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: '#d97706' }}>
                {report.areasForImprovement?.length || 0}
              </div>
              <div style={{ fontSize: 11.5, color: '#d97706', fontWeight: 700, textTransform: 'uppercase' }}>
                Focus Areas
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Hero Banner */}
        {report.summary && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 22,
              border: `1.5px solid ${verdict.border}`,
              boxShadow: '0 6px 24px rgba(17, 24, 39, 0.05)',
              overflow: 'hidden',
              animation: 'fadeUp 350ms ease both',
            }}
          >
            {/* Top verdict bar */}
            <div
              style={{
                padding: '18px 26px',
                background: verdict.bg,
                borderBottom: `1.5px solid ${verdict.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 24 }}>{verdict.emoji}</span>
              <div>
                <h2 style={{ fontSize: 16.5, fontWeight: 800, color: verdict.color, letterSpacing: '-0.01em' }}>
                  {verdict.title}
                </h2>
                <p style={{ fontSize: 13, color: '#4b5563', marginTop: 2 }}>
                  {verdict.subtitle}
                </p>
              </div>
            </div>

            {/* Summary text */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>📋</span>
                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Executive Assessment
                </h3>
              </div>
              <p
                style={{
                  color: '#374151',
                  fontSize: 15,
                  lineHeight: 1.75,
                  whiteSpace: 'pre-line',
                }}
              >
                {report.summary}
              </p>
            </div>
          </div>
        )}

        {/* ScoreCard Component */}
        <ScoreCard
          overallScore={overallScore}
          scores={report.scores || {}}
          mode={interview?.mode || 'technical'}
        />

        {/* Strengths & Areas for Improvement (2-Column Grid) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          <FeedbackSection
            title="Key Strengths Observed"
            subtitle="Demonstrated proficiencies during the interview"
            items={report.strengths || []}
            icon="✅"
            accentColor="#059669"
          />

          <FeedbackSection
            title="Areas for Growth & Improvement"
            subtitle="High-impact gaps to target before the real loop"
            items={report.areasForImprovement || []}
            icon="⚠️"
            accentColor="#d97706"
          />
        </div>

        {/* Visual Interactive Q&A Breakdown & Transcript */}
        <QuestionReviewAccordion
          questionFeedback={questionFeedbackList}
          transcript={interview?.transcript || []}
          mode={interview?.mode || 'technical'}
        />

        {/* Recommended Next Steps & Study Plan */}
        <FeedbackSection
          title="Recommended Next Steps & Action Plan"
          subtitle="Curated topics and concrete exercises to master your next loop"
          items={report.recommendedNextSteps || []}
          icon="🚀"
          accentColor="#4f46e5"
        />

        {/* Bottom Call to Action Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: 22,
            padding: '32px 36px',
            color: '#ffffff',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Ready for your next interview round?
            </h3>
            <p style={{ fontSize: 14.5, color: '#e0e7ff', maxWidth: 540, lineHeight: 1.55 }}>
              Practice makes permanent. Run another technical or behavioral mock to test your improvements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'none',
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="coral"
              onClick={() => navigate('/interview/setup')}
              style={{
                background: '#ffffff',
                color: '#4f46e5',
                border: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              Start New Mock →
            </Button>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            nav, header, button, .no-print {
              display: none !important;
            }
            body, #root {
              background: #ffffff !important;
              color: #000000 !important;
            }
            div {
              box-shadow: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
