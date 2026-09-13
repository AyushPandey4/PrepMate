import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const features = [
  {
    icon: '📄',
    accent: '#4f46e5',
    bg: '#eef2ff',
    border: '#c7d2fe',
    title: 'Resume-Aware Intelligence',
    description:
      'Upload your PDF resume. Our AI extraction parses your exact projects, frameworks, databases, and career history so questions test your actual background — never generic templates.',
    badge: '100% Tailored',
  },
  {
    icon: '🔄',
    accent: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    title: 'Adaptive Follow-Up Probing',
    description:
      'The AI listens to your responses and probes deeper into architectural trade-offs, edge cases, and algorithmic complexity — mirroring how senior engineering leaders interview.',
    badge: 'Dynamic AI',
  },
  {
    icon: '🎙️',
    accent: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    title: 'Natural Voice Interaction',
    description:
      'Practice speaking aloud just like a real phone screen or video call. Questions are read with text-to-speech, and your speech is transcribed in real time via microphone.',
    badge: 'Voice Enabled',
  },
  {
    icon: '🎯',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    title: 'Company & Role Calibration',
    description:
      'Targeting Google, Meta, Stripe, Amazon, or early-stage startups? Specify your target company and role. The AI calibrates seniority, tone, and grading rubrics accordingly.',
    badge: 'Target Calibrated',
  },
  {
    icon: '📊',
    accent: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    title: 'Radial Scorecard & Analytics',
    description:
      'Receive an executive evaluation score (0-100) with detailed competency progress bars across Technical Depth, Structured Problem Solving, Communication, and Role Alignment.',
    badge: 'In-Depth Scoring',
  },
  {
    icon: '💬',
    accent: '#d97706',
    bg: '#fefce8',
    border: '#fde68a',
    title: 'Visual Q→A Dialogue & 10/10 Keys',
    description:
      'Review your entire conversation turn-by-turn with interviewer prompts, your recorded answers, evaluator critiques, and concrete 10/10 model answer keypoints.',
    badge: 'Model Answers',
  },
];

const steps = [
  {
    number: '01',
    icon: '📄',
    title: 'Upload Your Resume',
    tag: 'Instant PDF Extraction',
    description:
      'Drop your resume in PDF format. Our AI scans your core technologies, past accomplishments, and key projects to formulate context-aware interview prompts.',
  },
  {
    number: '02',
    icon: '⚙️',
    title: 'Calibrate Target & Mode',
    tag: 'Custom Role & Company',
    description:
      'Select Technical mode for algorithms, system design, and tech stack deep-dives, or HR mode for STAR-based behavioral questions. Enter your target company to tune the difficulty.',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Interview & Get Coached',
    tag: 'Full AI Evaluation Report',
    description:
      'Interact naturally via voice or text. When complete, receive an instant executive performance report, score breakdown, and personalized study roadmap.',
  },
];

const faqs = [
  {
    q: 'How does PrepMate tailor questions to my actual resume?',
    a: 'When you upload your PDF resume, PrepMate parses your listed skills, project descriptions, architectural choices, and work experience. The AI interviewer uses these details to ask specific questions about your real work, just like a senior interviewer at your target company.',
  },
  {
    q: 'Is PrepMate completely free to use?',
    a: 'Yes! You can sign in with your Google account and immediately start practicing both technical and behavioral mock interviews with full feedback reports at zero cost.',
  },
  {
    q: 'Can I practice with voice instead of typing?',
    a: 'Yes. PrepMate includes full voice recognition and text-to-speech audio support. You can listen to the interviewer speak questions and practice answering aloud using your browser microphone.',
  },
  {
    q: 'What is the difference between Technical and HR Behavioral modes?',
    a: 'Technical mode covers Data Structures & Algorithms, Scalable System Design, API architecture, database trade-offs, and your resume tech stack. HR Behavioral mode tests leadership principles, teamwork, conflict resolution, and STAR-method storytelling.',
  },
  {
    q: 'How does the evaluation report score my performance?',
    a: 'Every session produces an overall score out of 100 and evaluates four core competencies: Technical/Behavioral Depth, Problem Solving, Communication, and Role Alignment. Each question is scored with specific constructive feedback and 10/10 ideal keypoints.',
  },
];

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}


export default function Landing() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  async function handleGoogleLogin() {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch {
      setAuthError('Failed to sign in with Google. Please try again.');
      setSigningIn(false);
    }
  }

  const scrollToHeroLogin = () => {
    const el = document.getElementById('hero-auth-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f8fd',
        backgroundImage:
          'radial-gradient(at 0% 0%, #eef2ff 0px, transparent 50%), radial-gradient(at 100% 0%, #fdf2f8 0px, transparent 50%), radial-gradient(at 50% 50%, #f5f3ff 0px, transparent 60%)',
        color: '#111827',
      }}
    >

      <section
        style={{
          padding: '70px 24px 80px',
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            background: '#ffffff',
            border: '1.5px solid #e0e7ff',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.08)',
            marginBottom: 24,
            fontSize: 13,
            fontWeight: 700,
            color: '#4f46e5',
            animation: 'fadeUp 400ms ease both',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4f46e5',
              display: 'inline-block',
              boxShadow: '0 0 8px #4f46e5',
            }}
          />
          Next-Gen AI Mock Interviews • Calibrated to Your Resume
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(38px, 6vw, 68px)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.04em',
            maxWidth: 920,
            marginBottom: 20,
            color: '#111827',
          }}
        >
          Practice interviews that{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            actually land offers
          </span>
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: 'clamp(16px, 2.2vw, 19.5px)',
            color: '#4b5563',
            maxWidth: 680,
            lineHeight: 1.65,
            marginBottom: 36,
          }}
        >
          Upload your resume. Pick your target company. PrepMate conducts an adaptive, voice-enabled
          technical or behavioral mock interview with instant scoring and 10/10 model answers.
        </p>


        <div
          id="hero-auth-card"
          style={{
            background: '#ffffff',
            borderRadius: 22,
            border: '1.5px solid #e4e7f0',
            boxShadow: '0 12px 36px rgba(17, 24, 39, 0.08), 0 2px 6px rgba(17, 24, 39, 0.02)',
            padding: '24px 32px',
            maxWidth: 460,
            width: '100%',
            marginBottom: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            animation: 'scaleIn 350ms ease both',
          }}
        >
          {user ? (
            /* Logged in state */
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 14, color: '#059669', fontWeight: 700 }}>
                ✓ You are signed in as {user?.email}
              </div>
              <Link to="/dashboard" style={{ textDecoration: 'none', width: '100%' }}>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)',
                    transition: 'all 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 70, 229, 0.35)';
                  }}
                >
                  Go to Dashboard →
                </button>
              </Link>
            </div>
          ) : (

            <>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: 0 }}>
                Sign in to start practicing immediately
              </p>

              <button
                id="google-signin-button"
                type="button"
                onClick={handleGoogleLogin}
                disabled={signingIn || loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '13px 24px',
                  background: '#ffffff',
                  color: '#1f2937',
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 15.5,
                  border: '1.5px solid #d1d5db',
                  cursor: signingIn ? 'not-allowed' : 'pointer',
                  opacity: signingIn ? 0.75 : 1,
                  transition: 'all 180ms ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
                onMouseEnter={(e) => {
                  if (!signingIn) {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
              >
                <GoogleIcon />
                <span>{signingIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {authError && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontSize: 12.5,
                    fontWeight: 600,
                    width: '100%',
                  }}
                >
                  {authError}
                </div>
              )}

              <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔒</span> 100% Free • No password required • Instant setup
              </span>
            </>
          )}
        </div>


        <div
          style={{
            width: '100%',
            maxWidth: 1040,
            background: '#ffffff',
            borderRadius: 24,
            border: '1.5px solid #e4e7f0',
            boxShadow: '0 20px 50px rgba(17, 24, 39, 0.09), 0 4px 12px rgba(17, 24, 39, 0.03)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Mock Window Top Bar */}
          <div
            style={{
              padding: '14px 22px',
              background: '#f8fafc',
              borderBottom: '1px solid #e4e7f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, color: '#6b7280' }}>
                PrepMate Interactive Room • Software Engineer at Google
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 9999,
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                ● LIVE SESSION
              </span>
            </div>
          </div>

          {/* Mock Split Layout */}
          <div
            style={{
              padding: '32px 34px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 28,
              background: '#fafbfe',
            }}
          >
            {/* Left Mock: The Interviewer Question Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                border: '1.5px solid #e0e7ff',
                padding: '24px',
                boxShadow: '0 4px 18px rgba(79, 70, 229, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                    AI Senior Technical Evaluator
                  </div>
                  <div style={{ fontSize: 12, color: '#4f46e5', fontWeight: 700 }}>
                    ⚡ System Design & Distributed Architecture
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: '#1e1b4b',
                  lineHeight: 1.55,
                  background: '#f8faff',
                  padding: '16px',
                  borderRadius: 14,
                  border: '1px solid #e0e7ff',
                }}
              >
                &ldquo;You mentioned building a distributed streaming pipeline on your resume. How would
                you handle hash collisions and partition rebalancing when scale reaches 100k requests/sec?&rdquo;
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#eef2ff', color: '#4f46e5' }}>
                  ✓ Resume-Aware
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#ecfdf5', color: '#059669' }}>
                  ✓ Adaptive Depth
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#fff7ed', color: '#ea580c' }}>
                  ✓ Audio TTS Enabled
                </span>
              </div>
            </div>

            {/* Right Mock: Live Response & Evaluator Feedback */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Candidate Voice Audio Bubble */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  border: '1.5px solid #e4e7f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ea580c' }}>
                    🎙️ Your Voice Response (Transcribed)
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                    Clear Audio
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;I would introduce consistent hashing with virtual nodes to distribute partitions evenly
                  across worker nodes and implement consumer groups with offset commits...&rdquo;
                </p>
              </div>

              {/* Instant Evaluation Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
                  borderRadius: 18,
                  border: '1.5px solid #c7d2fe',
                  padding: '18px 20px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📋 Evaluator Coaching • 9 / 10
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>
                    🏆 Excellent
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#312e81', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;Exceptional technical depth. Next step: explicitly clarify data replication factors and
                  ZooKeeper/KRaft partition leadership failover.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Metrics Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 5vw, 60px)',
            marginTop: 48,
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '15,000+', label: 'Questions Simulated' },
            { value: '94%', label: 'Offer Confidence Lift' },
            { value: '4 Pillars', label: 'Competency Scoring' },
            { value: '10 / 10', label: 'Model Keypoints' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#111827', letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#6b7280', marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>


      <section
        id="features"
        style={{
          padding: '90px 24px',
          maxWidth: 1140,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#4f46e5',
              padding: '4px 12px',
              borderRadius: 9999,
              background: '#eef2ff',
            }}
          >
            EVERYTHING YOU NEED TO WIN THE OFFER
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              marginTop: 14,
              marginBottom: 12,
              color: '#111827',
            }}
          >
            Built for serious interview preparation
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 620, margin: '0 auto' }}>
            Traditional interview prep is static and generic. PrepMate turns your resume into an
            active, adaptive simulation with real-time dialogue and deep coaching.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((f, index) => (
            <div
              key={index}
              style={{
                background: '#ffffff',
                borderRadius: 22,
                border: '1.5px solid #e4e7f0',
                padding: '28px 26px',
                boxShadow: '0 4px 18px rgba(17, 24, 39, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(17, 24, 39, 0.08)';
                e.currentTarget.style.borderColor = f.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(17, 24, 39, 0.04)';
                e.currentTarget.style.borderColor = '#e4e7f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: f.bg,
                    border: `1.5px solid ${f.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {f.icon}
                </div>

                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 9999,
                    background: f.bg,
                    color: f.accent,
                    border: `1px solid ${f.border}`,
                  }}
                >
                  {f.badge}
                </span>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>
                {f.title}
              </h3>

              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section
        id="how-it-works"
        style={{
          padding: '90px 24px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#059669',
              padding: '4px 12px',
              borderRadius: 9999,
              background: '#ecfdf5',
            }}
          >
            SIMPLE 3-STEP WORKFLOW
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              marginTop: 14,
              marginBottom: 12,
              color: '#111827',
            }}
          >
            From resume upload to offer-ready feedback
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 580, margin: '0 auto' }}>
            No tedious manual configuration. Get started in seconds and receive immediate hiring feedback.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}
        >
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: 22,
                border: '1.5px solid #e4e7f0',
                padding: '30px 26px',
                boxShadow: '0 4px 18px rgba(17, 24, 39, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#e0e7ff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {s.number}
                </span>

                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 9999,
                    background: '#eef2ff',
                    color: '#4f46e5',
                    border: '1px solid #c7d2fe',
                  }}
                >
                  {s.tag}
                </span>
              </div>

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {s.icon}
              </div>

              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#111827', margin: 0 }}>
                {s.title}
              </h3>

              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65, margin: 0 }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section
        id="modes"
        style={{
          padding: '90px 24px',
          maxWidth: 1080,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#d97706',
              padding: '4px 12px',
              borderRadius: 9999,
              background: '#fefce8',
            }}
          >
            TARGETED TRACKS
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              marginTop: 14,
              marginBottom: 12,
              color: '#111827',
            }}
          >
            Two specialized interview modes
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 580, margin: '0 auto' }}>
            Whether you are preparing for complex systems loops or behavioral culture fit screens,
            PrepMate provides specialized rubrics.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}
        >
          {/* Technical Track Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 24,
              border: '1.5px solid #e4e7f0',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(17, 24, 39, 0.05)',
            }}
          >
            <div style={{ height: 6, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
            <div style={{ padding: '32px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 32 }}>⚡</span>
                <div>
                  <h3 style={{ fontSize: 21, fontWeight: 900, color: '#111827', margin: 0 }}>
                    Technical Interview
                  </h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>
                    Software & Systems Engineering
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 20 }}>
                Rigorous testing on coding fundamentals, system architecture, database design, and
                detailed trade-offs based on your resume tech stack.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Data Structures & Algorithms problem solving',
                  'Scalable System Design & Distributed Architecture',
                  'Concurrency, Caching & Performance Bottlenecks',
                  'Database schema design, SQL, NoSQL & indexing',
                  'Deep-dives into projects from your resume',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#374151' }}>
                    <span style={{ color: '#4f46e5', fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Behavioral / HR Track Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 24,
              border: '1.5px solid #e4e7f0',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(17, 24, 39, 0.05)',
            }}
          >
            <div style={{ height: 6, background: 'linear-gradient(90deg, #059669, #10b981)' }} />
            <div style={{ padding: '32px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 32 }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: 21, fontWeight: 900, color: '#111827', margin: 0 }}>
                    HR & Behavioral Interview
                  </h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                    STAR Method & Leadership Principles
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 20 }}>
                Master leadership stories, conflict handling, and culture fit with real-time feedback
                on your clarity, conciseness, and impact metrics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'STAR framework structuring (Situation, Task, Action, Result)',
                  'Handling team conflicts, disagreements & cross-functional work',
                  'Leadership, mentorship & ownership examples',
                  'Navigating ambiguity and project deadlines',
                  'Target company culture & motivational alignment',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#374151' }}>
                    <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="faq"
        style={{
          padding: '80px 24px',
          maxWidth: 820,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#4f46e5',
              padding: '4px 12px',
              borderRadius: 9999,
              background: '#eef2ff',
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              marginTop: 14,
              color: '#111827',
            }}
          >
            Everything you need to know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: `1.5px solid ${isOpen ? '#c7d2fe' : '#e4e7f0'}`,
                  overflow: 'hidden',
                  transition: 'all 150ms ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? '#fafbff' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: '#111827' }}>
                    {faq.q}
                  </span>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isOpen ? '#e0e7ff' : '#f1f5f9',
                      color: isOpen ? '#4f46e5' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '16px 22px 20px',
                      background: '#ffffff',
                      borderTop: '1px solid #edf0f8',
                      fontSize: 14.5,
                      color: '#4b5563',
                      lineHeight: 1.65,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      <section
        style={{
          padding: '60px 24px 80px',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: 24,
            padding: '44px 36px',
            color: '#ffffff',
            boxShadow: '0 14px 40px rgba(79, 70, 229, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            🎯
          </div>

          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 10 }}>
              Ready to ace your next technical or behavioral round?
            </h2>
            <p style={{ fontSize: 15.5, color: '#e0e7ff', lineHeight: 1.6, margin: 0 }}>
              Join candidates using PrepMate to calibrate with real interview questions, voice playback, and instant grading.
            </p>
          </div>

          {user ? (
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  padding: '13px 32px',
                  borderRadius: 14,
                  background: '#ffffff',
                  color: '#4f46e5',
                  fontSize: 16,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Go to Dashboard →
              </button>
            </Link>
          ) : (
            <button
              type="button"
              onClick={scrollToHeroLogin}
              style={{
                padding: '13px 32px',
                borderRadius: 14,
                background: '#ffffff',
                color: '#4f46e5',
                fontSize: 16,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'transform 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Get Started Above ↑
            </button>
          )}
        </div>
      </section>

      <footer
        style={{
          borderTop: '1px solid #e4e7f0',
          background: '#ffffff',
          padding: '28px 32px',
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/prepmate_logo.png"
              alt="PrepMate Logo"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                objectFit: 'cover',
              }}
            />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#111827', letterSpacing: '-0.02em' }}>
              Prep<span style={{ color: '#4f46e5' }}>Mate</span>
            </span>
            <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 8 }}>
              • Next-Gen AI Interview Partner
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How It Works</a>
            <a href="#modes" style={{ textDecoration: 'none', color: 'inherit' }}>Modes</a>
            <a href="#faq" style={{ textDecoration: 'none', color: 'inherit' }}>FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
