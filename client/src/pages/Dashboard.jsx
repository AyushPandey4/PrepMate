import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInterviews } from '../services/api';
import Button from '../components/Button';

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Pill({ children, bg, color, border }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      fontSize: 12, fontWeight: 600,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  );
}

function ModePill({ mode }) {
  const tech = mode === 'technical';
  return (
    <Pill
      bg={tech ? '#eef2ff' : '#fff7ed'}
      color={tech ? '#4338ca' : '#c2410c'}
      border={tech ? '#c7d2fe' : '#fed7aa'}
    >
      {tech ? '⚡ Technical' : '🤝 HR & Behavioral'}
    </Pill>
  );
}

function StatusPill({ status }) {
  const done = status === 'completed';
  return (
    <Pill
      bg={done ? '#ecfdf5' : '#fffbeb'}
      color={done ? '#047857' : '#b45309'}
      border={done ? '#a7f3d0' : '#fde68a'}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: done ? '#10b981' : '#f59e0b', display: 'inline-block' }}/>
      {done ? 'Completed' : 'In Progress'}
    </Pill>
  );
}

function TrackCard({ gradient, iconBg, icon, eyebrow, title, description, tags, tagStyle, btnLabel, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 22,
        background: gradient,
        padding: '30px 28px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: hov ? '0 20px 48px rgba(17,24,39,0.18)' : '0 8px 24px rgba(17,24,39,0.12)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 230ms cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Subtle decorative circle */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        transition: 'transform 300ms ease',
        transform: hov ? 'scale(1.15)' : 'scale(1)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', right: 20, bottom: -60,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }}/>

      {/* Top row: icon + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position:'relative' }}>
        <div style={{
          width: 50, height: 50, borderRadius: 15,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
          marginTop: 6,
        }}>
          {eyebrow}
        </span>
      </div>

      {/* Title + Description */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', marginBottom: 8 }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>
          {description}
        </p>
      </div>

      {/* Tag pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {tags.map(t => (
          <span key={t} style={{
            padding: '4px 11px', borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            ...tagStyle,
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onClick}
        style={{
          marginTop: 2,
          padding: '11px 20px', borderRadius: 12,
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          color: '#fff',
          fontSize: 14, fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 180ms ease',
          letterSpacing: '-0.01em',
          position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
      >
        {btnLabel} →
      </button>
    </div>
  );
}


function SkeletonRow() {
  return (
    <div style={{
      height: 72, borderRadius: 14,
      background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%)',
      backgroundSize: '400px 100%',
      animation: 'shimmer 1.6s infinite linear',
      border: '1px solid #e4e7f0',
    }}/>
  );
}


export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [filter, setFilter]         = useState('all');

  const firstName = (user?.user_metadata?.full_name || user?.email || 'there').split(' ')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true); setError(null);
        const d = await getInterviews();
        if (alive) setInterviews(d.interviews || []);
      } catch (e) {
        if (alive) setError(e.message || 'Could not load sessions.');
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const shown = interviews.filter(i => filter === 'all' || i.mode === filter);

  const go = (mode) => navigate(`/interview/setup?mode=${mode}`, { state: { mode } });

  return (
    <div style={{
      minHeight: 'calc(100vh - 62px)',
      background: '#f7f8fd',
      padding: '40px 24px 80px',
      animation: 'fadeUp 350ms ease both',
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

       
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '28px 30px',
          border: '1px solid #e4e7f0',
          boxShadow: '0 2px 8px rgba(17,24,39,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          {/* Avatar + Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ position: 'relative' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={firstName}
                  style={{ width: 58, height: 58, borderRadius: 18, objectFit: 'cover', border: '2.5px solid #e0e7ff', boxShadow: '0 4px 14px rgba(79,70,229,0.12)' }}
                />
              ) : (
                <div style={{
                  width: 58, height: 58, borderRadius: 18,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: '#fff',
                  boxShadow: '0 4px 16px rgba(79,70,229,0.28)',
                }}>
                  {firstName[0]?.toUpperCase()}
                </div>
              )}
              {/* Status dot */}
              <div style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 13, height: 13, borderRadius: '50%',
                background: '#10b981',
                border: '2.5px solid #fff',
                boxShadow: '0 0 0 2px rgba(16,185,129,0.2)',
              }}/>
            </div>

            <div>
              <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-0.04em', color: '#111827', lineHeight: 1.1 }}>
                {timeGreeting()}, {firstName}! 👋
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14.5, marginTop: 5 }}>
                Ready to practice? Pick a track below and let's get started.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button size="md" variant="primary" onClick={() => navigate('/interview/setup')}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Custom Session
          </Button>
        </div>

       
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>

          <TrackCard
            gradient="linear-gradient(140deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)"
            iconBg="rgba(255,255,255,0.2)"
            icon="⚡"
            eyebrow="Engineering & Systems"
            title="Technical Interview"
            description="Resume-aware questions on algorithms, system design, and coding — tailored precisely to your stack and target company."
            tags={['Algorithms & DS', 'System Design', 'Architecture', 'Your Tech Stack']}
            tagStyle={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            btnLabel="Start Technical Session"
            onClick={() => go('technical')}
          />

          <TrackCard
            gradient="linear-gradient(140deg, #c2410c 0%, #f97316 55%, #fb923c 100%)"
            iconBg="rgba(255,255,255,0.2)"
            icon="🤝"
            eyebrow="Culture & Leadership"
            title="HR & Behavioral"
            description="Practice the STAR method, conflict resolution, leadership stories, and culture-fit answers with adaptive AI follow-ups."
            tags={['STAR Method', 'Conflict Resolution', 'Leadership', 'Culture Fit']}
            tagStyle={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            btnLabel="Start Behavioral Session"
            onClick={() => go('hr')}
          />
        </div>

       
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e4e7f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,24,39,0.05)' }}>

          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px 18px',
            borderBottom: '1px solid #f3f4f6',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
                Past Sessions
              </h2>
              {interviews.length > 0 && (
                <span style={{
                  background: '#eef2ff', color: '#4338ca',
                  border: '1px solid #c7d2fe',
                  fontSize: 12, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 9999,
                }}>
                  {shown.length}
                </span>
              )}
            </div>

            {/* Filter tabs */}
            {interviews.length > 0 && (
              <div style={{
                display: 'flex', gap: 2, background: '#f3f4f6',
                padding: 3, borderRadius: 10,
              }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'technical', label: '⚡ Technical' },
                  { id: 'hr', label: '🤝 HR' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                    padding: '5px 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                    cursor: 'pointer', border: 'none', transition: 'all 120ms ease',
                    background: filter === tab.id ? '#fff' : 'transparent',
                    color: filter === tab.id ? '#111827' : '#6b7280',
                    boxShadow: filter === tab.id ? '0 1px 3px rgba(17,24,39,0.1)' : 'none',
                  }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '12px 16px 16px' }}>

            {/* Loading */}
            {isLoading && (
              <div style={{ display:'flex',flexDirection:'column',gap:10,padding:'4px 0' }}>
                <SkeletonRow/><SkeletonRow/><SkeletonRow/>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div style={{ padding:'16px 12px',borderRadius:12,background:'#fef2f2',border:'1px solid #fecaca',color:'#b91c1c',fontSize:14,textAlign:'center' }}>
                {error}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && shown.length === 0 && (
              <div style={{ padding:'48px 16px',textAlign:'center' }}>
                <div style={{ width:52,height:52,borderRadius:16,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14px' }}>📋</div>
                <h3 style={{ fontSize:16,fontWeight:700,color:'#111827',marginBottom:6 }}>
                  {filter==='all' ? 'No sessions yet' : `No ${filter} sessions`}
                </h3>
                <p style={{ color:'#6b7280',fontSize:14,maxWidth:320,margin:'0 auto 20px',lineHeight:1.6 }}>
                  Your completed sessions, scores, and AI feedback will show up here.
                </p>
                <Button size="sm" variant="primary" onClick={() => navigate('/interview/setup')}>
                  Start Your First Session →
                </Button>
              </div>
            )}

            {/* Sessions list */}
            {!isLoading && !error && shown.length > 0 && (
              <div style={{ display:'flex',flexDirection:'column',gap:3 }}>
                {shown.map((s, idx) => {
                  const done     = s.status === 'completed';
                  const hasScore = typeof s.overall_score === 'number';
                  const good     = s.overall_score >= 70;
                  const initials = s.target_company?.[0]?.toUpperCase() || '?';
                  const tech     = s.mode === 'technical';

                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 14, padding: '13px 12px', borderRadius: 12,
                      flexWrap: 'wrap',
                      transition: 'background 140ms ease',
                      animation: `fadeUp 280ms ${idx * 35}ms both ease`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f8fd'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Left */}
                      <div style={{ display:'flex',alignItems:'center',gap:14,flex:'1 1 250px' }}>
                        {/* Company letter */}
                        <div style={{
                          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                          background: tech ? '#eef2ff' : '#fff7ed',
                          border: `1.5px solid ${tech ? '#c7d2fe' : '#fed7aa'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 800,
                          color: tech ? '#4338ca' : '#c2410c',
                        }}>
                          {initials}
                        </div>

                        <div>
                          <div style={{ display:'flex',alignItems:'center',gap:7,flexWrap:'wrap',marginBottom:4 }}>
                            <span style={{ fontSize:15,fontWeight:700,color:'#111827',letterSpacing:'-0.02em' }}>
                              {s.target_role}
                            </span>
                            <span style={{ fontSize:13,color:'#9ca3af' }}>at</span>
                            <span style={{ fontSize:13.5,fontWeight:600,color:'#374151' }}>
                              {s.target_company}
                            </span>
                          </div>
                          <div style={{ display:'flex',alignItems:'center',gap:7,flexWrap:'wrap' }}>
                            <ModePill mode={s.mode}/>
                            <StatusPill status={s.status}/>
                            <span style={{ fontSize:12,color:'#9ca3af' }}>• {fmtDate(s.created_at)}</span>
                            {s.question_count > 0 && (
                              <span style={{ fontSize:12,color:'#9ca3af' }}>• {s.question_count} Qs</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div style={{ display:'flex',alignItems:'center',gap:10,flexShrink:0 }}>
                        {hasScore && (
                          <span style={{
                            padding:'5px 11px', borderRadius:9,
                            background: good ? '#ecfdf5' : '#fffbeb',
                            color: good ? '#047857' : '#b45309',
                            border: `1px solid ${good ? '#a7f3d0' : '#fde68a'}`,
                            fontSize:13, fontWeight:700,
                          }}>
                            {s.overall_score}%
                          </span>
                        )}

                        {done ? (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => navigate(`/feedback/${s.id}`)}>
                              View Feedback
                            </Button>
                            <button
                              title="Retake this interview"
                              onClick={() => navigate(`/interview/setup?mode=${s.mode}&role=${encodeURIComponent(s.target_role)}&company=${encodeURIComponent(s.target_company)}`, { state: { mode: s.mode, role: s.target_role, company: s.target_company } })}
                              style={{ width:32,height:32,borderRadius:9,background:'#f3f4f6',border:'1px solid #e4e7f0',color:'#6b7280',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 140ms ease',flexShrink:0 }}
                              onMouseEnter={e => { e.currentTarget.style.background='#e0e7ff'; e.currentTarget.style.color='#4338ca'; e.currentTarget.style.borderColor='#c7d2fe'; }}
                              onMouseLeave={e => { e.currentTarget.style.background='#f3f4f6'; e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='#e4e7f0'; }}
                            >↺</button>
                          </>
                        ) : (
                          <Button size="sm" variant="primary" onClick={() => navigate(`/interview/${s.id}`)}>
                            Resume →
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
