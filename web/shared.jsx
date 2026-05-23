// web/shared.jsx — icons + shared web UI primitives

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const WS = ({ size=18, color, className='', sw=1.75, children, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color||'currentColor'} strokeWidth={sw} strokeLinecap="round"
    strokeLinejoin="round" className={className} {...r}>{children}</svg>
);
const WHomeIcon      = p => <WS {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></WS>;
const WFileIcon      = p => <WS {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></WS>;
const WPackageIcon   = p => <WS {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></WS>;
const WArchiveIcon   = p => <WS {...p}><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></WS>;
const WUsersIcon     = p => <WS {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></WS>;
const WSettingsIcon  = p => <WS {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></WS>;
const WPlusIcon      = p => <WS {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></WS>;
const WChevRightIcon = p => <WS {...p}><polyline points="9 18 15 12 9 6"/></WS>;
const WChevDownIcon  = p => <WS {...p}><polyline points="6 9 12 15 18 9"/></WS>;
const WSearchIcon    = p => <WS {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></WS>;
const WDownloadIcon  = p => <WS {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></WS>;
const WMailIcon      = p => <WS {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></WS>;
const WMenuIcon      = p => <WS {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></WS>;
const WBellIcon      = p => <WS {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></WS>;
const WLogOutIcon    = p => <WS {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></WS>;
const WCheckIcon     = p => <WS {...p}><polyline points="20 6 9 17 4 12"/></WS>;
const WKeyIcon       = p => <WS {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></WS>;
const WShieldIcon    = p => <WS {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></WS>;
const WBuildingIcon  = p => <WS {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></WS>;
const WEditIcon      = p => <WS {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></WS>;
const WTrashIcon     = p => <WS {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></WS>;
const WSpinnerIcon   = p => <WS {...p} style={{ animation: 'wspin 0.75s linear infinite', ...(p.style||{}) }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></WS>;
const WCopyIcon      = p => <WS {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></WS>;

// ─── Avatar ───────────────────────────────────────────────────────────────────
function WAvatar({ name, size=32, from='#2563eb', to='#10b981' }) {
  const initials = (name||'?').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg,${from},${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: Math.round(size*0.36), fontWeight: 700 }}>
      {initials}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const WSTATUS = {
  signed:    { label: 'Semnat',  bg: '#dcfce7', color: '#166534' },
  generated: { label: 'Generat', bg: '#dbeafe', color: '#1e40af' },
  draft:     { label: 'Ciornă',  bg: '#f1f5f9', color: '#475569' },
  archived:  { label: 'Arhivat', bg: '#f1f5f9', color: '#64748b' },
  expired:   { label: 'Expirat', bg: '#fee2e2', color: '#dc2626' },
};
function WStatusBadge({ status }) {
  const s = WSTATUS[status] ?? WSTATUS.draft;
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>;
}

// ─── Role badge ───────────────────────────────────────────────────────────────
const WROLES = {
  admin:    { label: 'Admin',    bg: '#fae8ff', color: '#7c3aed' },
  manager:  { label: 'Manager',  bg: '#dbeafe', color: '#1e40af' },
  operator: { label: 'Operator', bg: '#f1f5f9', color: '#475569' },
};
function WRoleBadge({ role }) {
  const r = WROLES[role] ?? WROLES.operator;
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: r.bg, color: r.color, fontSize: 12, fontWeight: 600 }}>{r.label}</span>;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color='#2563eb', icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 2 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Primary button ────────────────────────────────────────────────────────────
function WBtn({ children, onClick, bg='#2563eb', size='md', disabled=false, style={} }) {
  const pad = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px';
  const fs  = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, borderRadius: 8, border: 'none', background: disabled ? '#cbd5e1' : bg, color: '#fff', fontWeight: 600, fontSize: fs, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', fontFamily: 'inherit', ...style }}>
      {children}
    </button>
  );
}

// ─── Ghost button ─────────────────────────────────────────────────────────────
function WGhostBtn({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 500, fontSize: 13, cursor: 'pointer', transition: 'background 0.1s', fontFamily: 'inherit', ...style }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
      {children}
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function WSectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h2>
      {action}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function WInput({ value, onChange, placeholder, type='text', icon, style: extraStyle={} }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {icon && <div style={{ position: 'absolute', left: 10, color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>{icon}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ padding: `8px ${icon ? '12px 8px 32px' : '12px'}`, border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`, borderRadius: 8, background: '#fff', outline: 'none', fontSize: 13, fontFamily: 'inherit', boxShadow: focused ? '0 0 0 3px #dbeafe' : 'none', transition: 'all 0.15s', ...extraStyle }} />
    </div>
  );
}

Object.assign(window, {
  WS, WHomeIcon, WFileIcon, WPackageIcon, WArchiveIcon, WUsersIcon, WSettingsIcon,
  WPlusIcon, WChevRightIcon, WChevDownIcon, WSearchIcon, WDownloadIcon, WMailIcon,
  WMenuIcon, WBellIcon, WLogOutIcon, WCheckIcon, WKeyIcon, WShieldIcon, WBuildingIcon,
  WEditIcon, WTrashIcon, WSpinnerIcon, WCopyIcon,
  WAvatar, WStatusBadge, WRoleBadge, StatCard, WBtn, WGhostBtn, WSectionHeader, WInput,
});
