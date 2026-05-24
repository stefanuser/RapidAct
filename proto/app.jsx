// proto/app.jsx — Root App with navigation + mock data + tweaks

const {
  LandingScreen, LoginScreen, RegisterScreen, OnboardingScreen,
  DashboardScreen, AssetsScreen, HistoryScreen, SettingsScreen,
  DatePersonaleScreen, DateFirmaScreen,
  ContractNewScreen, ContractTemplatesScreen, GearIcon,
} = window;

// ─── Profile default ──────────────────────────────────────────────────────────
const EMPTY_PROFILE = {
  email: '',
  firm_name: '',
  firm_cui: '',
  firm_address: '',
  firm_reg: '',
  legal_rep: '',
  profile_type: 'rentacar',
  plan: 'free',
  contracts_used: 0,
  contracts_limit: 5,
  watermark_enabled: true,
  cnp: '', ci_serie: '', ci_nr: '', data_nastere: '', adresa: '', signature: null,
};

// ─── Mock contracts ───────────────────────────────────────────────────────────
const MOCK_CONTRACTS = [
  { id: '1', template_name: 'Închiriere Auto', status: 'generated', asset_id: 'c1', parties: [{ name: 'Ionescu Alexandru' }], created_at: '2026-05-22T10:30:00Z' },
  { id: '2', template_name: 'Închiriere Auto', status: 'draft',     asset_id: 'c2', parties: [{ name: 'Marinescu Cristina' }], created_at: '2026-05-20T14:15:00Z' },
  { id: '3', template_name: 'Închiriere Auto', status: 'signed',    asset_id: 'c1', parties: [{ name: 'Georgescu Mihai' }],    created_at: '2026-05-18T09:00:00Z' },
  { id: '4', template_name: 'Închiriere Auto', status: 'signed',    asset_id: 'c3', parties: [{ name: 'Dumitrescu Ana' }],     created_at: '2026-05-15T16:45:00Z' },
  { id: '5', template_name: 'Închiriere Auto', status: 'signed',    asset_id: 'c2', parties: [{ name: 'Petrescu Dan' }],       created_at: '2026-05-10T11:20:00Z' },
  { id: '6', template_name: 'Închiriere Auto', status: 'signed',    asset_id: 'c1', parties: [{ name: 'Tudorescu Ion' }],      created_at: '2026-04-22T08:30:00Z' },
  { id: '7', template_name: 'Închiriere Auto', status: 'signed',    asset_id: null, parties: [{ name: 'Vlad Simona' }],        created_at: '2026-04-18T13:00:00Z' },
  { id: '8', template_name: 'Închiriere Auto', status: 'expired',   asset_id: null, parties: [{ name: 'Constantin Radu' }],    created_at: '2026-03-05T10:00:00Z' },
];

// ─── Mock assets ──────────────────────────────────────────────────────────────
const MOCK_ASSETS = [
  {
    id: 'c1', type: 'car', contract_count: 3,
    details: { plate: 'B 123 ABC', make: 'Dacia', model: 'Logan', year: '2022', color: 'Alb', vin: 'VSSZZZ6KZHR123456', casco: 'Inclusă', rca_exp: '31.12.2026' },
  },
  {
    id: 'c2', type: 'car', contract_count: 2,
    details: { plate: 'B 456 DEF', make: 'Renault', model: 'Clio', year: '2021', color: 'Gri', vin: 'VF1RJA00563456789', casco: 'Nu este inclusă', rca_exp: '30.06.2026' },
  },
  {
    id: 'c3', type: 'car', contract_count: 1,
    details: { plate: 'IF 789 GHI', make: 'Skoda', model: 'Octavia', year: '2023', color: 'Negru', vin: 'TMBZZZ1Z9P1234567', casco: 'Inclusă', rca_exp: '28.02.2027' },
  },
  {
    id: 'p1', type: 'property', contract_count: 5,
    details: { name: 'Apartament 3 camere', address: 'Str. Florilor nr. 12, Ap. 7, București, Sector 3', prop_type: 'Apartament', owner: 'Popescu Ion', surface: '78', rooms: '3', cadastral: '12345/A' },
  },
  {
    id: 'p2', type: 'property', contract_count: 2,
    details: { name: 'Vilă Snagov', address: 'Str. Lacului nr. 45, Snagov, Ilfov', prop_type: 'Vilă', owner: 'AutoLux SRL', surface: '220', rooms: '6', cadastral: '67890/B' },
  },
  {
    id: 'co1', type: 'company', contract_count: 6,
    details: { name: 'TechCorp SRL', cui: 'RO87654321', reg_com: 'J40/5678/2019', address: 'Bd. Unirii nr. 10, București', contact_name: 'Ionescu Maria', contact_phone: '0721 111 222', contact_email: 'maria@techcorp.ro' },
  },
  {
    id: 'co2', type: 'company', contract_count: 3,
    details: { name: 'Global Trade SA', cui: 'RO11223344', reg_com: 'J12/999/2018', address: 'Str. Independenței nr. 5, Cluj-Napoca', contact_name: 'Georgescu Dan', contact_phone: '0745 333 444', contact_email: 'dan@globaltrade.ro' },
  },
];

const PLAN_LIMITS = { free: 5, starter: 20, pro: 50, business: 999 };

// ─── Tweaks panel ─────────────────────────────────────────────────────────────
function TweaksPanel({ profile, setProfile, onClose }) {
  const plans = ['free', 'starter', 'pro', 'business'];
  const [used, setUsed] = React.useState(profile.contracts_used);
  const planColor = { free: '#64748b', starter: '#2563eb', pro: '#7c3aed', business: '#0f172a' };

  function applyPlan(plan) {
    setProfile(p => ({ ...p, plan, contracts_limit: PLAN_LIMITS[plan] }));
  }
  function applyUsed(val) {
    setUsed(val);
    setProfile(p => ({ ...p, contracts_used: val }));
  }

  return (
    <div className="slide-up" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderTop: '1.5px solid #e2e8f0', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', paddingBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px' }}>
        <p style={{ fontWeight: 700, fontSize: 15 }}>Tweaks</p>
        <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      {/* Plan */}
      <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', marginBottom: 10 }}>Simulează plan</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {plans.map(p => (
            <button key={p} onClick={() => applyPlan(p)} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `2px solid ${profile.plan === p ? planColor[p] : '#e2e8f0'}`, background: profile.plan === p ? '#f8fafc' : '#fff', color: profile.plan === p ? planColor[p] : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8' }}>Contracte folosite</p>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{used} / {profile.contracts_limit}</span>
        </div>
        <input type="range" min={0} max={profile.contracts_limit} value={used}
          onChange={e => applyUsed(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#2563eb' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>0</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{profile.contracts_limit}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen]         = React.useState('loading');
  const [profile, setProfile]       = React.useState(EMPTY_PROFILE);
  const [contracts, setContracts]   = React.useState([]);
  const [assets, setAssets]         = React.useState(MOCK_ASSETS);
  const [showTweaks, setShowTweaks] = React.useState(false);

  async function loadProfile(userId, userEmail) {
    const { data } = await window.sb.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile({ ...EMPTY_PROFILE, ...data });
      return true;
    }
    setProfile(p => ({ ...p, email: userEmail }));
    return false;
  }

  async function loadContracts(userId) {
    const { data } = await window.sb
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setContracts(data);
  }

  React.useEffect(() => {
    // Mesaje tweaks panel
    function onMsg(e) {
      if (e.data?.type === '__activate_edit_mode')   setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    // Verifică sesiunea existentă la mount
    window.sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const [hasProfile] = await Promise.all([
          loadProfile(session.user.id, session.user.email),
          loadContracts(session.user.id),
        ]);
        setScreen(hasProfile ? 'dashboard' : 'onboarding');
      } else {
        setScreen('landing');
      }
    });

    // Ascultă schimbări de auth (login / logout)
    const { data: { subscription } } = window.sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const [hasProfile] = await Promise.all([
          loadProfile(session.user.id, session.user.email),
          loadContracts(session.user.id),
        ]);
        setScreen(hasProfile ? 'dashboard' : 'onboarding');
      }
      if (event === 'SIGNED_OUT') {
        setProfile(EMPTY_PROFILE);
        setContracts([]);
        setScreen('landing');
      }
    });

    return () => {
      window.removeEventListener('message', onMsg);
      subscription.unsubscribe();
    };
  }, []);

  function navigate(to) { setScreen(to); setShowTweaks(false); }

  async function logout() {
    await window.sb.auth.signOut();
    // onAuthStateChange gestionează navigarea
  }

  async function addContract(c) {
    const { data: { user } } = await window.sb.auth.getUser();
    if (user) {
      const row = {
        user_id:       user.id,
        template_name: c.template_name || 'Contract',
        status:        c.status        || 'generated',
        parties:       c.parties       || [],
        fields:        c.fields        || {},
        pdf_url:       c.pdf_url       || null,
        file_name:     c.file_name     || null,
        file_size:     c.file_size     || null,
        source:        c.source        || 'generated',
        notes:         c.notes         || null,
        created_at:    c.created_at    || new Date().toISOString(),
      };
      const { data } = await window.sb.from('contracts').insert(row).select().single();
      if (data) {
        setContracts(prev => [data, ...prev]);
        setProfile(p => ({ ...p, contracts_used: (p.contracts_used || 0) + 1 }));
        return data;
      }
    }
    // Fallback fără sesiune
    setContracts(prev => [{ ...c, id: Date.now().toString() }, ...prev]);
  }

  function closeTweaks() {
    setShowTweaks(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  }

  // Loading screen în timp ce verificăm sesiunea
  if (screen === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>RapidAct.ro</p>
        </div>
      </div>
    );
  }

  const shared = { navigate, profile, setProfile, contracts, assets, setAssets, logout };

  const screens = {
    landing:        <LandingScreen navigate={navigate} />,
    login:          <LoginScreen navigate={navigate} />,
    register:       <RegisterScreen navigate={navigate} />,
    onboarding:     <OnboardingScreen navigate={navigate} />,
    dashboard:      <DashboardScreen {...shared} addContract={addContract} />,
    assets:         <AssetsScreen {...shared} />,
    history:        <HistoryScreen {...shared} addContract={addContract} />,
    settings:       <SettingsScreen {...shared} />,
    'date-personale': <DatePersonaleScreen {...shared} />,
    'date-firma':     <DateFirmaScreen {...shared} />,
    'contract-new': <ContractNewScreen {...shared} onContractCreated={addContract} />,
    'contracte':    <ContractTemplatesScreen {...shared} />,
  };

  return (
    <div style={{ position: 'relative' }}>
      {screens[screen] ?? screens.landing}

      {showTweaks && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={closeTweaks} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
            <TweaksPanel profile={profile} setProfile={setProfile} onClose={closeTweaks} />
          </div>
        </div>
      )}

      <button onClick={() => setShowTweaks(!showTweaks)} title="Tweaks" style={{
        position: 'fixed', bottom: 80, right: 'calc(50% - 230px)',
        width: 40, height: 40, borderRadius: '50%',
        background: '#0f172a', color: '#fff', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)', cursor: 'pointer', zIndex: 50,
        transition: 'transform 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <GearIcon size={18} />
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
