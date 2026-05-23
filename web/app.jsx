// web/app.jsx — root app + sidebar + layout + mock data

const {
  WHomeIcon, WFileIcon, WPackageIcon, WArchiveIcon, WUsersIcon, WSettingsIcon,
  WPlusIcon, WMenuIcon, WBellIcon, WLogOutIcon, WChevDownIcon,
  WAvatar, WebDashboard, WebContracts, WebTeam, WebSettings,
} = window;

// ─── Mock data ────────────────────────────────────────────────────────────────
const WEB_PROFILE = {
  email: 'contact@autolux.ro',
  firm_name: 'AutoLux SRL',
  firm_cui: 'RO12345678',
  firm_address: 'Str. Victoriei nr. 45, București, Sector 1',
  firm_reg: 'J40/1234/2020',
  legal_rep: 'Popescu Ion',
  plan: 'business',
  contracts_used: 47,
  contracts_limit: 150,
};

const WEB_CONTRACTS = [
  { id:'1',  template_name:'Închiriere Auto',   status:'generated', parties:[{name:'Ionescu Alexandru', cnp:'1850315400123'}], created_at:'2026-05-22T10:30:00Z' },
  { id:'2',  template_name:'Închiriere Auto',   status:'draft',     parties:[{name:'Marinescu Cristina',cnp:'2780405300456'}], created_at:'2026-05-20T14:15:00Z' },
  { id:'3',  template_name:'Închiriere Auto',   status:'signed',    parties:[{name:'Georgescu Mihai',   cnp:'1790502400789'}], created_at:'2026-05-18T09:00:00Z' },
  { id:'4',  template_name:'Prestări Servicii', status:'signed',    parties:[{name:'TechCorp SRL',      cnp:'—'}],             created_at:'2026-05-15T16:45:00Z' },
  { id:'5',  template_name:'Închiriere Auto',   status:'signed',    parties:[{name:'Petrescu Dan',      cnp:'1800815400321'}], created_at:'2026-05-10T11:20:00Z' },
  { id:'6',  template_name:'Închiriere Auto',   status:'signed',    parties:[{name:'Tudorescu Ion',     cnp:'1750220300654'}], created_at:'2026-04-22T08:30:00Z' },
  { id:'7',  template_name:'Prestări Servicii', status:'signed',    parties:[{name:'Global Trade SA',   cnp:'—'}],             created_at:'2026-04-18T13:00:00Z' },
  { id:'8',  template_name:'Închiriere Auto',   status:'expired',   parties:[{name:'Constantin Radu',   cnp:'1820310400987'}], created_at:'2026-03-05T10:00:00Z' },
];

const WEB_TEAM = [
  { id:'1', name:'Popescu Ion',        email:'ion.popescu@autolux.ro',    role:'admin',    status:'active',  contracts_count: 0  },
  { id:'2', name:'Dumitrescu Ana',     email:'ana.dumitrescu@autolux.ro', role:'manager',  status:'active',  contracts_count: 28 },
  { id:'3', name:'Ionescu Alexandru',  email:'alex.i@autolux.ro',         role:'operator', status:'active',  contracts_count: 12 },
  { id:'4', name:'Georgescu Dan',      email:'dan.g@autolux.ro',          role:'operator', status:'invited', contracts_count: 0  },
];

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  Icon: WHomeIcon   },
  { id: 'contracts',  label: 'Contracte',  Icon: WFileIcon   },
  { id: 'assets',     label: 'Active',     Icon: WPackageIcon },
  { id: 'history',    label: 'Arhivă',     Icon: WArchiveIcon },
  { id: 'team',       label: 'Echipă',     Icon: WUsersIcon, badge: 'Business' },
  { id: 'settings',   label: 'Setări',     Icon: WSettingsIcon },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen, collapsed, profile }) {
  const w = collapsed ? 64 : 240;
  return (
    <aside style={{
      width: w, minHeight: '100vh', background: '#fff',
      borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease', flexShrink: 0, position: 'sticky', top: 0, alignSelf: 'flex-start',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '18px 0' : '18px 20px', height: 60, display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {collapsed
          ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#2563eb' }}>R</span>
            </div>
          : <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: '#2563eb', whiteSpace: 'nowrap' }}>
              RapidAct<span style={{ color: '#10b981' }}>.ro</span>
            </span>
        }
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, label, Icon, badge }) => {
          const active = screen === id;
          return (
            <button key={id} onClick={() => setScreen(id)} title={collapsed ? label : ''} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 8, border: 'none', background: active ? '#eff6ff' : 'none',
              color: active ? '#2563eb' : '#64748b', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.1s', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none'; }}>
              <Icon size={18} color={active ? '#2563eb' : '#64748b'} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, flex: 1, whiteSpace: 'nowrap' }}>{label}</span>
                  {badge && <span style={{ fontSize: 10, fontWeight: 700, background: '#dbeafe', color: '#1e40af', borderRadius: 4, padding: '1px 6px' }}>{badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 8px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 0' : '8px 12px', borderRadius: 8, justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <WAvatar name={profile.firm_name} size={32} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.firm_name}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>Plan {profile.plan}</p>
            </div>
          )}
          {!collapsed && <WLogOutIcon size={15} color="#94a3b8" />}
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  contracts: 'Contracte',
  assets:    'Active firmă',
  history:   'Arhivă',
  team:      'Echipă',
  settings:  'Setări',
};

function TopBar({ screen, profile, onToggle }) {
  return (
    <header style={{
      height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onToggle} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <WMenuIcon size={16} />
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{PAGE_TITLES[screen] || screen}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{ position: 'relative', width: 34, height: 34, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <WBellIcon size={16} />
          <span style={{ position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff' }} />
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px 5px 5px',
          border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer',
        }}>
          <WAvatar name={profile.firm_name} size={26} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{profile.firm_name}</span>
          <WChevDownIcon size={14} color="#94a3b8" />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <WPlusIcon size={14} /> Contract nou
        </button>
      </div>
    </header>
  );
}

// ─── Assets placeholder (web) ─────────────────────────────────────────────────
function WebAssets() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
      <h2 style={{ fontWeight: 700, color: '#334155', marginBottom: 8 }}>Active firmă</h2>
      <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 360, margin: '0 auto' }}>
        Registrul activ (mașini, proprietăți, companii) în versiunea web — în curs de implementare.
      </p>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function WebApp() {
  const [screen, setScreen]       = React.useState('dashboard');
  const [collapsed, setCollapsed] = React.useState(false);
  const [profile, setProfile]     = React.useState(WEB_PROFILE);

  // Tweaks panel support
  React.useEffect(() => {
    function onMsg(e) {
      if (e.data?.type === '__activate_edit_mode')   setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const [showTweaks, setShowTweaks] = React.useState(false);

  const screenContent = {
    dashboard: <WebDashboard profile={profile} contracts={WEB_CONTRACTS} navigate={setScreen} />,
    contracts: <WebContracts contracts={WEB_CONTRACTS} />,
    assets:    <WebAssets />,
    history:   <WebContracts contracts={WEB_CONTRACTS.filter(c => ['signed','expired'].includes(c.status))} />,
    team:      <WebTeam team={WEB_TEAM} profile={profile} />,
    settings:  <WebSettings profile={profile} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: 14, color: '#0f172a' }}>
      <Sidebar screen={screen} setScreen={setScreen} collapsed={collapsed} profile={profile} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar screen={screen} profile={profile} onToggle={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {screenContent[screen] ?? screenContent.dashboard}
        </main>
      </div>

      {/* Tweaks overlay */}
      {showTweaks && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={() => { setShowTweaks(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
          <div className="slide-up" style={{ position: 'relative', width: 320, background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', padding: '20px 24px 32px' }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Tweaks</p>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', marginBottom: 8 }}>Plan simulat</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['business', 'enterprise'].map(p => (
                  <button key={p} onClick={() => setProfile(prev => ({ ...prev, plan: p, contracts_limit: p === 'business' ? 150 : 9999 }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `2px solid ${profile.plan === p ? '#7c3aed' : '#e2e8f0'}`, background: profile.plan === p ? '#faf5ff' : '#fff', color: profile.plan === p ? '#7c3aed' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WebApp />);
