// proto/shared.jsx — icons + UI primitives

// ─── SVG Icon factory ────────────────────────────────────────────────────────
const Svg = ({ size=20, color, style, className='', sw=2, children, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color||'currentColor'} strokeWidth={sw} strokeLinecap="round"
    strokeLinejoin="round" style={style} className={className} {...r}>
    {children}
  </svg>
);

const HomeIcon     = p => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>;
const PackageIcon  = p => <Svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></Svg>;
const ArchiveIcon  = p => <Svg {...p}><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></Svg>;
const UserIcon     = p => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
const PlusIcon     = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const ChevRightIcon= p => <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>;
const ChevLeftIcon = p => <Svg {...p}><polyline points="15 18 9 12 15 6"/></Svg>;
const CameraIcon   = p => <Svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Svg>;
const UploadIcon   = p => <Svg {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></Svg>;
const CheckCircleIcon = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const AlertCircleIcon = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const FileTextIcon = p => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>;
const LogOutIcon   = p => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const Building2Icon= p => <Svg {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></Svg>;
const CreditCardIcon=p => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>;
const ShieldIcon   = p => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>;
const CheckIcon    = p => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>;
const EyeIcon      = p => <Svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Svg>;
const EyeOffIcon   = p => <Svg {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></Svg>;
const SpinnerIcon  = p => <Svg {...p} className={`animate-spin ${p.className||''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Svg>;
const DownloadIcon = p => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const EditIcon     = p => <Svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
const GearIcon     = p => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>;

// ─── AppFrame ────────────────────────────────────────────────────────────────
function AppFrame({ children }) {
  return (
    <div style={{
      maxWidth: 420, margin: '20px auto',
      background: '#fff', minHeight: 'calc(100vh - 40px)',
      borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.10)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {children}
    </div>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Acasă',  Icon: HomeIcon },
  { id: 'history',   label: 'Arhivă', Icon: ArchiveIcon },
  { id: 'assets',    label: 'Active', Icon: PackageIcon },
  { id: 'settings',  label: 'Profil', Icon: UserIcon },
];

function BottomNav({ active, navigate }) {
  return (
    <nav style={{ display: 'flex', borderTop: '1px solid #e2e8f0', background: '#fff', flexShrink: 0 }}>
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => navigate(id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 8, paddingBottom: 10, border: 'none', background: 'none',
          color: active === id ? '#2563eb' : '#94a3b8',
          fontSize: 11, fontWeight: 500, gap: 2, cursor: 'pointer',
          transition: 'color 0.15s',
        }}>
          <Icon size={22} />
          {label}
        </button>
      ))}
    </nav>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  signed:    { label: 'Semnat',   bg: '#dcfce7', color: '#166534' },
  generated: { label: 'Generat',  bg: '#dbeafe', color: '#1e40af' },
  draft:     { label: 'Ciornă',   bg: '#f1f5f9', color: '#475569' },
  archived:  { label: 'Arhivat',  bg: '#f1f5f9', color: '#64748b' },
  expired:   { label: 'Expirat',  bg: '#fee2e2', color: '#dc2626' },
  uploaded:  { label: 'Încărcat', bg: '#f3e8ff', color: '#6b21a8' },
};
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, size=40, from='#2563eb', to='#10b981' }) {
  const initials = (name||'?').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${from}, ${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: Math.round(size*0.35), fontWeight: 700,
    }}>{initials}</div>
  );
}

// ─── Step progress bar ───────────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = ['Template', 'Scanează CI', 'Completează', 'Preview'];
  return (
    <div style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, fontWeight: 700,
                background: i < current ? '#10b981' : i === current ? '#2563eb' : '#f1f5f9',
                color: i <= current ? '#fff' : '#94a3b8', transition: 'all 0.2s',
              }}>{i < current ? '✓' : i+1}</div>
              <span style={{
                fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
                color: i === current ? '#2563eb' : i < current ? '#10b981' : '#94a3b8',
              }}>{s}</span>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex: 1, height: 1, background: i < current ? '#6ee7b7' : '#e2e8f0', margin: '0 5px' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ size=22 }) {
  return (
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.5, color: '#2563eb' }}>
      RapidAct<span style={{ color: '#10b981' }}>.ro</span>
    </span>
  );
}

// ─── Field input ─────────────────────────────────────────────────────────────
function FieldInput({ field, value, onChange, confidence }) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = focused
    ? (confidence === 'uncertain' ? '#f59e0b' : confidence === 'missing' ? '#ef4444' : '#2563eb')
    : (confidence === 'uncertain' ? '#fbbf24' : confidence === 'missing' ? '#fca5a5' : '#e2e8f0');
  const bg = confidence === 'uncertain' ? '#fffbeb' : confidence === 'missing' ? '#fef2f2' : '#fff';
  const shadow = focused ? `0 0 0 3px ${confidence === 'uncertain' ? '#fef3c7' : confidence === 'missing' ? '#fee2e2' : '#dbeafe'}` : 'none';

  const baseStyle = {
    width: '100%', padding: '11px 13px', border: `1.5px solid ${borderColor}`,
    borderRadius: 10, background: bg, outline: 'none', fontSize: 14,
    boxShadow: shadow, transition: 'border-color 0.15s, box-shadow 0.15s', color: '#0f172a',
  };

  if (field.type === 'select' && field.options) {
    return (
      <select value={value} onChange={e=>onChange(e.target.value)}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ ...baseStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
        <option value="">— Selectează —</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (field.type === 'textarea') {
    return (
      <textarea value={value} onChange={e=>onChange(e.target.value)}
        placeholder={field.placeholder} rows={3}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ ...baseStyle, resize: 'none', fontFamily: 'inherit' }} />
    );
  }
  const inputType = field.type === 'date' ? 'date' : field.type === 'datetime' ? 'datetime-local' : field.type === 'number' ? 'number' : 'text';
  return (
    <input type={inputType} value={value} onChange={e=>onChange(e.target.value)}
      placeholder={field.placeholder}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={baseStyle} />
  );
}

// ─── Primary button ──────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, disabled=false, bg='#2563eb', style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '14px', borderRadius: 12, background: disabled ? '#cbd5e1' : bg,
      color: '#fff', fontWeight: 600, fontSize: 15, border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', ...style,
    }}>{children}</button>
  );
}

// ─── Secondary button ─────────────────────────────────────────────────────────
function SecondaryBtn({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '12px', borderRadius: 12,
      border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569',
      fontWeight: 500, fontSize: 14, cursor: 'pointer', transition: 'background 0.1s', ...style,
    }}>{children}</button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 10 }}>
      {children}
    </p>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ size=40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `${Math.max(3, size*0.08)}px solid #e2e8f0`,
      borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite',
    }} />
  );
}

Object.assign(window, {
  Svg, HomeIcon, PackageIcon, ArchiveIcon, UserIcon, PlusIcon,
  ChevRightIcon, ChevLeftIcon, CameraIcon, UploadIcon, CheckCircleIcon,
  AlertCircleIcon, FileTextIcon, LogOutIcon, Building2Icon, CreditCardIcon,
  ShieldIcon, CheckIcon, EyeIcon, EyeOffIcon, SpinnerIcon, DownloadIcon,
  EditIcon, GearIcon,
  AppFrame, BottomNav, StatusBadge, Avatar, StepBar, Logo,
  FieldInput, PrimaryBtn, SecondaryBtn, SectionLabel, Spinner,
});
