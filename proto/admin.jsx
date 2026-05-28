// proto/admin.jsx — RapidAct Admin Dashboard (web, desktop)

// ─── SVG Icon factory ─────────────────────────────────────────────────────────
const Svg = ({ size = 18, color = 'currentColor', children, className = '', strokeWidth = 2, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ flexShrink: 0, display: 'block' }} {...p}>{children}</svg>
);
const HomeIcon     = p => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>;
const UsersIcon    = p => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const FileTextIcon = p => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>;
const LogOutIcon   = p => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const PlusIcon     = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const SearchIcon   = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const EditIcon     = p => <Svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
const TrashIcon    = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const XIcon        = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const SpinnerIcon  = p => <Svg {...p} className={`animate-spin ${p.className||''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Svg>;
const CheckIcon    = p => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>;
const ChevRightIcon= p => <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>;
const ShieldOffIcon= p => <Svg {...p}><path d="M12 22s-8-4-8-10V5l8-3 8 3v4"/><line x1="1" y1="1" x2="23" y2="23"/></Svg>;
const RefreshIcon  = p => <Svg {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Svg>;

// ─── FIELD_REGISTRY (compact) ─────────────────────────────────────────────────
const FIELD_REG = {
  driver_name:           { label: 'Nume complet',          cat: 'Persoana',  source: 'ocr'      },
  driver_cnp:            { label: 'CNP',                   cat: 'Persoana',  source: 'ocr'      },
  driver_ci_series:      { label: 'Serie CI',              cat: 'Persoana',  source: 'ocr'      },
  driver_ci_number:      { label: 'Nr. CI',                cat: 'Persoana',  source: 'ocr'      },
  driver_birthdate:      { label: 'Data nașterii',         cat: 'Persoana',  source: 'ocr'      },
  driver_ci_expiry:      { label: 'CI valabilă până',      cat: 'Persoana',  source: 'ocr'      },
  driver_address:        { label: 'Adresă domiciliu',      cat: 'Persoana',  source: 'manual'   },
  driver_license_nr:     { label: 'Nr. permis',            cat: 'Persoana',  source: 'ocr'      },
  driver_license_cat:    { label: 'Categorii permis',      cat: 'Persoana',  source: 'ocr'      },
  driver_license_expiry: { label: 'Permis valabil până',   cat: 'Persoana',  source: 'ocr'      },
  company_name:          { label: 'Denumire firmă',        cat: 'Firma',     source: 'profile'  },
  company_cui:           { label: 'CUI',                   cat: 'Firma',     source: 'profile'  },
  company_address:       { label: 'Adresă firmă',          cat: 'Firma',     source: 'profile'  },
  company_reg:           { label: 'Reg. Comerțului',       cat: 'Firma',     source: 'profile'  },
  company_rep:           { label: 'Reprezentant legal',    cat: 'Firma',     source: 'profile'  },
  vehicle_make:          { label: 'Marcă',                 cat: 'Vehicul',   source: 'manual'   },
  vehicle_model:         { label: 'Model',                 cat: 'Vehicul',   source: 'manual'   },
  vehicle_year:          { label: 'An fabricație',         cat: 'Vehicul',   source: 'manual'   },
  vehicle_plate:         { label: 'Nr. înmatriculare',     cat: 'Vehicul',   source: 'manual'   },
  vehicle_color:         { label: 'Culoare',               cat: 'Vehicul',   source: 'manual'   },
  vehicle_vin:           { label: 'Serie VIN / Șasiu',     cat: 'Vehicul',   source: 'manual'   },
  contract_date:         { label: 'Data contractului',     cat: 'Contract',  source: 'computed' },
  contract_location:     { label: 'Locul încheierii',      cat: 'Contract',  source: 'manual'   },
  contract_start:        { label: 'Data și ora predării',  cat: 'Contract',  source: 'manual'   },
  contract_end:          { label: 'Data și ora restituirii',cat: 'Contract', source: 'manual'   },
  contract_days:         { label: 'Nr. zile închiriate',   cat: 'Contract',  source: 'manual'   },
  contract_handover_location: { label: 'Locul predării',  cat: 'Contract',  source: 'manual'   },
  contract_price_day:    { label: 'Tarif / zi (RON)',      cat: 'Contract',  source: 'manual'   },
  contract_total:        { label: 'Valoare totală (RON)',  cat: 'Contract',  source: 'manual'   },
  contract_deposit:      { label: 'Garanție (RON)',        cat: 'Contract',  source: 'manual'   },
  contract_payment:      { label: 'Mod de plată',          cat: 'Contract',  source: 'manual'   },
  contract_km_start:     { label: 'Km la predare',         cat: 'Contract',  source: 'manual'   },
  contract_km_limit:     { label: 'Km incluși / zi',       cat: 'Contract',  source: 'manual'   },
  contract_fuel:         { label: 'Combustibil la predare',cat: 'Contract',  source: 'manual'   },
  contract_franchise:    { label: 'Franșiță daune (RON)',  cat: 'Contract',  source: 'manual'   },
  contract_casco:        { label: 'Asigurare CASCO',       cat: 'Contract',  source: 'manual'   },
  contract_notes:        { label: 'Observații / daune',    cat: 'Contract',  source: 'manual'   },
};

const SOURCE_STYLE = {
  ocr:      { bg: '#dcfce7', color: '#166534', label: 'OCR'    },
  profile:  { bg: '#dbeafe', color: '#1e40af', label: 'Profil' },
  manual:   { bg: '#fef9c3', color: '#92400e', label: 'Manual' },
  computed: { bg: '#f3e8ff', color: '#6b21a8', label: 'Auto'   },
};

const CAT_ORDER = ['Persoana', 'Firma', 'Vehicul', 'Contract'];
const CAT_EMOJI = { Persoana: '👤', Firma: '🏢', Vehicul: '🚗', Contract: '📋' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractFields(body) {
  if (!body) return [];
  const keys = (body.match(/\{\{([^}]+)\}\}/g) || []).map(m => m.slice(2, -2).trim());
  return [...new Set(keys.filter(k => k in FIELD_REG))];
}
function deriveScanDocs(fields) {
  const docs = new Set();
  fields.forEach(k => { if (FIELD_REG[k]?.source === 'ocr') docs.add(FIELD_REG[k].docId || k.split('_')[1] || 'ci'); });
  return [...docs];
}
function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' }) + ' ' +
         d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────
function Badge({ bg, color, children }) {
  return <span style={{ background: bg, color, borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</span>;
}
function PlanBadge({ plan }) {
  const c = { free: ['#f1f5f9','#475569'], starter: ['#dbeafe','#1e40af'], pro: ['#f3e8ff','#6b21a8'], business: ['#0f172a','#fff'] };
  const [bg, color] = c[plan] || c.free;
  return <Badge bg={bg} color={color}>{plan}</Badge>;
}
function Spinner({ size = 20 }) {
  return <SpinnerIcon size={size} color="#2563eb" />;
}
function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#94a3b8', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
      <p style={{ fontWeight: 600, color: '#64748b', fontSize: 15, marginBottom: 4 }}>{title}</p>
      {sub && <p style={{ fontSize: 13, marginBottom: 16 }}>{sub}</p>}
      {action && (
        <button onClick={onAction} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13 }}>{action}</button>
      )}
    </div>
  );
}
function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, fontSize: 13 }}>
          <PlusIcon size={15} /> {action}
        </button>
      )}
    </div>
  );
}

// ─── AdminLogin ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: err } = await window.sb.auth.signInWithPassword({ email: email.trim(), password });
      if (err) throw err;
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Autentificare eșuată.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: 400, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>RapidAct Admin</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Panou de administrare intern</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              placeholder="admin@rapidact.ro"
              style={{ width: '100%', height: 44, border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0 12px', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#93c5fd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Parolă</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', height: 44, border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0 12px', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#93c5fd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', height: 44, background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}>
            {loading ? <><Spinner size={18} /> Autentificare...</> : 'Intră în Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────
function AdminSidebar({ section, setSection, adminEmail, onLogout }) {
  const items = [
    { id: 'overview',   label: 'Overview',        Icon: HomeIcon     },
    { id: 'users',      label: 'Utilizatori',     Icon: UsersIcon    },
    { id: 'templates',  label: 'Template-uri',    Icon: FileTextIcon },
  ];

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>RapidAct</p>
            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {items.map(({ id, label, Icon }) => {
          const active = section === id;
          return (
            <button key={id} onClick={() => setSection(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: 'none', textAlign: 'left', marginBottom: 2,
              background: active ? 'rgba(37,99,235,0.25)' : 'transparent',
              color: active ? '#60a5fa' : '#94a3b8',
              fontWeight: active ? 700 : 500,
              fontSize: 14, transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '14px 14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize: 11, color: '#475569', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail}</p>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '8px 10px', borderRadius: 7, border: 'none',
          background: 'transparent', color: '#64748b', fontSize: 13,
          marginTop: 6, transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOutIcon size={15} /> Deconectare
        </button>
      </div>
    </aside>
  );
}

// ─── OverviewSection ──────────────────────────────────────────────────────────
function OverviewSection({ users, contracts, templates }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayContracts = contracts.filter(c => (c.created_at || '').startsWith(todayStr)).length;
  const activeTemplates = templates.filter(t => t.active).length;
  const userTemplates = templates.filter(t => t.user_id).length;

  const stats = [
    { label: 'Utilizatori',           value: users.length,       icon: '👥', bg: '#dbeafe', color: '#1e40af' },
    { label: 'Contracte totale',       value: contracts.length,   icon: '📄', bg: '#dcfce7', color: '#166534' },
    { label: 'Template-uri active',    value: activeTemplates,    icon: '📋', bg: '#f3e8ff', color: '#6b21a8' },
    { label: 'Contracte azi',          value: todayContracts,     icon: '⚡', bg: '#fef9c3', color: '#92400e' },
  ];

  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <SectionHeader title="Overview" subtitle="Situație generală a platformei" />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 }}>{s.label}</p>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent contracts */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Contracte recente</p>
        </div>
        {recentContracts.length === 0 ? (
          <EmptyState icon="📄" title="Niciun contract încă" sub="Contractele generate de utilizatori vor apărea aici." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Data', 'Utilizator', 'Template', 'Client', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentContracts.map((c, i) => {
                const user = users.find(u => u.id === c.user_id);
                const party = (c.parties || [])[0]?.name || '—';
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{fmtDateTime(c.created_at)}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 500 }}>{user?.firm_name || user?.email || '—'}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{c.template_name || c.template_id || '—'}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13 }}>{party}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge
                        bg={c.status === 'generated' ? '#dbeafe' : c.status === 'signed' ? '#dcfce7' : '#f1f5f9'}
                        color={c.status === 'generated' ? '#1e40af' : c.status === 'signed' ? '#166534' : '#64748b'}
                      >{c.status || 'draft'}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── UserDetailPanel ──────────────────────────────────────────────────────────
function UserDetailPanel({ user, contracts, templates, onNewTemplate, onEditTemplate, onClose }) {
  const userContracts = contracts.filter(c => c.user_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const userTemplates = templates.filter(t => t.user_id === user.id);
  const globalTemplates = templates.filter(t => !t.user_id);

  return (
    <div className="fade-in" style={{
      width: 400, flexShrink: 0, background: '#fff',
      borderLeft: '1px solid #e2e8f0', height: '100%', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{user.firm_name || '—'}</p>
          <p style={{ fontSize: 13, color: '#64748b' }}>{user.email}</p>
        </div>
        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '7px 8px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
          <XIcon size={16} />
        </button>
      </div>

      <div style={{ padding: '20px 22px', flex: 1 }}>
        {/* Profile info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24, background: '#f8fafc', borderRadius: 10, padding: 14 }}>
          {[
            ['Plan', <PlanBadge plan={user.plan} />],
            ['Contracte', `${user.contracts_used || 0} / ${user.contracts_limit || 5}`],
            ['CUI', user.firm_cui || '—'],
            ['Repr. legal', user.legal_rep || '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>{k}</p>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* User templates */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Template-uri personalizate <span style={{ color: '#94a3b8', fontWeight: 500 }}>({userTemplates.length})</span></p>
            <button onClick={() => onNewTemplate(user)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 700 }}>
              <PlusIcon size={12} /> Adaugă
            </button>
          </div>

          {userTemplates.length === 0 ? (
            <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: 8, padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Niciun template personalizat</p>
              <button onClick={() => onNewTemplate(user)} style={{ marginTop: 6, fontSize: 12, color: '#2563eb', border: 'none', background: 'none', fontWeight: 600 }}>Creează primul →</button>
            </div>
          ) : (
            userTemplates.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 6, background: '#fff' }}>
                <span style={{ fontSize: 20 }}>{t.icon || '📋'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>{(t.fields || []).length} câmpuri</p>
                </div>
                <button onClick={() => onEditTemplate(t)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EditIcon size={11} /> Edit
                </button>
              </div>
            ))
          )}
        </div>

        {/* Contracts */}
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Contracte recente <span style={{ color: '#94a3b8', fontWeight: 500 }}>({userContracts.length})</span></p>
          {userContracts.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Niciun contract generat.</p>
          ) : (
            userContracts.slice(0, 8).map(c => {
              const party = (c.parties || [])[0]?.name || '—';
              return (
                <div key={c.id} style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{party}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{c.template_name || c.template_id} · {fmtDate(c.created_at)}</p>
                  </div>
                  <Badge
                    bg={c.status === 'generated' ? '#dbeafe' : '#f1f5f9'}
                    color={c.status === 'generated' ? '#1e40af' : '#64748b'}
                  >{c.status || 'draft'}</Badge>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── UsersSection ─────────────────────────────────────────────────────────────
function UsersSection({ users, contracts, templates, onNewTemplate, onEditTemplate }) {
  const [search,       setSearch]       = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.firm_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="fade-in" style={{ padding: '32px 36px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <SectionHeader
        title="Utilizatori"
        subtitle={`${users.length} conturi înregistrate`}
      />

      <div style={{ flex: 1, display: 'flex', gap: 0, minHeight: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>

        {/* Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Search bar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
              <SearchIcon size={15} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Caută după firmă sau email..."
                style={{ width: '100%', height: 36, border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0 12px 0 32px', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#93c5fd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Table head */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                <tr style={{ background: '#f8fafc' }}>
                  {['Firmă', 'Email', 'Plan', 'Contracte', 'Template-uri', 'Înregistrat', ''].map(h => (
                    <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>Niciun utilizator găsit.</td></tr>
                )}
                {filtered.map(u => {
                  const uContracts  = contracts.filter(c => c.user_id === u.id).length;
                  const uTemplates  = templates.filter(t => t.user_id === u.id).length;
                  const isSelected  = selectedUser?.id === u.id;
                  const isAdmin     = u.is_admin;
                  return (
                    <tr key={u.id}
                      onClick={() => setSelectedUser(isSelected ? null : u)}
                      style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#eff6ff' : '#fff', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff'; }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: isAdmin ? '#0f172a' : 'linear-gradient(135deg,#2563eb,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {(u.firm_name || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600 }}>{u.firm_name || '—'}</p>
                            {isAdmin && <span style={{ fontSize: 10, background: '#0f172a', color: '#fff', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#64748b' }}>{u.email}</td>
                      <td style={{ padding: '14px 18px' }}><PlanBadge plan={u.plan || 'free'} /></td>
                      <td style={{ padding: '14px 18px', fontSize: 13, textAlign: 'center' }}><span style={{ fontWeight: 600 }}>{uContracts}</span></td>
                      <td style={{ padding: '14px 18px', fontSize: 13, textAlign: 'center' }}>{uTemplates > 0 ? <span style={{ fontWeight: 600, color: '#2563eb' }}>{uTemplates}</span> : <span style={{ color: '#cbd5e1' }}>0</span>}</td>
                      <td style={{ padding: '14px 18px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtDate(u.created_at)}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <ChevRightIcon size={16} color={isSelected ? '#2563eb' : '#cbd5e1'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedUser && (
          <UserDetailPanel
            user={selectedUser}
            contracts={contracts}
            templates={templates}
            onNewTemplate={onNewTemplate}
            onEditTemplate={onEditTemplate}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
}

// ─── FieldPicker (side panel in editor) ──────────────────────────────────────
function FieldPickerPanel({ onInsert }) {
  const [activeCategory, setActiveCategory] = React.useState('Persoana');
  const fields = Object.entries(FIELD_REG).filter(([, v]) => v.cat === activeCategory);

  return (
    <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#fafcff', height: '100%' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>Inserează câmp</p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {CAT_ORDER.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: activeCategory === cat ? '#fff' : 'transparent',
            color: activeCategory === cat ? '#2563eb' : '#94a3b8',
            borderBottom: activeCategory === cat ? '2px solid #2563eb' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            {CAT_EMOJI[cat]}
          </button>
        ))}
      </div>
      <div style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', padding: '4px 6px' }}>{CAT_EMOJI[activeCategory]} {activeCategory}</p>
      </div>

      {/* Field list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
        {fields.map(([key, r]) => {
          const st = SOURCE_STYLE[r.source] || SOURCE_STYLE.manual;
          return (
            <button key={key} onClick={() => onInsert(key)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '8px 10px', borderRadius: 7,
              border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
              textAlign: 'left', marginBottom: 5, gap: 8, transition: 'border-color 0.1s, background 0.1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f9ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</p>
                <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }}>{`{{${key}}}`}</p>
              </div>
              <Badge bg={st.bg} color={st.color}>{st.label}</Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── AdminTemplateEditor ──────────────────────────────────────────────────────
function AdminTemplateEditor({ template, users, presetUserId, onSave, onDelete, onClose }) {
  const isNew  = !template;
  const isGlobal = !isNew && !template.user_id;

  const [name,        setName]        = React.useState(template?.name        || '');
  const [icon,        setIcon]        = React.useState(template?.icon        || '📋');
  const [description, setDescription] = React.useState(template?.description || '');
  const [category,    setCategory]    = React.useState(template?.category    || 'General');
  const [active,      setActive]      = React.useState(template?.active !== false);
  const [body,        setBody]        = React.useState(template?.bodyText || template?.body_template || '');
  const [assignedTo,  setAssignedTo]  = React.useState(template?.user_id || presetUserId || '__global__');
  const [showPicker,  setShowPicker]  = React.useState(false);
  const [saving,      setSaving]      = React.useState(false);
  const [deleting,    setDeleting]    = React.useState(false);
  const [error,       setError]       = React.useState('');
  const [saved,       setSaved]       = React.useState(false);

  const taRef       = React.useRef(null);
  const cursorRef   = React.useRef(0);
  const derivedFields = extractFields(body);

  function saveCursor() {
    if (taRef.current) cursorRef.current = taRef.current.selectionStart ?? body.length;
  }

  function insertField(key) {
    const pos     = cursorRef.current;
    const snippet = `{{${key}}}`;
    const newBody = body.slice(0, pos) + snippet + body.slice(pos);
    const newPos  = pos + snippet.length;
    setBody(newBody);
    cursorRef.current = newPos;
    setTimeout(() => {
      if (taRef.current) {
        taRef.current.focus();
        taRef.current.setSelectionRange(newPos, newPos);
      }
    }, 30);
  }

  async function handleSave() {
    if (!name.trim()) { setError('Numele template-ului este obligatoriu.'); return; }
    if (!body.trim()) { setError('Corpul contractului este obligatoriu.'); return; }
    setError('');
    setSaving(true);
    try {
      const fields   = extractFields(body);
      const scanDocs = deriveScanDocs(fields);
      const now      = new Date().toISOString();
      const userId   = assignedTo === '__global__' ? null : assignedTo;

      const row = {
        name: name.trim(), icon: icon || '📋',
        description: description.trim(), category: category || 'General',
        active, body_template: body, fields, scan_docs: scanDocs,
        user_id: userId, updated_at: now,
      };

      let savedRow;
      if (isNew) {
        row.id = generateSlug(name);
        row.created_at = now;
        const { data, error: err } = await window.sb.from('contract_templates').insert(row).select().single();
        if (err) throw err;
        savedRow = data;
      } else {
        const { data, error: err } = await window.sb.from('contract_templates').update(row).eq('id', template.id).select().single();
        if (err) throw err;
        savedRow = data;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSave(savedRow);
    } catch (err) {
      setError(err.message || 'Eroare la salvare.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Ștergi template-ul "${name}"? Acțiunea nu poate fi anulată.`)) return;
    setDeleting(true);
    try {
      const { error: err } = await window.sb.from('contract_templates').delete().eq('id', template.id);
      if (err) throw err;
      onDelete(template.id);
    } catch (err) {
      setError(err.message || 'Eroare la ștergere.');
      setDeleting(false);
    }
  }

  const iStyle = { width: '100%', height: 38, border: '1.5px solid #e2e8f0', borderRadius: 7, padding: '0 10px', fontSize: 13, outline: 'none', background: '#fff', transition: 'border-color 0.15s' };
  const iFocus = e => e.target.style.borderColor = '#93c5fd';
  const iBlur  = e => e.target.style.borderColor = '#e2e8f0';

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Editor header */}
      <div style={{ padding: '16px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>{isNew ? 'Template nou' : (isGlobal ? `✏️ ${template.name}` : `✏️ ${template.name}`)}</p>
          {!isNew && isGlobal && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>Template standard (global)</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isNew && (
            <button onClick={handleDelete} disabled={deleting} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 7, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
              {deleting ? <Spinner size={14} /> : <TrashIcon size={14} />} Șterge
            </button>
          )}
          <button onClick={onClose} style={{ padding: '7px 13px', borderRadius: 7, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 13 }}>
            Anulează
          </button>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 7, border: 'none', background: saving ? '#93c5fd' : saved ? '#10b981' : '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {saving ? <><Spinner size={14} /> Salvez...</> : saved ? <><CheckIcon size={14} /> Salvat!</> : 'Salvează'}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', minHeight: 0 }}>

        {/* Left: form */}
        <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', minWidth: 0 }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}

          {/* Row 1: Icon + Name */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Icon</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} maxLength={2}
                style={{ width: 48, height: 38, border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: 20, textAlign: 'center', outline: 'none', background: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nume *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Închiriere Auto"
                style={iStyle} onFocus={iFocus} onBlur={iBlur} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Categorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...iStyle, cursor: 'pointer' }}>
                {['General', 'Închiriere Auto', 'Imobiliare', 'Servicii', 'Muncă', 'Altele'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Descriere</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Scurtă descriere a template-ului"
              style={iStyle} onFocus={iFocus} onBlur={iBlur} />
          </div>

          {/* Row 3: Assigned to + Active */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Atribuit la</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ ...iStyle, cursor: 'pointer' }}>
                <option value="__global__">🌐 Global — toți utilizatorii</option>
                <optgroup label="Utilizatori">
                  {users.filter(u => !u.is_admin).map(u => (
                    <option key={u.id} value={u.id}>{u.firm_name || u.email}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 1 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Activ</span>
              <button onClick={() => setActive(a => !a)} style={{
                width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: active ? '#2563eb' : '#cbd5e1', position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{ position: 'absolute', top: 2, left: active ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f1f5f9', margin: '0 -24px 18px' }} />

          {/* Body textarea */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={labelStyle}>Corp contract *</label>
              <button onClick={() => { saveCursor(); setShowPicker(p => !p); }} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: showPicker ? '#2563eb' : '#eff6ff',
                color: showPicker ? '#fff' : '#2563eb',
                border: '1px solid ' + (showPicker ? '#2563eb' : '#bfdbfe'),
                borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 700,
              }}>
                <PlusIcon size={12} /> {showPicker ? 'Închide câmpuri' : 'Câmpuri disponibile'}
              </button>
            </div>

            <textarea
              ref={taRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              onMouseUp={saveCursor} onKeyUp={saveCursor} onClick={saveCursor}
              placeholder={`Scrie corpul contractului. Folosește {{câmp}} pentru câmpuri dinamice.\n\nEx: Subsemnatul {{driver_name}}, CNP {{driver_cnp}}, legitimat cu CI seria {{driver_ci_series}} nr. {{driver_ci_number}}, în calitate de Locatar, am primit spre folosință temporară autovehiculul marca {{vehicle_make}} model {{vehicle_model}}...`}
              style={{
                width: '100%', minHeight: 320, borderRadius: 8,
                border: '1.5px solid #e2e8f0', padding: '12px 14px',
                fontSize: 13, lineHeight: 1.7, resize: 'vertical',
                fontFamily: '"SF Mono","Fira Code","Consolas",monospace',
                background: '#fafcff', outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#93c5fd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />

            {/* Detected fields */}
            {derivedFields.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 7 }}>
                  Câmpuri detectate — {derivedFields.length}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {derivedFields.map(key => {
                    const r  = FIELD_REG[key];
                    const st = r ? (SOURCE_STYLE[r.source] || SOURCE_STYLE.manual) : { bg: '#f1f5f9', color: '#64748b', label: '?' };
                    return (
                      <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '3px 8px', fontSize: 11 }}>
                        <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{`{{${key}}}`}</span>
                        <Badge bg={st.bg} color={st.color}>{st.label}</Badge>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: field picker */}
        {showPicker && (
          <FieldPickerPanel onInsert={key => { insertField(key); }} />
        )}
      </div>
    </div>
  );
}

// label style helper (used in AdminTemplateEditor)
const labelStyle = {
  fontSize: 11, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: 0.6,
  display: 'block', marginBottom: 5,
};

// ─── TemplatesSection ─────────────────────────────────────────────────────────
function TemplatesSection({ templates, users, nav, onNavConsumed, onSave, onDelete }) {
  const [selected,     setSelected]     = React.useState(null);  // template obj | 'new'
  const [presetUserId, setPresetUserId] = React.useState(null);
  const [search,       setSearch]       = React.useState('');

  // Handle external navigation (from Users section)
  React.useEffect(() => {
    if (!nav) return;
    if (nav.action === 'new')  { setPresetUserId(nav.userId || null); setSelected('new'); }
    if (nav.action === 'edit') { setPresetUserId(null); setSelected(nav.template); }
    onNavConsumed();
  }, [nav]);

  function openNew(userId) {
    setPresetUserId(userId || null);
    setSelected('new');
  }

  function openEdit(t) {
    setPresetUserId(null);
    setSelected(t);
  }

  function handleSave(savedRow) {
    onSave(savedRow);
    // Keep editor open with updated data
    setSelected(prev => prev === 'new' ? { ...savedRow, bodyText: savedRow.body_template } : { ...savedRow, bodyText: savedRow.body_template });
  }

  function handleDelete(id) {
    onDelete(id);
    setSelected(null);
  }

  // Group templates: global first, then by user
  const global = templates.filter(t => !t.user_id);
  const byUser = {};
  templates.filter(t => t.user_id).forEach(t => {
    if (!byUser[t.user_id]) byUser[t.user_id] = [];
    byUser[t.user_id].push(t);
  });

  const filteredGlobal = global.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 36px', minHeight: 0 }}>
      <SectionHeader
        title="Template-uri"
        subtitle={`${templates.length} template-uri — ${global.length} globale, ${templates.length - global.length} personalizate`}
        action="Template nou"
        onAction={() => openNew(null)}
      />

      <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0 }}>

        {/* Left: template list */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon size={13} color="#94a3b8" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Caută template..."
                style={{ width: '100%', height: 34, border: '1.5px solid #e2e8f0', borderRadius: 7, padding: '0 8px 0 28px', fontSize: 12, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#93c5fd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Global section */}
            <div style={{ padding: '10px 12px 4px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>🌐 Standard</p>
            </div>
            {filteredGlobal.length === 0 && (
              <p style={{ padding: '12px 14px', fontSize: 12, color: '#94a3b8' }}>Niciun template global.</p>
            )}
            {filteredGlobal.map(t => <TemplateListItem key={t.id} template={t} active={selected?.id === t.id} onClick={() => openEdit(t)} />)}

            {/* Per-user sections */}
            {Object.entries(byUser).map(([uid, uts]) => {
              const user = users.find(u => u.id === uid);
              const label = user?.firm_name || user?.email || uid.slice(0, 8);
              const filtered = uts.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));
              if (filtered.length === 0) return null;
              return (
                <div key={uid}>
                  <div style={{ padding: '10px 12px 4px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>👤 {label}</p>
                    <button onClick={() => openNew(uid)} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 16, lineHeight: 1, cursor: 'pointer', padding: 0, flexShrink: 0 }} title="Adaugă template pentru acest user">+</button>
                  </div>
                  {filtered.map(t => <TemplateListItem key={t.id} template={t} active={selected?.id === t.id} onClick={() => openEdit(t)} />)}
                </div>
              );
            })}
          </div>

          {/* Add button */}
          <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button onClick={() => openNew(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px', borderRadius: 8, border: '1.5px dashed #bfdbfe', background: '#f0f9ff', color: '#2563eb', fontWeight: 700, fontSize: 13 }}>
              <PlusIcon size={14} /> Nou template
            </button>
          </div>
        </div>

        {/* Right: editor or placeholder */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', minWidth: 0 }}>
          {selected ? (
            <AdminTemplateEditor
              template={selected === 'new' ? null : selected}
              users={users}
              presetUserId={presetUserId}
              onSave={handleSave}
              onDelete={handleDelete}
              onClose={() => setSelected(null)}
            />
          ) : (
            <EmptyState icon="📋" title="Selectează un template" sub="Sau creează unul nou din butonul de mai jos." action="Template nou" onAction={() => openNew(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateListItem({ template, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
      padding: '10px 12px', border: 'none', textAlign: 'left',
      background: active ? '#eff6ff' : 'transparent',
      borderLeft: `3px solid ${active ? '#2563eb' : 'transparent'}`,
      cursor: 'pointer', transition: 'all 0.12s',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{template.icon || '📋'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#1e40af' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{template.name}</p>
        <p style={{ fontSize: 11, color: '#94a3b8' }}>{(template.fields || []).length} câmpuri {!template.active ? '· Inactiv' : ''}</p>
      </div>
    </button>
  );
}

// ─── AdminApp (root) ──────────────────────────────────────────────────────────
function AdminApp() {
  const [authState,  setAuthState]  = React.useState('loading'); // loading | login | unauthorized | ready
  const [adminEmail, setAdminEmail] = React.useState('');
  const [section,    setSection]    = React.useState('overview');
  const [templateNav, setTemplateNav] = React.useState(null); // { action: 'new', userId } | { action: 'edit', templateId }

  const [users,     setUsers]     = React.useState([]);
  const [contracts, setContracts] = React.useState([]);
  const [templates, setTemplates] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  // ── Auth check ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    checkSession();
    const { data: { subscription } } = window.sb.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { setAuthState('login'); setAdminEmail(''); clearData(); }
    });
    return () => subscription.unsubscribe();
  }, []);

  function clearData() { setUsers([]); setContracts([]); setTemplates([]); }

  async function checkSession() {
    try {
      const { data: { session } } = await window.sb.auth.getSession();
      if (!session) { setAuthState('login'); return; }
      await handleUser(session.user);
    } catch {
      setAuthState('login');
    }
  }

  async function handleUser(user) {
    setAdminEmail(user.email);
    // Check is_admin
    const { data: profile } = await window.sb.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) { setAuthState('unauthorized'); return; }
    setAuthState('ready');
    loadAllData();
  }

  async function loadAllData() {
    setDataLoading(true);
    try {
      const [{ data: usersData }, { data: contractsData }, { data: templatesData }] = await Promise.all([
        window.sb.from('profiles').select('*').order('created_at', { ascending: false }),
        window.sb.from('contracts').select('*').order('created_at', { ascending: false }),
        window.sb.from('contract_templates').select('*').order('sort_order', { ascending: true, nullsFirst: false }),
      ]);
      if (usersData)     setUsers(usersData);
      if (contractsData) setContracts(contractsData);
      if (templatesData) setTemplates(templatesData.map(t => ({ ...t, bodyText: t.body_template })));
    } catch (err) {
      console.error('[Admin] loadAllData:', err);
    } finally {
      setDataLoading(false);
    }
  }

  async function handleLogout() {
    await window.sb.auth.signOut();
  }

  // ── Template CRUD callbacks ─────────────────────────────────────────────────
  function handleTemplateSave(savedRow) {
    const parsed = { ...savedRow, bodyText: savedRow.body_template };
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.id === parsed.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = parsed; return n; }
      return [...prev, parsed];
    });
  }
  function handleTemplateDelete(id) {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (authState === 'loading') {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, background: '#f8fafc' }}>
        <span style={{ fontSize: 36 }}>⚡</span>
        <Spinner size={28} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Se verifică sesiunea...</p>
      </div>
    );
  }

  if (authState === 'login') {
    return <AdminLogin onLogin={user => handleUser(user)} />;
  }

  if (authState === 'unauthorized') {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
        <ShieldOffIcon size={48} color="#ef4444" />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Acces neautorizat</p>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Contul <strong>{adminEmail}</strong> nu are drepturi de admin.</p>
        </div>
        <button onClick={handleLogout} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 14 }}>Deconectare</button>
      </div>
    );
  }

  // ── Full admin shell ────────────────────────────────────────────────────────
  const mainProps = { users, contracts, templates };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <AdminSidebar section={section} setSection={setSection} adminEmail={adminEmail} onLogout={handleLogout} />

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Top bar */}
        <div style={{ padding: '12px 36px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
            <span style={{ fontSize: 16 }}>{{ overview: '📊', users: '👥', templates: '📋' }[section]}</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{{ overview: 'Overview', users: 'Utilizatori', templates: 'Template-uri' }[section]}</span>
          </div>
          <button onClick={loadAllData} disabled={dataLoading} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            {dataLoading ? <Spinner size={14} /> : <RefreshIcon size={14} />} Reîncarcă
          </button>
        </div>

        {/* Sections */}
        {section === 'overview' && (
          <OverviewSection {...mainProps} />
        )}
        {section === 'users' && (
          <UsersSection
            {...mainProps}
            onNewTemplate={(user) => { setTemplateNav({ action: 'new', userId: user.id }); setSection('templates'); }}
            onEditTemplate={(t)    => { setTemplateNav({ action: 'edit', template: t   }); setSection('templates'); }}
          />
        )}
        {section === 'templates' && (
          <TemplatesSection
            {...mainProps}
            nav={templateNav}
            onNavConsumed={() => setTemplateNav(null)}
            onSave={handleTemplateSave}
            onDelete={handleTemplateDelete}
          />
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
