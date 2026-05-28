// proto/pages-auth.jsx — Landing, Login, Register, Onboarding

const {
  AppFrame, Logo, PrimaryBtn, SecondaryBtn, SectionLabel, CheckIcon,
  ChevRightIcon, SpinnerIcon, EyeIcon, EyeOffIcon,
} = window;

// ─── Landing ─────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { icon: '📸', title: '1. Scanează actul',      sub: 'Buletin, pașaport — orice act valid' },
  { icon: '⚡', title: '2. Extragere automată',  sub: 'Datele se completează instant în contract' },
  { icon: '📄', title: '3. Descarcă PDF',        sub: 'Contract gata în 30 de secunde' },
];
const PLANS = [
  { name: 'Free',       price: '0',        desc: '5 contracte / lună',    features: ['Toate template-urile', 'Watermark RapidAct.ro'],                                      featured: false },
  { name: 'Starter',    price: '99',       desc: '20 contracte / lună',   features: ['Logo personalizat', 'Multi-persoană pe contract'],                                    featured: false },
  { name: 'Pro',        price: '250',      desc: '50 contracte / lună',   features: ['Tot din Starter', 'Istoric extins', 'Export DOCX + PDF'],                             featured: true  },
  { name: 'Business',   price: '499',      desc: '150 Contracte / luna',  features: ['Custom templates', '10 Utilizatori (echipă)', 'Interfata Web'],                       featured: false },
  { name: 'Enterprise', price: 'La cerere',desc: 'Contracte nelimitate',  features: ['Tot din Business', 'API access', 'Custom Design', 'SLA dedicat', 'Onboarding asistat'], featured: false, enterprise: true },
];

function LandingScreen({ navigate }) {
  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <Logo />
        <button onClick={() => navigate('login')} style={{ background: '#2563eb', color: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Conectare
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)', padding: '40px 20px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚡</div>
          <h1 style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5, color: '#0f172a', marginBottom: 12 }}>
            Contracte completate în{' '}
            <span style={{ color: '#2563eb' }}>30 secunde</span>
          </h1>
          <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            Fă o poză buletinului. Alege contractul. Gata.<br />
            Pentru orice firmă cu contracte repetitive.
          </p>
          <button onClick={() => navigate('register')} style={{
            display: 'block', width: '100%', maxWidth: 280, margin: '0 auto',
            background: '#2563eb', color: '#fff', borderRadius: 12,
            padding: '14px', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer',
          }}>Începe gratuit →</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 18, fontSize: 13, color: '#94a3b8' }}>
            <span>✓ Fără card</span><span>✓ GDPR</span><span>✓ 5 gratuit/lună</span>
          </div>
        </section>

        <div style={{ padding: '24px 18px' }}>
          <SectionLabel>Cum funcționează</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HOW_IT_WORKS.map(s => (
              <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div><p style={{ fontWeight: 600 }}>{s.title}</p><p style={{ fontSize: 13, color: '#64748b' }}>{s.sub}</p></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}><SectionLabel>Tarife</SectionLabel></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{ position: 'relative', border: `2px solid ${plan.enterprise ? '#7c3aed' : plan.featured ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, padding: '16px 18px', background: plan.enterprise ? 'linear-gradient(180deg,#faf5ff,#fff)' : plan.featured ? 'linear-gradient(180deg,#eff6ff,#fff)' : '#fff' }}>
                {plan.featured && <span style={{ position: 'absolute', top: -10, right: 12, background: '#2563eb', color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Popular</span>}
                {plan.enterprise && <span style={{ position: 'absolute', top: -10, right: 12, background: '#7c3aed', color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Enterprise</span>}
                <p style={{ fontWeight: 700 }}>{plan.name}</p>
                <p style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 2px' }}>
                  {plan.enterprise
                    ? <span style={{ fontSize: 20, color: '#7c3aed' }}>La cerere</span>
                    : <>{plan.price} <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>RON/lună</span></>
                  }
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                  {[plan.desc, ...plan.features].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                      <CheckIcon size={13} color="#10b981" style={{ flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>Peste limită: 7 RON / contract extra.</p>
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, borderTop: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <PrimaryBtn onClick={() => navigate('register')}>Începe gratuit</PrimaryBtn>
        <button onClick={() => navigate('login')} style={{ width: '100%', marginTop: 8, padding: '10px', border: 'none', background: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer' }}>
          Am deja cont — Conectare
        </button>
      </div>
    </AppFrame>
  );
}

// M16 — Traducere mesaje de eroare Supabase Auth în română
function translateAuthError(msg) {
  if (!msg) return 'A apărut o eroare. Încearcă din nou.';
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
    return 'Email sau parolă incorectă.';
  if (m.includes('email not confirmed'))
    return 'Emailul nu a fost confirmat. Verifică inbox-ul.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Există deja un cont cu acest email.';
  if (m.includes('password should be at least'))
    return 'Parola trebuie să aibă minim 6 caractere.';
  if (m.includes('rate limit') || m.includes('too many requests'))
    return 'Prea multe încercări. Încearcă din nou în câteva minute.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Eroare de rețea. Verifică conexiunea la internet.';
  if (m.includes('user not found'))
    return 'Nu există niciun cont cu acest email.';
  return msg; // fallback: păstrăm mesajul original dacă nu-l recunoaștem
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ navigate }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError('Completează toate câmpurile.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('Adresa de email nu este validă.'); return; }
    setError(''); setLoading(true);
    const { error } = await window.sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(translateAuthError(error.message)); return; }
    // onAuthStateChange din App.jsx gestionează navigarea
  }

  return (
    <AppFrame>
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Logo size={26} />
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>Intră în contul tău</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
            <FocusInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@firma.ro" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Parolă</label>
            <div style={{ position: 'relative' }}>
              <FocusInput type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Parola ta" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}

          <PrimaryBtn disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><SpinnerIcon size={18} /> Se conectează...</> : 'Conectare'}
          </PrimaryBtn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Nu ai cont?{' '}
          <button onClick={() => navigate('register')} style={{ color: '#2563eb', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}>
            Înregistrează-te
          </button>
        </p>
      </div>
    </AppFrame>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────
function RegisterScreen({ navigate }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPw, setShowPw]           = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false); // M17
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [infoMsg, setInfoMsg] = React.useState('');

  async function handleRegister(e) {
    e.preventDefault();
    if (!email || !password) { setError('Completează toate câmpurile.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('Adresa de email nu este validă.'); return; }
    if (password !== confirm) { setError('Parolele nu coincid.'); return; }
    if (password.length < 6) { setError('Parola trebuie să aibă minim 6 caractere.'); return; }
    setError(''); setInfoMsg(''); setLoading(true);
    const { data, error } = await window.sb.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(translateAuthError(error.message)); return; }
    // Dacă e confirmare email necesară, sesiunea e null
    if (!data.session) {
      setInfoMsg('✉️ Verifică emailul pentru confirmare, apoi conectează-te.');
      return;
    }
    navigate('onboarding');
  }

  return (
    <AppFrame>
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Logo size={26} />
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>Creează un cont gratuit</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
            <FocusInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@firma.ro" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Parolă</label>
            <div style={{ position: 'relative' }}>
              <FocusInput type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minim 6 caractere" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirmă parola</label>
            <div style={{ position: 'relative' }}>
              <FocusInput type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetă parola" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {error   && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}
          {infoMsg && <p style={{ color: '#2563eb', fontSize: 13, textAlign: 'center', background: '#eff6ff', borderRadius: 8, padding: '10px 12px', lineHeight: 1.5 }}>{infoMsg}</p>}

          <PrimaryBtn disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><SpinnerIcon size={18} /> Se creează contul...</> : 'Creează cont gratuit'}
          </PrimaryBtn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
          Prin înregistrare accepți{' '}
          <span style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Termenii și condițiile</span>.
        </p>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: '#64748b' }}>
          Ai deja cont?{' '}
          <button onClick={() => navigate('login')} style={{ color: '#2563eb', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}>
            Conectare
          </button>
        </p>
      </div>
    </AppFrame>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
// M11 — sursă unică de adevăr; pages-main.jsx o citește din window.PROFILE_TYPES
const PROFILE_TYPES = [
  { id: 'rentacar',   icon: '🚗', label: 'Rent-a-car',    sub: 'Contracte de închiriere auto' },
  { id: 'imobiliare', icon: '🏠', label: 'Imobiliare',    sub: 'Închiriere / vânzare proprietăți' },
  { id: 'hr',         icon: '👥', label: 'Resurse Umane', sub: 'Contracte de muncă' },
  { id: 'general',    icon: '📋', label: 'General',       sub: 'Alte tipuri de contracte' },
];
window.PROFILE_TYPES = PROFILE_TYPES;

function OnboardingScreen({ navigate }) {
  const [step, setStep] = React.useState(0);
  const [profileType, setProfileType] = React.useState('');
  const [firmName, setFirmName] = React.useState('');
  const [firmCui, setFirmCui] = React.useState('');
  const [firmAddress, setFirmAddress] = React.useState('');
  const [firmReg, setFirmReg] = React.useState('');
  const [legalRep, setLegalRep] = React.useState('');
  const [cuiLoading, setCuiLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function lookupCui() {
    if (firmCui.replace(/\D/g, '').length < 5) return;
    setCuiLoading(true);
    try {
      const res  = await fetch(`https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/anaf-lookup?cui=${encodeURIComponent(firmCui)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Eroare ANAF');
      setFirmName(json.firm_name    || '');
      setFirmAddress(json.firm_address || '');
      setFirmReg(json.firm_reg      || '');
    } catch (err) {
      console.error('ANAF lookup:', err.message);
    } finally {
      setCuiLoading(false);
    }
  }

  async function handleFinish() {
    setSaving(true);
    const { data: { user } } = await window.sb.auth.getUser();
    if (user) {
      await window.sb.from('profiles').upsert({
        id: user.id,
        email: user.email,
        firm_name: firmName,
        firm_cui: firmCui,
        firm_address: firmAddress,
        firm_reg: firmReg,
        legal_rep: legalRep,
        profile_type: profileType,
        plan: 'free',
        contracts_used: 0,
        contracts_limit: 5,
        watermark_enabled: true,
        updated_at: new Date().toISOString(),
      });
    }
    setSaving(false);
    navigate('dashboard');
  }

  return (
    <AppFrame>
      <header style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Pasul {step+1} / 2</span>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 32px' }}>
        {step === 0 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tipul profilului</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Alege domeniul principal de activitate pentru template-uri relevante.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PROFILE_TYPES.map(pt => (
                <button key={pt.id} onClick={() => { setProfileType(pt.id); setStep(1); }} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  border: `2px solid ${profileType === pt.id ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 12, padding: '14px 16px', background: profileType === pt.id ? '#eff6ff' : '#fff',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{pt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{pt.label}</p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>{pt.sub}</p>
                  </div>
                  <ChevRightIcon size={18} color="#cbd5e1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Date firmă</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Acestea se completează automat în fiecare contract generat.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>CUI firmă</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FocusInput value={firmCui} onChange={e => setFirmCui(e.target.value)} placeholder="ex. RO12345678" style={{ flex: 1 }} />
                  <button onClick={lookupCui} disabled={cuiLoading || firmCui.length < 6} style={{ padding: '11px 14px', borderRadius: 10, border: 'none', background: cuiLoading || firmCui.length < 6 ? '#f1f5f9' : '#2563eb', color: cuiLoading || firmCui.length < 6 ? '#94a3b8' : '#fff', fontWeight: 600, fontSize: 13, cursor: cuiLoading || firmCui.length < 6 ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {cuiLoading ? '...' : '🔍 ANAF'}
                  </button>
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Lookup automat via ANAF</p>
              </div>
              <div>
                <label style={labelStyle}>Denumire firmă</label>
                <FocusInput value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="ex. AutoLux SRL" />
              </div>
              <div>
                <label style={labelStyle}>Adresă sediu</label>
                <FocusInput value={firmAddress} onChange={e => setFirmAddress(e.target.value)} placeholder="Str., nr., oraș" />
              </div>
              <div>
                <label style={labelStyle}>Nr. Reg. Comerțului</label>
                <FocusInput value={firmReg} onChange={e => setFirmReg(e.target.value)} placeholder="ex. J40/1234/2020" />
              </div>
              <div>
                <label style={labelStyle}>Reprezentant legal</label>
                <FocusInput value={legalRep} onChange={e => setLegalRep(e.target.value)} placeholder="Nume și prenume" />
              </div>
            </div>
          </div>
        )}
      </div>

      {step === 1 && (
        <div style={{ borderTop: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryBtn onClick={handleFinish} disabled={saving || !firmName}>
            {saving ? <><SpinnerIcon size={18} /> Se salvează...</> : 'Finalizează →'}
          </PrimaryBtn>
          <button onClick={() => setStep(0)} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>← Înapoi</button>
        </div>
      )}
    </AppFrame>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 };

// ─── Reusable focused input ───────────────────────────────────────────────────
function FocusInput({ type='text', value, onChange, placeholder, style: extraStyle={} }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '12px 13px',
        border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
        borderRadius: 10, background: '#fff', outline: 'none', fontSize: 15,
        boxShadow: focused ? '0 0 0 3px #dbeafe' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...extraStyle,
      }}
    />
  );
}

Object.assign(window, { LandingScreen, LoginScreen, RegisterScreen, OnboardingScreen, FocusInput });
