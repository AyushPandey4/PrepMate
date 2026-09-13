import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import InterviewModeCard from '../components/InterviewModeCard';
import Button from '../components/Button';
import { extractResume, createInterview } from '../services/api';

function StepBadge({ n, done }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
      background: done
        ? 'linear-gradient(135deg, #059669, #10b981)'
        : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: done ? 14 : 13, fontWeight: 800, color: '#fff',
      boxShadow: done
        ? '0 3px 10px rgba(5,150,105,0.3)'
        : '0 3px 10px rgba(79,70,229,0.3)',
      transition: 'all 300ms ease',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

function Section({ number, title, subtitle, done, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e4e7f0',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(17,24,39,0.05)',
      transition: 'box-shadow 200ms ease',
    }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '18px 22px',
        borderBottom: '1px solid #f3f4f6',
        background: done ? '#f0fdf4' : '#fafbff',
      }}>
        <StepBadge n={number} done={done}/>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: 15.5, fontWeight: 800, color: '#111827',
            letterSpacing: '-0.02em', marginBottom: done ? 0 : 1,
          }}>
            {title}
          </h2>
          {!done && subtitle && (
            <p style={{ color: '#9ca3af', fontSize: 13 }}>{subtitle}</p>
          )}
          {done && (
            <p style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>Completed ✓</p>
          )}
        </div>
      </div>

      {/* Section body */}
      <div style={{ padding: '20px 22px 22px' }}>
        {children}
      </div>
    </div>
  );
}

function TextInput({ id, placeholder, value, onChange, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={100}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: `1.5px solid ${focused ? '#4f46e5' : '#e4e7f0'}`,
        background: disabled ? '#f9fafb' : '#fff',
        color: '#111827',
        fontSize: 15,
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'all 150ms ease',
        boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}


function QuickChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px', borderRadius: 9999,
        border: `1.5px solid ${selected ? '#4f46e5' : '#e4e7f0'}`,
        background: selected ? '#eef2ff' : '#fff',
        color: selected ? '#4338ca' : '#6b7280',
        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        transition: 'all 140ms ease', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor='#c7d2fe'; e.currentTarget.style.color='#4f46e5'; }}}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor='#e4e7f0'; e.currentTarget.style.color='#6b7280'; }}}
    >
      {label}
    </button>
  );
}


function ProfilePreview({ profile }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #a7f3d0',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(5,150,105,0.08)',
      animation: 'fadeUp 350ms ease both',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
        padding: '18px 22px',
        borderBottom: '1px solid #a7f3d0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#059669', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20, color: '#fff',
          flexShrink: 0,
        }}>✓</div>
        <div>
          <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#064e3b', letterSpacing: '-0.02em' }}>
            Resume Extracted Successfully
          </h3>
          <p style={{ fontSize: 13, color: '#059669', marginTop: 2 }}>
            Verify the AI understood your resume correctly before proceeding.
          </p>
        </div>
      </div>

      <div style={{ padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name + email */}
        {profile.name && (
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
              {profile.name}
            </p>
            {profile.email && (
              <p style={{ color: '#6b7280', fontSize: 13.5, marginTop: 2 }}>{profile.email}</p>
            )}
          </div>
        )}

        {profile.summary && (
          <ProfileBlock title="Summary">
            <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>{profile.summary}</p>
          </ProfileBlock>
        )}

        {profile.skills?.length > 0 && (
          <ProfileBlock title="Skills">
            <div style={{ display:'flex',flexWrap:'wrap',gap:7 }}>
              {profile.skills.map(s => (
                <span key={s} style={{ padding:'4px 12px',borderRadius:9999,fontSize:12.5,fontWeight:600,background:'#eef2ff',color:'#4338ca',border:'1px solid #c7d2fe' }}>
                  {s}
                </span>
              ))}
            </div>
          </ProfileBlock>
        )}

        {profile.education?.length > 0 && (
          <ProfileBlock title="Education">
            {profile.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{e.degree}</p>
                <p style={{ color: '#6b7280', fontSize: 13 }}>
                  {e.institution}{e.year ? ` · ${e.year}` : ''}{e.grade ? ` · ${e.grade}` : ''}
                </p>
              </div>
            ))}
          </ProfileBlock>
        )}

        {profile.experience?.length > 0 && (
          <ProfileBlock title="Experience">
            {profile.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{e.role} — {e.company}</p>
                <p style={{ color: '#9ca3af', fontSize: 12.5, marginBottom: 5 }}>{e.duration}</p>
                {e.highlights?.map((h, j) => (
                  <p key={j} style={{ color: '#4b5563', fontSize: 13, marginBottom: 2 }}>• {h}</p>
                ))}
              </div>
            ))}
          </ProfileBlock>
        )}

        {profile.projects?.length > 0 && (
          <ProfileBlock title={`Projects (${profile.projects.length})`}>
            {profile.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e4e7f0' }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 4 }}>{p.name}</p>
                <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 8, lineHeight: 1.6 }}>{p.description}</p>
                {p.technologies?.length > 0 && (
                  <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                    {p.technologies.map(t => (
                      <span key={t} style={{ padding:'3px 9px',borderRadius:7,fontSize:11.5,fontWeight:600,background:'#f3f4f6',color:'#374151',border:'1px solid #e4e7f0' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ProfileBlock>
        )}

        {/* Warning note */}
        <div style={{
          padding: '12px 16px', borderRadius: 12,
          background: '#fffbeb', border: '1px solid #fde68a',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <p style={{ color: '#92400e', fontSize: 13, lineHeight: 1.6 }}>
            If any information looks incorrect or incomplete, re-upload your resume before starting.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileBlock({ title, children }) {
  return (
    <div>
      <p style={{
        fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#9ca3af',
        marginBottom: 10,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const paramMode    = searchParams.get('mode')    || location.state?.mode    || null;
  const paramRole    = searchParams.get('role')    || location.state?.role    || '';
  const paramCompany = searchParams.get('company') || location.state?.company || '';

  const [resumeFile,    setResumeFile]    = useState(null);
  const [targetRole,    setTargetRole]    = useState(paramRole);
  const [targetCompany, setTargetCompany] = useState(paramCompany);
  const [mode,          setMode]          = useState(paramMode);
  const [uploadError,   setUploadError]   = useState(null);

  useEffect(() => {
    if (paramMode)    setMode(prev => prev || paramMode);
    if (paramRole)    setTargetRole(prev => prev || paramRole);
    if (paramCompany) setTargetCompany(prev => prev || paramCompany);
  }, [paramMode, paramRole, paramCompany]);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError,  setExtractError]  = useState(null);
  const [resumeProfile, setResumeProfile] = useState(null);
  const [isCreating,   setIsCreating]   = useState(false);

  const canStart  = resumeFile && targetRole.trim() && targetCompany.trim() && mode;
  const hasProfile = !!resumeProfile;

  function onFile(f)  { setResumeFile(f);    setUploadError(null); setResumeProfile(null); setExtractError(null); }
  function onFileErr(msg) { setUploadError(msg); setResumeFile(null); setResumeProfile(null); }

  async function doExtract() {
    if (!canStart) return;
    setIsExtracting(true); setExtractError(null); setResumeProfile(null);
    try {
      const r = await extractResume(resumeFile);
      setResumeProfile(r.profile);
    } catch (e) {
      setExtractError(e.message || 'Failed to extract resume. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  }

  async function doStart() {
    if (!resumeProfile) return;
    setIsCreating(true);
    try {
      const r = await createInterview({ targetRole: targetRole.trim(), targetCompany: targetCompany.trim(), mode, resumeProfile });
      navigate(`/interview/${r.interviewId}`);
    } catch (e) {
      setExtractError(e.message || 'Failed to start interview. Please try again.');
      setIsCreating(false);
    }
  }

  // Checklist items
  const checks = [
    { label: 'Resume uploaded',  done: !!resumeFile },
    { label: 'Role specified',   done: !!targetRole.trim() },
    { label: 'Company specified',done: !!targetCompany.trim() },
    { label: 'Mode selected',    done: !!mode },
  ];
  const allDone = checks.every(c => c.done);

  return (
    <div style={{ minHeight: 'calc(100vh - 62px)', background: '#f7f8fd', padding: '40px 24px 80px', animation: 'fadeUp 350ms ease both' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Page Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#eef2ff', border: '1px solid #c7d2fe',
            padding: '5px 14px', borderRadius: 9999,
            fontSize: 12.5, fontWeight: 700, color: '#4338ca',
            marginBottom: 14,
          }}>
            ✨ AI-Powered Mock Interview
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#111827', marginBottom: 10 }}>
            Set Up Your Interview
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15.5, maxWidth: 460, margin: '0 auto' }}>
            Fill in the details below and the AI will conduct a personalized mock interview just for you.
          </p>
        </div>

        {/* ── Resume ── */}
        <Section number="1" title="Upload Your Resume" subtitle="PDF only · Max 5 MB — AI will extract your skills, projects & experience" done={!!resumeFile}>
          <ResumeUpload file={resumeFile} onFileSelect={onFile} onError={onFileErr} disabled={isExtracting}/>
          {uploadError && (
            <div style={{ marginTop:12,padding:'10px 14px',borderRadius:10,background:'#fef2f2',border:'1px solid #fecaca',display:'flex',alignItems:'center',gap:8 }}>
              <span>⚠️</span>
              <p style={{ color:'#b91c1c',fontSize:13 }}>{uploadError}</p>
            </div>
          )}
        </Section>

        {/* ── Role ── */}
        <Section number="2" title="Target Role" subtitle="What position are you interviewing for?" done={!!targetRole.trim()}>
          <TextInput
            id="target-role"
            placeholder="e.g. Software Engineer, Frontend Developer, Data Analyst"
            value={targetRole}
            onChange={setTargetRole}
            disabled={isExtracting}
          />
          <div style={{ display:'flex',flexWrap:'wrap',gap:7,marginTop:10 }}>
            {['Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer','Data Analyst','ML Engineer'].map(r => (
              <QuickChip key={r} label={r} selected={targetRole === r} onClick={() => setTargetRole(r)}/>
            ))}
          </div>
        </Section>

        {/* ── Company ── */}
        <Section number="3" title="Target Company" subtitle="Which company are you preparing for?" done={!!targetCompany.trim()}>
          <TextInput
            id="target-company"
            placeholder="e.g. Google, Amazon, TCS, Infosys, Startup"
            value={targetCompany}
            onChange={setTargetCompany}
            disabled={isExtracting}
          />
          <div style={{ display:'flex',flexWrap:'wrap',gap:7,marginTop:10 }}>
            {['Google','Amazon','Microsoft','Meta','Flipkart','TCS','Infosys','Startup'].map(c => (
              <QuickChip key={c} label={c} selected={targetCompany === c} onClick={() => setTargetCompany(c)}/>
            ))}
          </div>
        </Section>

        {/* ── Mode ── */}
        <Section number="4" title="Interview Mode" subtitle="Choose the type of interview to practice" done={!!mode}>
          <div style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
            <InterviewModeCard mode="technical" selected={mode === 'technical'} onSelect={() => setMode('technical')}/>
            <InterviewModeCard mode="hr"        selected={mode === 'hr'}        onSelect={() => setMode('hr')}/>
          </div>
        </Section>

        {/* ── ACTION CARD ── */}
        <div style={{
          background: allDone ? '#fff' : '#fff',
          border: `1.5px solid ${allDone ? (hasProfile ? '#a7f3d0' : '#c7d2fe') : '#e4e7f0'}`,
          borderRadius: 18,
          padding: '22px 24px',
          boxShadow: allDone ? '0 4px 16px rgba(79,70,229,0.1)' : '0 2px 8px rgba(17,24,39,0.04)',
          transition: 'all 300ms ease',
        }}>

          {/* Checklist */}
          <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginBottom:20 }}>
            {checks.map(item => (
              <div key={item.label} style={{
                display:'flex',alignItems:'center',gap:7,
                padding:'5px 12px',borderRadius:9999,
                background: item.done ? '#ecfdf5' : '#f3f4f6',
                border:`1px solid ${item.done ? '#a7f3d0' : '#e4e7f0'}`,
              }}>
                <span style={{ fontSize:13 }}>{item.done ? '✅' : '○'}</span>
                <span style={{ fontSize:12.5,fontWeight:600,color: item.done ? '#047857' : '#9ca3af' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Error */}
          {extractError && (
            <div style={{ marginBottom:16,padding:'12px 16px',borderRadius:12,background:'#fef2f2',border:'1px solid #fecaca',display:'flex',alignItems:'center',gap:8 }}>
              <span>⚠️</span>
              <p style={{ color:'#b91c1c',fontSize:13 }}>{extractError}</p>
            </div>
          )}

          {/* Status row + CTA */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap' }}>
            <div>
              {isExtracting ? (
                <p style={{ fontWeight:700,fontSize:15,color:'#4f46e5' }}>🔄 Extracting resume with AI...</p>
              ) : hasProfile ? (
                <>
                  <p style={{ fontWeight:700,fontSize:15,color:'#059669',marginBottom:2 }}>✅ Resume extracted — ready to go!</p>
                  <p style={{ color:'#6b7280',fontSize:13 }}>
                    {targetRole} at {targetCompany} · {mode === 'technical' ? '⚡ Technical' : '🤝 HR'} · ~15 questions
                  </p>
                </>
              ) : allDone ? (
                <>
                  <p style={{ fontWeight:700,fontSize:15,color:'#111827',marginBottom:2 }}>✨ All set — extract resume to continue</p>
                  <p style={{ color:'#6b7280',fontSize:13 }}>The AI will read your resume before the interview starts</p>
                </>
              ) : (
                <p style={{ color:'#9ca3af',fontSize:14 }}>Complete all 4 steps above to continue</p>
              )}
            </div>

            {!hasProfile ? (
              <Button size="lg" onClick={doExtract} disabled={!canStart} loading={isExtracting}>
                {isExtracting ? 'Extracting...' : 'Extract & Preview →'}
              </Button>
            ) : (
              <Button size="lg" onClick={doStart} loading={isCreating}>
                🚀 Start Interview
              </Button>
            )}
          </div>
        </div>

        {/* ── Profile Preview ── */}
        {resumeProfile && (
          <div style={{ marginTop: 8 }}>
            <ProfilePreview profile={resumeProfile}/>
          </div>
        )}

      </div>
    </div>
  );
}
