// proto/app.jsx — Root App with navigation + mock data + tweaks

const {
  LandingScreen, LoginScreen, RegisterScreen, OnboardingScreen,
  DashboardScreen, AssetsScreen, HistoryScreen, SettingsScreen,
  DatePersonaleScreen, DateFirmaScreen,
  ContractNewScreen, ContractTemplatesScreen,
  GearIcon,
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
  cnp: '', ci_serie: '', ci_nr: '', ci_valabilitate: '', data_nastere: '', adresa: '', signature: null,
  permis_serie: '', permis_nr: '', permis_categorii: '', permis_expirare: '',
};


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
  const [assets, setAssets]         = React.useState([]);
  const [showTweaks, setShowTweaks] = React.useState(false);

  // H11 — guard race condition getSession + onAuthStateChange
  const sessionInitialized = React.useRef(false);

  async function loadProfile(userId, userEmail) {
    try {
      const { data, error } = await window.sb.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows (profil nou)
      if (data) {
        setProfile({ ...EMPTY_PROFILE, ...data });
        return true;
      }
      setProfile(p => ({ ...p, email: userEmail }));
      return false;
    } catch (err) {
      console.error('[RapidAct] loadProfile error:', err);
      setProfile(p => ({ ...p, email: userEmail }));
      return false;
    }
  }

  async function loadContracts(userId) {
    try {
      const { data, error } = await window.sb
        .from('contracts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setContracts(data);
    } catch (err) {
      console.error('[RapidAct] loadContracts error:', err);
    }
  }

  async function loadAssets(userId) {
    try {
      const { data, error } = await window.sb
        .from('assets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setAssets(data);
    } catch (err) {
      console.error('[RapidAct] loadAssets error:', err);
    }
  }

  React.useEffect(() => {
    // Mesaje tweaks panel
    function onMsg(e) {
      if (e.data?.type === '__activate_edit_mode')   setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    // H9 — fallback timeout: dacă Supabase pică, nu rămâne pe loading infinit
    const loadingTimeout = setTimeout(() => {
      setScreen(prev => prev === 'loading' ? 'landing' : prev);
    }, 8000);

    // Verifică sesiunea existentă la mount
    window.sb.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(loadingTimeout);
      sessionInitialized.current = true;
      if (session) {
        const [hasProfile] = await Promise.all([
          loadProfile(session.user.id, session.user.email),
          loadContracts(session.user.id),
          loadAssets(session.user.id),
        ]);
        setScreen(hasProfile ? 'dashboard' : 'onboarding');
      } else {
        setScreen('landing');
      }
    }).catch(err => {
      console.error('[RapidAct] getSession error:', err);
      clearTimeout(loadingTimeout);
      setScreen('landing');
    });

    // Ascultă schimbări de auth (login / logout)
    const { data: { subscription } } = window.sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // H11 — skip dacă getSession a inițializat deja sesiunea
        if (sessionInitialized.current) { sessionInitialized.current = false; return; }
        const [hasProfile] = await Promise.all([
          loadProfile(session.user.id, session.user.email),
          loadContracts(session.user.id),
          loadAssets(session.user.id),
        ]);
        setScreen(hasProfile ? 'dashboard' : 'onboarding');
      }
      if (event === 'SIGNED_OUT') {
        sessionInitialized.current = false;
        setProfile(EMPTY_PROFILE);
        setContracts([]);
        setAssets([]);
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
      // asset_id e UUID în DB — includem doar dacă arată a UUID valid
      const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const row = {
        user_id:       user.id,
        template_id:   c.template_id   || (c.template_name || 'contract').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        template_name: c.template_name || 'Contract',
        status:        c.status        || 'generated',
        parties:       c.parties       || [],
        fields:        c.fields        || {},
        pdf_url:       c.pdf_url       || null,
        asset_id:      (c.asset_id && uuidRe.test(c.asset_id)) ? c.asset_id : null,
        created_at:    c.created_at    || new Date().toISOString(),
      };
      const { data, error } = await window.sb.from('contracts').insert(row).select().single();
      if (error) {
        console.error('[RapidAct] Contract insert error:', error);
        throw new Error(error.message || 'Eroare la salvarea contractului în baza de date.');
      }
      if (data) {
        setContracts(prev => [data, ...prev]);
        const newUsed = (profile.contracts_used || 0) + 1;
        setProfile(p => ({ ...p, contracts_used: newUsed }));
        // Actualizează contorul și în DB
        window.sb.from('profiles')
          .update({ contracts_used: newUsed, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        return data;
      }
    }
    // Fallback fără sesiune (utilizator neautentificat)
    const localContract = { ...c, id: Date.now().toString() };
    setContracts(prev => [localContract, ...prev]);
    return localContract;
  }

  async function addAsset(a) {
    try {
      const { data: { user } } = await window.sb.auth.getUser();
      if (user) {
        const d = a.details || {};
        const nameByType = { car: d.plate || d.make || 'Mașină', property: d.name || 'Proprietate', company: d.name || 'Companie' };
        const row = {
          user_id: user.id,
          type:    a.type,
          name:    nameByType[a.type] || 'Activ',
          address: d.address || null,
          details: d,
        };
        const { data, error } = await window.sb.from('assets').insert(row).select().single();
        if (error) {
          console.error('[RapidAct] Asset insert error:', error);
          throw new Error(error.message || 'Insert failed');
        }
        if (data) { setAssets(prev => [data, ...prev]); return data; }
      }
    } catch(e) {
      console.error('[RapidAct] addAsset error:', e);
      throw e; // re-throw so handleSave can catch and show error UI
    }
    // Fallback fără sesiune
    setAssets(prev => [{ ...a, id: Date.now().toString() }, ...prev]);
  }

  async function deleteAsset(id) {
    setAssets(prev => prev.filter(a => a.id !== id));
    const { data: { user } } = await window.sb.auth.getUser();
    if (user) {
      const { error } = await window.sb.from('assets').delete().eq('id', id).eq('user_id', user.id);
      if (error) console.error('[RapidAct] Asset delete error:', error);
    }
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

  const shared = { navigate, profile, setProfile, contracts, assets, setAssets, logout, addAsset, deleteAsset };

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
    'contract-new':        <ContractNewScreen {...shared} onContractCreated={addContract} />,
    'contracte':           <ContractTemplatesScreen {...shared} />,
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

      {/* B1 — TweaksPanel vizibil doar în iframe (preview/dev), ascuns în producție */}
      {window !== window.parent && (
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
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
