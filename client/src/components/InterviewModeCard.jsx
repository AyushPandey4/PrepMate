import { useState } from 'react';

const DATA = {
  technical: {
    icon: '⚡',
    gradient: 'linear-gradient(140deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)',
    accentColor:  '#4f46e5',
    accentBg:     '#eef2ff',
    accentBorder: '#c7d2fe',
    selectedBorder: '#4f46e5',
    title: 'Technical Interview',
    subtitle: 'Engineering & Development Roles',
    description: 'Deep-dive into your projects, tech stack, algorithms, system design, and programming concepts — tailored to your resume and target role.',
    topics: ['Algorithms & Data Structures', 'System Design', 'Project Architecture', 'OOP & Programming', 'DBMS, OS, Networking', 'Your tech stack'],
    tagBg: '#e0e7ff',
    tagColor: '#3730a3',
  },
  hr: {
    icon: '🤝',
    gradient: 'linear-gradient(140deg, #c2410c 0%, #f97316 55%, #fb923c 100%)',
    accentColor:  '#ea580c',
    accentBg:     '#fff7ed',
    accentBorder: '#fed7aa',
    selectedBorder: '#f97316',
    title: 'HR & Behavioral',
    subtitle: 'Behavioral & Communication Focus',
    description: 'Practice the STAR method, leadership stories, conflict resolution, and culture-fit answers with adaptive AI follow-ups on your real answers.',
    topics: ['Introduction & career story', 'Strengths & weaknesses', 'Leadership & teamwork', 'Conflict resolution', 'Role & company motivation', 'STAR behavioral questions'],
    tagBg: '#ffedd5',
    tagColor: '#9a3412',
  },
};

export default function InterviewModeCard({ mode, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const d = DATA[mode];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      style={{
        flex: 1, minWidth: 260,
        borderRadius: 18,
        border: `2px solid ${selected ? d.selectedBorder : hov ? d.accentBorder : '#e4e7f0'}`,
        background: selected ? d.accentBg : '#fff',
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        transform: selected || hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: selected
          ? `0 8px 24px -4px ${d.accentColor}33`
          : hov
          ? '0 8px 24px rgba(17,24,39,0.1)'
          : '0 2px 6px rgba(17,24,39,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Color top stripe */}
      <div style={{
        height: 4,
        background: d.gradient,
        opacity: selected ? 1 : hov ? 0.7 : 0.4,
        transition: 'opacity 200ms ease',
      }}/>

      <div style={{ padding: '22px 22px 24px' }}>
        {/* Selected badge */}
        {selected && (
          <div style={{
            position:'absolute', top:16, right:16,
            width:24,height:24,borderRadius:'50%',
            background: d.accentColor,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:13,fontWeight:700,color:'#fff',
            boxShadow:`0 2px 8px ${d.accentColor}55`,
          }}>✓</div>
        )}

        {/* Icon + Title */}
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:14 }}>
          <div style={{
            width:48,height:48,borderRadius:14,
            background: selected ? `${d.accentColor}18` : d.accentBg,
            border:`1.5px solid ${selected ? d.accentBorder : '#e4e7f0'}`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:24,transition:'200ms ease',flexShrink:0,
          }}>
            {d.icon}
          </div>
          <div>
            <h3 style={{ fontWeight:800,fontSize:16,color:'#111827',marginBottom:2,letterSpacing:'-0.02em' }}>
              {d.title}
            </h3>
            <p style={{ color:'#9ca3af',fontSize:12,fontWeight:600 }}>{d.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p style={{ color:'#4b5563',fontSize:13.5,lineHeight:1.65,marginBottom:16 }}>
          {d.description}
        </p>

        {/* Topic chips */}
        <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
          {d.topics.map(t => (
            <span key={t} style={{
              padding:'3px 10px',borderRadius:7,fontSize:12,fontWeight:600,
              background: selected ? d.tagBg : '#f3f4f6',
              color: selected ? d.tagColor : '#6b7280',
              border:`1px solid ${selected ? d.accentBorder : '#e4e7f0'}`,
              transition:'all 200ms ease',
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
