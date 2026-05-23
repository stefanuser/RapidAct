// video/screens.jsx — phone screens (Dashboard, Templates, Scan, Result, Sign, Done)
// Each component renders the inside of a phone screen at 410-padding ≈ 378px wide.

const { BRAND, Icon, Logo, clamp, Easing, interpolate, animate } = window;

// ─── Screen wrapper (full phone-content height) ──────────────────────────────
function Screen({ children, bg = '#fff' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg,
      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
      color: BRAND.ink, fontSize: 14, overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function ScreenHeader({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px 12px', borderBottom: `1px solid ${BRAND.line}`,
      background: '#fff', flexShrink: 0,
    }}>
      <div>
        {sub && <p style={{ fontSize: 12, color: BRAND.mute2 }}>{sub}</p>}
        <p style={{ fontSize: 16, fontWeight: 700 }}>{title}</p>
      </div>
      {action}
    </div>
  );
}

function StepBar({ current }) {
  const steps = ['Template', 'Scanează', 'Date', 'Preview'];
  return (
    <div style={{ borderBottom: `1px solid ${BRAND.line}`, background: '#fff', padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: i < current ? BRAND.green : i === current ? BRAND.blue : BRAND.bg,
                color: i <= current ? '#fff' : BRAND.mute2,
                transition: 'background 0.3s',
              }}>{i < current ? '✓' : i + 1}</div>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: i === current ? BRAND.blue : i < current ? BRAND.greenDk : BRAND.mute2,
              }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < current ? BRAND.green : BRAND.line, opacity: i < current ? 0.6 : 1 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardScreen({ tapHighlight = false }) {
  return (
    <Screen>
      <ScreenHeader
        title="AutoLux SRL 👋"
        sub="Bună,"
        action={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: BRAND.blue, color: '#fff', borderRadius: 10,
            padding: '8px 14px', fontSize: 13, fontWeight: 600,
            transform: tapHighlight ? 'scale(0.96)' : 'scale(1)',
            boxShadow: tapHighlight ? '0 0 0 6px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}>
            <Icon.Plus size={15} color="#fff" /> Nou
          </div>
        }
      />
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: BRAND.mute2, marginBottom: 10 }}>Acțiuni rapide</p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            border: `1.5px solid ${BRAND.line}`, borderRadius: 14, padding: '14px 14px',
            background: '#fff',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: BRAND.green,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Plus size={22} color="#fff" /></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700 }}>Contract nou</p>
              <p style={{ fontSize: 12, color: BRAND.muted }}>Scanează CI, gata în 30 sec</p>
            </div>
            <Icon.Chev color={BRAND.mute2} />
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: BRAND.mute2, marginBottom: 10 }}>Recente</p>
          {[
            { name: 'Ionescu Alexandru', date: '22 mai', status: 'Semnat',  s: 'g' },
            { name: 'Marinescu Cristina',date: '20 mai', status: 'Generat', s: 'b' },
            { name: 'Georgescu Mihai',   date: '18 mai', status: 'Semnat',  s: 'g' },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              border: `1px solid ${BRAND.line}`, borderRadius: 12,
              padding: '10px 12px', marginBottom: 6,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.green})`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>{c.name.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</p>
                <p style={{ fontSize: 11, color: BRAND.muted }}>Închiriere Auto · {c.date}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: c.s === 'g' ? '#dcfce7' : '#dbeafe',
                color: c.s === 'g' ? '#166534' : '#1e40af',
              }}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// ─── TEMPLATE PICKER ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'auto',  icon: '🚗', name: 'Închiriere Auto',       desc: 'Contract predare-primire auto' },
  { id: 'apt',   icon: '🏠', name: 'Închiriere Apartament', desc: 'Locațiune rezidențială',         soon: true },
  { id: 'cim',   icon: '👥', name: 'Contract de Muncă',     desc: 'CIM conform Codul Muncii',       soon: true },
  { id: 'srv',   icon: '📋', name: 'Prestări Servicii',     desc: 'Contract B2B',                   soon: true },
];

function TemplatePickerScreen({ highlight = false }) {
  return (
    <Screen>
      <StepBar current={0} />
      <div style={{ padding: '16px 16px 32px', overflowY: 'hidden' }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Alege contractul</p>
        <p style={{ fontSize: 12, color: BRAND.muted, marginBottom: 16 }}>Apasă pe un contract pentru a-l alege.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TEMPLATES.map((t, i) => {
            const isFirst = i === 0;
            const active = isFirst;
            const lit    = isFirst && highlight;
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: `1.5px solid ${lit ? BRAND.blue : active ? BRAND.line : '#f1f5f9'}`,
                borderRadius: 12, padding: '11px 12px',
                background: lit ? BRAND.blueLt : active ? '#fff' : '#fafafa',
                boxShadow: lit ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                transition: 'all 0.25s',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: active ? BRAND.blueLt : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 21,
                }}>{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: active ? BRAND.ink : BRAND.mute2 }}>{t.name}</p>
                    {t.soon && <span style={{ background: BRAND.bg, color: BRAND.mute2, borderRadius: 5, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>CURÂND</span>}
                  </div>
                  <p style={{ fontSize: 11, color: BRAND.mute2 }}>{t.desc}</p>
                </div>
                {active && (
                  <span style={{
                    background: lit ? BRAND.blueDk : BRAND.blue, color: '#fff',
                    borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700,
                    transform: lit ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.2s',
                  }}>Alege</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─── SCAN MODE PICKER ────────────────────────────────────────────────────────
function ScanPickerScreen({ highlight = false }) {
  const modes = [
    { icon: '🪪', label: 'Act de identitate',     sub: 'CI, pașaport, permis', active: true },
    { icon: '🪪', icon2: '🚗', label: 'CI + Permis',sub: 'Recomandat rent-a-car' },
    { icon: '🪪', icon2: '🏢', label: 'Persoană + Firmă', sub: 'Contracte B2B' },
    { icon: '🏢', label: 'Date firmă (CUI)',       sub: 'Lookup automat ANAF' },
  ];
  return (
    <Screen>
      <StepBar current={1} />
      <div style={{ padding: '16px 16px 32px' }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Scanează acte</p>
        <p style={{ fontSize: 12, color: BRAND.muted, marginBottom: 16 }}>Alege ce documente scanezi.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modes.map((m, i) => {
            const lit = highlight && i === 0;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: `1.5px solid ${lit ? BRAND.blue : BRAND.line}`,
                borderRadius: 12, padding: '12px 14px',
                background: lit ? BRAND.blueLt : '#fff',
                boxShadow: lit ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{ position: 'relative', width: 48, height: 48 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: BRAND.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{m.icon}</div>
                  {m.icon2 && (
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 7, background: '#dbeafe', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{m.icon2}</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</p>
                  <p style={{ fontSize: 11, color: BRAND.muted, marginTop: 1 }}>{m.sub}</p>
                </div>
                <Icon.Chev size={14} color={BRAND.line} />
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─── SCANNING (camera view of CI + AI scanning) ──────────────────────────────
// progress 0..1 — drives the scan bar and progress percentage
function ScanningScreen({ progress = 0 }) {
  const pct = Math.round(progress * 100);
  return (
    <Screen bg="#0b1220">
      {/* Camera viewfinder */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 50%, #1a2238 0%, #0b1220 60%)' }} />

      {/* Top hint */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 600, opacity: 0.9, zIndex: 5 }}>
        Așază CI-ul în chenar
      </div>

      {/* CI Card */}
      <div style={{
        position: 'absolute', left: '50%', top: '52%',
        transform: 'translate(-50%, -50%)',
        width: 290, height: 180, borderRadius: 14,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        {/* CI Header strip */}
        <div style={{ height: 22, background: 'linear-gradient(90deg, #1e3a8a, #1e40af, #f59e0b)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
          <span style={{ color: '#fff', fontSize: 8, fontWeight: 800, letterSpacing: 0.5 }}>ROMÂNIA · CARTE DE IDENTITATE</span>
        </div>
        <div style={{ display: 'flex', padding: 12, gap: 10 }}>
          {/* Photo placeholder */}
          <div style={{
            width: 60, height: 78, borderRadius: 6,
            background: 'repeating-linear-gradient(135deg, #cbd5e1 0 4px, #94a3b8 4px 8px)',
          }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>
              <div style={{ fontSize: 6, color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>NUME</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>IONESCU</div>
            </div>
            <div>
              <div style={{ fontSize: 6, color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>PRENUME</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>ALEXANDRU</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div>
                <div style={{ fontSize: 6, color: '#64748b', fontWeight: 700 }}>CNP</div>
                <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>1850315400123</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div>
                <div style={{ fontSize: 6, color: '#64748b', fontWeight: 700 }}>SERIA</div>
                <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>RX</div>
              </div>
              <div>
                <div style={{ fontSize: 6, color: '#64748b', fontWeight: 700 }}>NR.</div>
                <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>412305</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scanning bar overlay */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: `${progress * 100}%`,
          height: 3, background: BRAND.green,
          boxShadow: `0 0 18px ${BRAND.green}, 0 0 50px ${BRAND.green}`,
          opacity: progress < 1 ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />
        {/* Detected field highlights — appear progressively */}
        {progress > 0.25 && <FieldBox top={48} left={82} w={70} h={14} />}
        {progress > 0.45 && <FieldBox top={66} left={82} w={88} h={12} />}
        {progress > 0.65 && <FieldBox top={102} left={82} w={64} h={10} />}
        {progress > 0.8  && <FieldBox top={123} left={82} w={28} h={10} />}
        {progress > 0.8  && <FieldBox top={123} left={130} w={36} h={10} />}
      </div>

      {/* Corner brackets (viewfinder) */}
      <CornerBrackets />

      {/* AI tag */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 70, transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 99, padding: '10px 18px',
        color: '#fff', fontSize: 13, fontWeight: 600, zIndex: 4,
        whiteSpace: 'nowrap',
      }}>
        <div className="ra-spin" style={{
          width: 14, height: 14, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.2)',
          borderTopColor: BRAND.green,
        }} />
        <span>Analizăm cu AI · <span style={{ color: BRAND.green }}>{pct}%</span></span>
      </div>

      {/* Big shutter (decorative) — only shown when not yet scanning the AI */}
      {progress < 0.05 && (
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 60, borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#fff' }} />
        </div>
      )}
    </Screen>
  );
}

function FieldBox({ top, left, w, h }) {
  return (
    <div style={{
      position: 'absolute', top, left, width: w, height: h,
      border: `1.5px solid ${BRAND.green}`,
      borderRadius: 3,
      boxShadow: `0 0 0 2px rgba(16,185,129,0.18)`,
      animation: 'pulseDot 1s ease-in-out infinite',
    }} />
  );
}

function CornerBrackets() {
  const color = '#fff';
  const sz = 24;
  const corners = [
    { top: 80,  left: 80,  borderTop: `3px solid ${color}`, borderLeft: `3px solid ${color}` },
    { top: 80,  right: 80, borderTop: `3px solid ${color}`, borderRight:`3px solid ${color}` },
    { bottom: 290, left: 80,  borderBottom: `3px solid ${color}`, borderLeft: `3px solid ${color}` },
    { bottom: 290, right: 80, borderBottom: `3px solid ${color}`, borderRight:`3px solid ${color}` },
  ];
  return (
    <>
      {corners.map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: sz, height: sz, ...s, opacity: 0.85, zIndex: 4 }} />
      ))}
    </>
  );
}

// ─── RESULT / AUTO-FILL FORM ─────────────────────────────────────────────────
// fillStep 0..7 — how many fields have been auto-filled so far
function AutoFillScreen({ fillStep = 0 }) {
  const fields = [
    { label: 'Nume',          val: 'Ionescu Alexandru',           src: 'AI',    mono: false },
    { label: 'CNP',           val: '1850315400123',               src: 'AI',    mono: true  },
    { label: 'Serie / Nr CI', val: 'RX 412305',                   src: 'AI',    mono: true  },
    { label: 'Data nașterii', val: '15.03.1985',                  src: 'AI',    mono: true  },
    { label: 'Adresă',        val: 'Str. Florilor 12, București', src: 'AI',    mono: false, warn: true },
    { label: 'Mașină',        val: 'Dacia Logan 2022',            src: 'firmă', mono: false },
    { label: 'Înmatriculare', val: 'B 123 ABC',                   src: 'firmă', mono: true  },
  ];
  return (
    <Screen>
      <StepBar current={2} />
      <div style={{ padding: '12px 14px 24px' }}>
        {/* Success banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: BRAND.greenLt, border: `1px solid #6ee7b7`,
          borderRadius: 11, padding: '10px 12px', marginBottom: 10,
        }}>
          <Icon.CheckCircle size={18} color={BRAND.green} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 12, color: '#065f46', whiteSpace: 'nowrap' }}>Date extrase din CI</p>
            <p style={{ fontSize: 10.5, color: '#059669', marginTop: 1, whiteSpace: 'nowrap' }}>
              {Math.min(fillStep, 5)} câmpuri · GPT-4o · 1.2s
            </p>
          </div>
          <span style={{ background: BRAND.green, color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 800, letterSpacing: 0.3 }}>AI</span>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: BRAND.mute2, marginBottom: 8 }}>Completează datele</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fields.map((f, i) => {
            const filled = i < fillStep;
            const justFilled = i === fillStep - 1;
            const warn = filled && f.warn;
            const borderColor = warn ? '#fbbf24' : filled ? '#86efac' : BRAND.line;
            const bg         = warn ? BRAND.amberLt : filled ? BRAND.greenLt : '#fff';
            return (
              <div key={i} style={{
                position: 'relative',
                padding: '7px 11px 8px',
                border: `1.5px solid ${borderColor}`,
                borderRadius: 10, background: bg,
                transform: justFilled ? 'scale(1.02)' : 'scale(1)',
                boxShadow: justFilled ? '0 4px 16px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.25s',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: warn ? '#92400e' : filled ? BRAND.greenDk : BRAND.mute2,
                  letterSpacing: 0.2, whiteSpace: 'nowrap',
                  textTransform: 'uppercase', marginBottom: 2,
                }}>
                  {f.label}
                </div>
                <div style={{
                  fontSize: 13.5, fontWeight: 700,
                  color: filled ? BRAND.ink : BRAND.mute2,
                  fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'inherit',
                  letterSpacing: f.mono ? 0.3 : -0.1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  paddingRight: filled ? 56 : 0,
                }}>
                  {filled ? f.val : '—'}
                </div>
                {filled && (
                  <div style={{
                    position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 9.5, fontWeight: 800, letterSpacing: 0.3,
                    color: warn ? '#92400e' : BRAND.greenDk,
                    background: warn ? '#fde68a' : '#bbf7d0',
                    borderRadius: 5, padding: '3px 6px',
                  }}>
                    {warn ? '⚠ check' : <><Icon.Check size={9} color={BRAND.greenDk} /> {f.src}</>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─── PREVIEW + SIGNATURE ─────────────────────────────────────────────────────
// signProgress 0..1 — drives the signature stroke draw
function PreviewSignScreen({ signProgress = 0, signed = false }) {
  return (
    <Screen bg="#f8fafc">
      <StepBar current={3} />
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100% - 60px)' }}>
        {/* Mini contract */}
        <div style={{
          flex: 1, background: '#fff', border: `1px solid ${BRAND.line}`, borderRadius: 12,
          padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 8, lineHeight: 1.7,
          color: BRAND.ink2, overflow: 'hidden', position: 'relative',
        }}>
          <p style={{ textAlign: 'center', fontWeight: 800, fontSize: 11, color: BRAND.ink, marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            CONTRACT DE ÎNCHIRIERE AUTO
          </p>
          <p style={{ textAlign: 'center', fontSize: 8, marginBottom: 10 }}>Nr. 124 / 22.05.2026</p>

          <p style={{ fontWeight: 700, marginBottom: 2 }}>I. PĂRȚILE</p>
          <p>LOCATOR: AutoLux SRL, CUI RO12345678,</p>
          <p>reprezentată prin Popescu Ion.</p>
          <p style={{ marginTop: 4 }}>LOCATAR: <b>Ionescu Alexandru</b></p>
          <p>CNP 1850315400123 · CI RX 412305</p>

          <p style={{ fontWeight: 700, marginTop: 6, marginBottom: 2 }}>II. OBIECTUL</p>
          <p>Dacia Logan 2022 · B 123 ABC</p>
          <p>Predare: 22.05.2026, 10:00</p>
          <p>Restituire: 25.05.2026, 18:00</p>

          <p style={{ fontWeight: 700, marginTop: 6, marginBottom: 2 }}>III. PREȚ</p>
          <p>3 zile × 150 RON = 450 RON</p>
          <p>Garanție: 500 RON · CASCO: Inclusă</p>

          {/* Signature line */}
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 12 }}>
            <p style={{ fontSize: 8, color: BRAND.muted, marginBottom: 4 }}>SEMNĂTURĂ LOCATAR</p>
            <div style={{ position: 'relative', height: 32, borderBottom: `1px solid ${BRAND.line}` }}>
              <SignatureSvg progress={signProgress} />
            </div>
          </div>
        </div>

        {/* Sign button */}
        <div style={{
          background: signed ? BRAND.green : BRAND.blue,
          color: '#fff', borderRadius: 12, padding: '14px 16px',
          fontWeight: 700, fontSize: 14, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: signed ? `0 0 0 6px rgba(16,185,129,0.25)` : 'none',
          transition: 'all 0.3s', whiteSpace: 'nowrap',
        }}>
          {signed ? <><Icon.Check size={18} color="#fff" /> Semnat · Contract gata!</> : <><Icon.Pen size={16} color="#fff" /> Semnează contractul</>}
        </div>
      </div>
    </Screen>
  );
}

function SignatureSvg({ progress = 0 }) {
  // A stylized handwriting curve, stroke draws based on progress.
  const total = 360;
  const visible = total * progress;
  return (
    <svg width="100%" height="32" viewBox="0 0 320 40" style={{ position: 'absolute', inset: 0 }}>
      <path
        d="M5 25 C 20 5, 35 35, 50 18 S 80 35, 100 12 C 110 5, 130 30, 150 20 S 200 5, 240 25 C 260 32, 280 14, 300 22"
        fill="none" stroke={BRAND.blue} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={`${visible} ${total}`}
      />
    </svg>
  );
}

// ─── DONE SCREEN ─────────────────────────────────────────────────────────────
function DoneScreen({ progress = 0 }) {
  const ringP = clamp(progress * 1.4, 0, 1);
  const C = 2 * Math.PI * 36;
  return (
    <Screen bg="#fff">
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16,
        background: `radial-gradient(circle at 50% 40%, ${BRAND.greenLt} 0%, #fff 70%)`,
      }}>
        {/* Big check */}
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <svg width="110" height="110" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="45" cy="45" r="36" fill="none" stroke={BRAND.line} strokeWidth="6" />
            <circle cx="45" cy="45" r="36" fill="none" stroke={BRAND.green} strokeWidth="6"
              strokeDasharray={`${C * ringP} ${C}`} strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            opacity: progress > 0.7 ? 1 : 0, transform: `scale(${progress > 0.7 ? 1 : 0.6})`,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Icon.Check size={56} color={BRAND.green} />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: BRAND.ink, marginBottom: 4 }}>Gata!</p>
          <p style={{ fontSize: 13, color: BRAND.muted }}>Contract semnat și trimis pe e-mail</p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: BRAND.blueLt, color: BRAND.blueDk,
          borderRadius: 99, padding: '6px 12px',
          fontSize: 12, fontWeight: 700,
        }}>
          <Icon.Clock size={14} color={BRAND.blue} />
          0:38 secunde
        </div>
      </div>
    </Screen>
  );
}

// Export all
Object.assign(window, {
  Screen, ScreenHeader, StepBar,
  DashboardScreen, TemplatePickerScreen, ScanPickerScreen,
  ScanningScreen, AutoFillScreen, PreviewSignScreen, DoneScreen,
});
