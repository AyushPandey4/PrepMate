import { useState, useRef } from 'react';

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export default function ResumeUpload({ file, onFileSelect, onError, disabled = false }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function process(f) {
    if (!f) return;
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    if (!isPdf)          { onError('Only PDF files are accepted. Please upload a .pdf resume.'); return; }
    if (f.size > MAX_BYTES) { onError(`File too large (${(f.size/1024/1024).toFixed(1)} MB). Max is ${MAX_MB} MB.`); return; }
    onFileSelect(f);
  }

  const onDragOver  = (e) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setDragging(false); };
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); if (!disabled) process(e.dataTransfer.files[0]); };
  const onInput     = (e) => { process(e.target.files[0]); e.target.value = ''; };
  const onClick     = ()  => { if (!disabled) inputRef.current?.click(); };
  const onRemove    = (e) => { e.stopPropagation(); onFileSelect(null); };

  const hasBorder = dragging ? '#4f46e5' : file ? '#059669' : '#c8cedf';
  const hasBg     = dragging ? '#eef2ff' : file ? '#f0fdf4' : '#fafbff';

  return (
    <>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf"
        onChange={onInput} style={{ display:'none' }} aria-label="Upload resume PDF"/>

      <div
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button" tabIndex={disabled ? -1 : 0}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        aria-label="Upload your resume as a PDF"
        style={{
          border: `2px dashed ${hasBorder}`,
          borderRadius: 16,
          padding: '32px 24px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: hasBg,
          transition: 'all 200ms ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {file ? (
          /* File selected */
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:12 }}>
            <div style={{
              width:52,height:52,borderRadius:14,
              background:'#d1fae5',border:'1.5px solid #a7f3d0',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,
            }}>📄</div>
            <div>
              <p style={{ fontWeight:700,fontSize:15,color:'#047857',marginBottom:3 }}>{file.name}</p>
              <p style={{ color:'#6b7280',fontSize:13 }}>{(file.size/1024/1024).toFixed(2)} MB · PDF</p>
            </div>
            <button onClick={onRemove} style={{
              background:'#fef2f2',color:'#dc2626',
              border:'1.5px solid #fecaca',padding:'6px 18px',
              borderRadius:8,fontSize:12.5,fontWeight:600,cursor:'pointer',
              transition:'150ms ease',fontFamily:'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background='#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background='#fef2f2'}
            >Remove</button>
          </div>
        ) : (
          /* Empty / dragging */
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:12 }}>
            <div style={{
              width:56,height:56,borderRadius:16,
              background: dragging ? '#e0e7ff' : '#eef2ff',
              border:`1.5px solid ${dragging ? '#a5b4fc' : '#c7d2fe'}`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:26,transition:'all 200ms ease',
              transform: dragging ? 'scale(1.08)' : 'scale(1)',
            }}>
              {dragging ? '📂' : '📎'}
            </div>
            <div>
              <p style={{ fontWeight:700,fontSize:15,color:'#111827',marginBottom:4 }}>
                {dragging ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p style={{ color:'#6b7280',fontSize:13 }}>
                Drag & drop or{' '}
                <span style={{ color:'#4f46e5',fontWeight:700 }}>browse files</span>
              </p>
            </div>
            <span style={{
              color:'#9ca3af',fontSize:12,fontWeight:500,
              background:'#f3f4f6',padding:'4px 14px',borderRadius:9999,
              border:'1px solid #e4e7f0',
            }}>
              PDF only · Max {MAX_MB} MB
            </span>
          </div>
        )}
      </div>
    </>
  );
}
