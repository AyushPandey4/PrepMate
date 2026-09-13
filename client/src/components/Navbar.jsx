import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function doSignOut() {
    setSigningOut(true);
    try { await signOut(); setShowModal(false); navigate('/'); }
    catch { setSigningOut(false); }
  }

  const avatarUrl   = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const firstName   = displayName.split(' ')[0];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 62,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e4e7f0',
        boxShadow: '0 1px 3px rgba(17,24,39,0.05)',
      }}>
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/'} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <img
            src="/prepmate_logo.png"
            alt="PrepMate Logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing:'-0.04em', color:'#111827' }}>
            Prep<span style={{ color:'#4f46e5' }}>Mate</span>
          </span>
        </Link>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/interview/setup">Practice</NavLink>

              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    background:'#fff', border:'1.5px solid #e4e7f0',
                    borderRadius: 9999, padding:'4px 12px 4px 5px',
                    cursor:'pointer', transition:'all 150ms ease',
                    boxShadow:'0 1px 3px rgba(17,24,39,0.06)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#c8cedf'; e.currentTarget.style.boxShadow='0 2px 6px rgba(17,24,39,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#e4e7f0'; e.currentTarget.style.boxShadow='0 1px 3px rgba(17,24,39,0.06)'; }}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt={firstName} style={{ width:26,height:26,borderRadius:'50%',objectFit:'cover' }}/>
                    : <div style={{ width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff' }}>{firstName[0]?.toUpperCase()}</div>
                  }
                  <span style={{ fontSize:13.5, fontWeight:600, color:'#374151' }}>{firstName}</span>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    style={{ color:'#9ca3af', transform: menuOpen?'rotate(180deg)':'rotate(0)', transition:'150ms ease' }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {menuOpen && (
                  <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'#fff', border:'1.5px solid #e4e7f0', borderRadius:14,
                    padding:8, minWidth:210,
                    boxShadow:'0 12px 32px rgba(17,24,39,0.12)',
                    zIndex:200, animation:'scaleIn 140ms ease both',
                  }}>
                    <div style={{ padding:'10px 12px', borderBottom:'1px solid #f3f4f6', marginBottom:6 }}>
                      <p style={{ fontSize:13.5, fontWeight:700, color:'#111827' }}>{displayName}</p>
                      <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); setShowModal(true); }}
                      style={{ width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:8,background:'transparent',border:'none',color:'#ef4444',fontSize:13,fontWeight:600,cursor:'pointer',transition:'150ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >↩ Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <a href="#features" style={{ color: '#6b7280', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', transition: '150ms ease' }}
                onMouseEnter={e => e.target.style.color = '#111827'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}>Features</a>
              <a href="#how-it-works" style={{ color: '#6b7280', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', transition: '150ms ease' }}
                onMouseEnter={e => e.target.style.color = '#111827'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}>How It Works</a>
              <a href="#modes" style={{ color: '#6b7280', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', transition: '150ms ease' }}
                onMouseEnter={e => e.target.style.color = '#111827'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}>Interview Modes</a>
            </div>
          )}
        </div>
        {menuOpen && <div style={{ position:'fixed',inset:0,zIndex:150 }} onClick={() => setMenuOpen(false)}/>}
      </nav>

      {/* Sign Out Modal */}
      {showModal && (
        <div style={{ position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20,background:'rgba(17,24,39,0.4)',backdropFilter:'blur(6px)',animation:'fadeIn 140ms ease' }}
          onClick={() => { if (!signingOut) setShowModal(false); }}>
          <div style={{ background:'#fff',borderRadius:20,padding:'28px 26px',maxWidth:400,width:'100%',boxShadow:'0 20px 48px rgba(17,24,39,0.18)',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',animation:'scaleIn 160ms ease both' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:52,height:52,borderRadius:16,background:'#fef2f2',border:'1.5px solid #fecaca',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:16 }}>↩</div>
            <h3 style={{ fontSize:19,fontWeight:800,color:'#111827',marginBottom:8,letterSpacing:'-0.03em' }}>Sign out of PrepMate?</h3>
            <p style={{ fontSize:14,color:'#6b7280',lineHeight:1.6,marginBottom:24,maxWidth:300 }}>You can sign back in anytime. Your sessions and feedback reports will all be saved.</p>
            <div style={{ display:'flex',gap:10,width:'100%' }}>
              <button disabled={signingOut} onClick={() => setShowModal(false)} style={{ flex:1,padding:'11px',borderRadius:12,border:'1.5px solid #e4e7f0',background:'#fff',color:'#374151',fontSize:14,fontWeight:600,cursor:'pointer',transition:'150ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.borderColor='#c8cedf'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e4e7f0'; }}
              >Cancel</button>
              <button disabled={signingOut} onClick={doSignOut} style={{ flex:1,padding:'11px',borderRadius:12,border:'none',background:'#dc2626',color:'#fff',fontSize:14,fontWeight:700,cursor:signingOut?'not-allowed':'pointer',opacity:signingOut?0.7:1,boxShadow:'0 4px 14px rgba(220,38,38,0.3)',transition:'150ms ease' }}
                onMouseEnter={e => { if(!signingOut) e.currentTarget.style.background='#b91c1c'; }}
                onMouseLeave={e => { if(!signingOut) e.currentTarget.style.background='#dc2626'; }}
              >{signingOut ? 'Signing out...' : 'Yes, Sign Out'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{ color:'#6b7280',fontSize:14,fontWeight:600,textDecoration:'none',transition:'150ms ease',letterSpacing:'-0.01em' }}
      onMouseEnter={e => e.target.style.color='#111827'}
      onMouseLeave={e => e.target.style.color='#6b7280'}
    >{children}</Link>
  );
}
