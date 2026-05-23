// video/phone.jsx — iPhone mockup frame + tiny shared UI primitives

const { clamp, Easing, interpolate, animate } = window;

// ─── Brand colors ────────────────────────────────────────────────────────────
const BRAND = {
  blue:    '#2563eb',
  blueDk:  '#1e40af',
  blueLt:  '#eff6ff',
  green:   '#10b981',
  greenDk: '#059669',
  greenLt: '#f0fdf4',
  ink:     '#0f172a',
  ink2:    '#334155',
  muted:   '#64748b',
  mute2:   '#94a3b8',
  line:    '#e2e8f0',
  bg:      '#f1f5f9',
  amber:   '#f59e0b',
  amberLt: '#fffbeb',
};

// ─── Phone Frame ─────────────────────────────────────────────────────────────
// A clean iPhone-style frame. Children render inside the screen area.
function Phone({ children, scale = 1, shadow = true }) {
  // Outer device size at scale=1 (matches design of internal screens at 390x844)
  const W = 410, H = 860;

  return (
    <div style={{
      width: W, height: H,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      position: 'relative',
    }}>
      {/* Outer body */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 58,
        background: 'linear-gradient(180deg, #1c2433 0%, #0b1220 100%)',
        boxShadow: shadow
          ? '0 60px 120px rgba(0,0,0,0.45), 0 25px 50px rgba(0,0,0,0.35), inset 0 0 0 2px #2a3346, inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'inset 0 0 0 2px #2a3346',
        padding: 10,
      }}>
        {/* Inner bezel */}
        <div style={{
          position: 'absolute', inset: 10,
          borderRadius: 50,
          background: '#000',
          padding: 8,
        }}>
          {/* Screen */}
          <div style={{
            position: 'absolute', inset: 8,
            borderRadius: 44,
            background: '#fff',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Status bar */}
            <div style={{
              height: 44, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 28px',
              fontSize: 14, fontWeight: 600, color: BRAND.ink,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              flexShrink: 0, position: 'relative', zIndex: 5,
            }}>
              <span>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Signal */}
                <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.5" fill={BRAND.ink}/><rect x="4" y="5" width="3" height="6" rx="0.5" fill={BRAND.ink}/><rect x="8" y="3" width="3" height="8" rx="0.5" fill={BRAND.ink}/><rect x="12" y="0" width="3" height="11" rx="0.5" fill={BRAND.ink}/></svg>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M7.5 10.5l1.5-1.5a2.12 2.12 0 0 0-3 0L7.5 10.5zM4.5 7.5l1-1a4.24 4.24 0 0 1 6 0l1-1a5.66 5.66 0 0 0-8 0l0 2zM1.5 4.5l1-1a8.49 8.49 0 0 1 12 0l1-1a9.9 9.9 0 0 0-14 0l0 2z" fill={BRAND.ink}/></svg>
                {/* Battery */}
                <svg width="26" height="11" viewBox="0 0 26 11"><rect x="0.5" y="0.5" width="22" height="10" rx="2.5" fill="none" stroke={BRAND.ink} strokeOpacity="0.4"/><rect x="2" y="2" width="19" height="7" rx="1.5" fill={BRAND.ink}/><rect x="23" y="3.5" width="2" height="4" rx="1" fill={BRAND.ink} fillOpacity="0.4"/></svg>
              </div>
            </div>

            {/* Dynamic island */}
            <div style={{
              position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
              width: 125, height: 36, borderRadius: 20, background: '#000', zIndex: 6,
            }} />

            {/* Content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cursor (animated) ───────────────────────────────────────────────────────
function Cursor({ x, y, pressed = false, opacity = 1, scale = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-12px, -10px) scale(${scale * (pressed ? 0.85 : 1)})`,
      opacity, pointerEvents: 'none', zIndex: 200,
      transition: 'none',
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))',
      willChange: 'transform, opacity',
    }}>
      {/* Cursor shape */}
      <svg width="32" height="36" viewBox="0 0 32 36">
        <path d="M5 3 L5 28 L12 22 L16 31 L20 29 L16 20 L25 20 Z"
          fill="#fff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
      {/* Tap ripple */}
      {pressed && (
        <div style={{
          position: 'absolute', left: -8, top: -6, width: 50, height: 50,
          borderRadius: '50%', border: '3px solid rgba(37, 99, 235, 0.55)',
          animation: 'none',
        }} />
      )}
    </div>
  );
}

// ─── Simple Icon helpers (inline SVG, no library) ────────────────────────────
const Icon = {
  Plus: (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chev: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Camera:(p) => <svg width={p.size||22} height={p.size||22} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Check: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCircle: (p) => <svg width={p.size||22} height={p.size||22} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Sparkle: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill={p.color||'currentColor'}><path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z"/></svg>,
  File:  (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Pen:   (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Clock: (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ─── Brand logo ──────────────────────────────────────────────────────────────
function Logo({ size = 36, color = '#fff' }) {
  return (
    <span style={{
      fontSize: size, fontWeight: 800, letterSpacing: -1.2,
      color: BRAND.blue, fontFamily: 'Plus Jakarta Sans, sans-serif',
      display: 'inline-flex', alignItems: 'baseline', gap: 2,
    }}>
      <span style={{ color: color === '#fff' ? '#fff' : BRAND.blue }}>Rapid</span>
      <span style={{ color: BRAND.green }}>Act</span>
      <span style={{ color: BRAND.mute2, fontSize: size * 0.55, fontWeight: 600 }}>.ro</span>
    </span>
  );
}

Object.assign(window, { Phone, Cursor, Icon, Logo, BRAND });
