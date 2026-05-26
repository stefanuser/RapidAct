// proto/pages-main.jsx — Dashboard, Assets, History, Settings

const {
  AppFrame, BottomNav, StatusBadge, Avatar, SectionLabel, PrimaryBtn, SecondaryBtn,
  PlusIcon, ChevRightIcon, FileTextIcon, ArchiveIcon, LogOutIcon,
  Building2Icon, CreditCardIcon, ShieldIcon, UserIcon, SpinnerIcon, CheckIcon,
  EditIcon,
} = window;

// ─── Shared sheet primitive (local) ──────────────────────────────────────────
function Sheet({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', paddingTop: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Profile types ────────────────────────────────────────────────────────────
const PROFILE_TYPES_LIST = [
  { id: 'rentacar',   icon: '🚗', label: 'Rent-a-car',    sub: 'Contracte de închiriere auto' },
  { id: 'imobiliare', icon: '🏠', label: 'Imobiliare',    sub: 'Închiriere / vânzare proprietăți' },
  { id: 'hr',         icon: '👥', label: 'Resurse Umane', sub: 'Contracte de muncă' },
  { id: 'general',    icon: '📋', label: 'General',       sub: 'Alte tipuri de contracte' },
];
const PROFILE_TYPE_MAP = Object.fromEntries(PROFILE_TYPES_LIST.map(p => [p.id, p]));

// ─── Dashboard ───────────────────────────────────────────────────────────────
function DashboardScreen({ navigate, profile, contracts }) {
  const used  = profile.contracts_used;
  const limit = profile.contracts_limit;
  const pct   = Math.min(Math.round((used / limit) * 100), 100);
  const recent = contracts.slice(0, 4);

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Bună,</p>
          <p style={{ fontWeight: 600 }}>{profile.firm_name} 👋</p>
        </div>
        <button onClick={() => navigate('contract-new')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#2563eb', color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <PlusIcon size={15} /> Nou
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Quick action */}
        <div>
          <SectionLabel>Acțiuni rapide</SectionLabel>
          <button onClick={() => navigate('contract-new')} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#93c5fd'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusIcon size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600 }}>Contract nou</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Scanează CI și generează în 30 sec</p>
            </div>
            <ChevRightIcon size={18} color="#cbd5e1" />
          </button>
        </div>

        {/* Recent */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <SectionLabel>Recente</SectionLabel>
            <button onClick={() => navigate('history')} style={{ fontSize: 13, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Vezi toate →
            </button>
          </div>
          {recent.length === 0 ? (
            <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: 12, padding: '32px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 36, opacity: 0.3 }}>📄</p>
              <p style={{ marginTop: 10, color: '#94a3b8', fontSize: 14 }}>Niciun contract încă.</p>
              <button onClick={() => navigate('contract-new')} style={{ marginTop: 8, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Fă primul contract →</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(c => <ContractRow key={c.id} contract={c} />)}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="dashboard" navigate={navigate} />
    </AppFrame>
  );
}

function ContractRow({ contract: c }) {
  const [open, setOpen] = React.useState(false);
  const name = c.parties?.[0]?.name ?? '—';
  const date = new Date(c.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  return (
    <>
      <div onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
        <Avatar name={name} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
          <p style={{ fontSize: 12, color: '#64748b' }}>{c.template_name} · {date}</p>
        </div>
        <StatusBadge status={c.status} />
      </div>
      {open && <ContractDetailSheet contract={c} onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────
function HistoryScreen({ navigate, contracts, addContract }) {
  const [search, setSearch]     = React.useState('');
  const [selected, setSelected] = React.useState(null);
  const [showUpload, setUpload] = React.useState(false);

  const filtered = contracts.filter(c => {
    if (!search) return true;
    const name = (c.parties?.[0]?.name ?? '').toLowerCase();
    const tpl  = (c.template_name ?? '').toLowerCase();
    const q    = search.toLowerCase();
    return name.includes(q) || tpl.includes(q);
  });

  const groups = {};
  for (const c of filtered) {
    const key = new Date(c.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  }

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
          <p style={{ fontWeight: 700, fontSize: 18 }}>Arhivă</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#f1f5f9', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{contracts.length} total</span>
            <button onClick={() => setUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#2563eb', color: '#fff', borderRadius: 10, padding: '6px 12px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              <PlusIcon size={14} /> Adaugă
            </button>
          </div>
        </div>
        <div style={{ padding: '0 18px 12px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Caută după nume..."
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', fontSize: 14, outline: 'none' }} />
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 100px' }}>
        {contracts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <ArchiveIcon size={28} color="#94a3b8" />
            </div>
            <p style={{ fontWeight: 600, color: '#334155' }}>Arhiva e goală</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Generează un contract sau adaugă unul existent.</p>
            <button onClick={() => setUpload(true)} style={{ marginTop: 14, background: '#2563eb', color: '#fff', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              + Adaugă contract
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 60, fontSize: 14 }}>Niciun rezultat pentru „{search}".</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {Object.entries(groups).map(([month, items]) => (
              <div key={month}>
                <SectionLabel>{month}</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(c => (
                    <div key={c.id}
                      onClick={() => setSelected(c)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${c.source === 'uploaded' ? '#e9d5ff' : '#e2e8f0'}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', background: '#fff', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <Avatar name={c.parties?.[0]?.name ?? '—'} size={38}
                        from={c.source === 'uploaded' ? '#7c3aed' : '#64748b'}
                        to={c.source === 'uploaded' ? '#a855f7' : '#334155'} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.parties?.[0]?.name ?? '—'}</p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>{c.template_name} · {new Date(c.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="history" navigate={navigate} />

      {selected && <ContractDetailSheet contract={selected} onClose={() => setSelected(null)} />}
      {showUpload && <AddContractSheet onClose={() => setUpload(false)} onAdd={addContract} />}
    </AppFrame>
  );
}

// ─── Upload Contract Sheet ────────────────────────────────────────────────────
const CONTRACT_TYPES = ['Închiriere Auto', 'Imobiliare', 'Prestări Servicii', 'Contract Muncă', 'Altul'];

function AddContractSheet({ onClose, onAdd }) {
  const [file, setFile]         = React.useState(null);
  const [type, setType]         = React.useState('Închiriere Auto');
  const [party, setParty]       = React.useState('');
  const [date, setDate]         = React.useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes]       = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [error, setError]       = React.useState('');
  const fileRef = React.useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else if (f) setError('Alege un fișier PDF.');
    e.target.value = '';
  }

  async function handleUpload() {
    if (!file)  { setError('Selectează un fișier PDF.'); return; }
    if (!party) { setError('Completează persoana/firma.'); return; }
    setUploading(true); setError('');
    try {
      const { data: { user } } = await window.sb.auth.getUser();
      if (!user) throw new Error('Neautentificat — reconectează-te.');

      // Upload în Storage
      const uid  = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
      const path = `${user.id}/${uid}.pdf`;
      const { error: upErr } = await window.sb.storage
        .from('contracts').upload(path, file, { contentType: 'application/pdf' });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = window.sb.storage.from('contracts').getPublicUrl(path);

      await onAdd({
        template_name: type,
        status:        'uploaded',
        parties:       [{ name: party }],
        fields:        {},
        pdf_url:       publicUrl,
        file_name:     file.name,
        file_size:     file.size,
        source:        'uploaded',
        notes:         notes || null,
        created_at:    new Date(date + 'T12:00:00').toISOString(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Eroare la upload');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Sheet onClose={uploading ? undefined : onClose}>
      <div style={{ padding: '4px 20px 32px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Adaugă contract existent</p>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* File picker */}
        <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: 90, border: `2px dashed ${file ? '#10b981' : '#cbd5e1'}`,
          borderRadius: 12, background: file ? '#f0fdf4' : '#f8fafc',
          cursor: 'pointer', marginBottom: 16, gap: 4, transition: 'all 0.15s',
        }}>
          {file ? (
            <>
              <span style={{ fontSize: 24 }}>📄</span>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#065f46' }}>{file.name}</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>{(file.size / 1024).toFixed(0)} KB · PDF</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: 26 }}>⬆️</span>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#334155' }}>Alege fișier PDF</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>Max 10 MB</p>
            </>
          )}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Tip contract', el: (
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#0f172a' }}>
                {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            )},
            { label: 'Persoană / Firmă', el: (
              <input value={party} onChange={e => setParty(e.target.value)} placeholder="ex. Ionescu Alexandru" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            )},
            { label: 'Data contractului', el: (
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            )},
            { label: 'Note (opțional)', el: (
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observații..." rows={2} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none' }} />
            )},
          ].map(({ label, el }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
              {el}
            </div>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 10 }}>{error}</p>}

        <button onClick={handleUpload} disabled={uploading} style={{
          marginTop: 18, width: '100%', padding: 14, borderRadius: 12,
          background: uploading ? '#cbd5e1' : '#2563eb',
          color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {uploading ? <><SpinnerIcon size={18} color="#fff" /> Se încarcă...</> : '⬆️  Încarcă contract'}
        </button>
      </div>
    </Sheet>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsScreen({ navigate, profile, setProfile, logout }) {
  const [signingOut, setSigning]       = React.useState(false);
  const [showTypePicker, setShowType]  = React.useState(false);
  const [showSignature, setShowSig]    = React.useState(false);
  const [toast, setToast]              = React.useState('');
  const [appVer, setAppVer]            = React.useState(null);
  React.useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2800); return () => clearTimeout(t); } }, [toast]);
  React.useEffect(() => {
    fetch('./version.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => setAppVer(d))
      .catch(() => {});
  }, []);

  async function handleSignOut() {
    setSigning(true);
    await logout();
    // onAuthStateChange din App gestionează navigarea la 'landing'
  }

  async function handleSaveSig(sig) {
    setProfile(p => ({ ...p, signature: sig }));
    setShowSig(false);
    const { data: { user } } = await window.sb.auth.getUser();
    if (user) {
      const { error } = await window.sb.from('profiles')
        .update({ signature: sig, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) console.error('[RapidAct] Signature save error:', error);
    }
    setToast('Semnătură salvată ✓');
  }

  const used  = profile.contracts_used;
  const limit = profile.contracts_limit;
  const pct   = Math.min(Math.round((used / limit) * 100), 100);
  const currentType = PROFILE_TYPE_MAP[profile.profile_type] ?? PROFILE_TYPES_LIST[0];

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <p style={{ fontWeight: 700, fontSize: 18 }}>Profil</p>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Identity card */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar name={profile.firm_name} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.firm_name}</p>
            <p style={{ fontSize: 13, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.email}</p>
            <span style={{ display: 'inline-block', marginTop: 4, background: '#dbeafe', color: '#1e40af', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
              Plan {profile.plan}
            </span>
          </div>
        </div>

        {/* Domeniu activitate */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px 8px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8' }}>Domeniu activitate</p>
          </div>
          <button onClick={() => setShowType(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 14px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{currentType.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{currentType.label}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{currentType.sub}</p>
            </div>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, flexShrink: 0 }}>Schimbă</span>
          </button>
        </div>

        {/* Semnătură */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8' }}>Semnătura mea</p>
            <button onClick={() => setShowSig(true)} style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>
              {profile.signature ? 'Modifică' : '+ Adaugă'}
            </button>
          </div>
          <div style={{ padding: '4px 14px 14px' }}>
            {profile.signature ? (
              <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#fafafa', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <img src={profile.signature} alt="Semnătură" style={{ height: 48, maxWidth: 200, objectFit: 'contain' }} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ Salvată</p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>Se va adăuga în contracte</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowSig(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: '1.5px dashed #e2e8f0', borderRadius: 10, padding: '14px', background: '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <span style={{ fontSize: 24 }}>✍️</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Desenează semnătura</p>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>Se va completa automat în contracte</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Usage */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
          <SectionLabel>Utilizare lunară</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{used}</span>
            <span style={{ fontSize: 13, color: '#94a3b8', paddingBottom: 4 }}>/ {limit} contracte</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#ef4444' : '#2563eb', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
          {profile.plan === 'free' && (
            <button style={{ marginTop: 12, width: '100%', padding: 10, borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#2563eb,#10b981)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Upgrade plan →
            </button>
          )}
        </div>

        {/* Menu */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          {(() => {
            const hasCI      = profile.cnp && profile.ci_serie && profile.ci_nr;
            const hasPermis  = profile.permis_nr && profile.permis_serie;
            const hasFirma   = profile.firm_cui && profile.firm_name;
            const personalSub = hasCI
              ? `${profile.legal_rep || 'Date salvate'} · CI ✓${hasPermis ? ' + Permis ✓' : ''}`
              : 'Necompletat — scanează CI';
            const firmaSub = hasFirma
              ? `${profile.firm_name} · ${profile.firm_cui}`
              : 'Necompletat';
            const items = [
              { Icon: UserIcon,       label: 'Date personale',   sub: personalSub, onClick: () => navigate('date-personale') },
              { Icon: Building2Icon,  label: 'Date firmă',       sub: firmaSub,    onClick: () => navigate('date-firma') },
              { Icon: FileTextIcon,   label: 'Contractele mele', sub: 'Template-uri, favorite, încărcate', onClick: () => navigate('contracte') },
              { Icon: CreditCardIcon, label: 'Plan și plăți',    sub: `Plan ${profile.plan} · ${used}/${limit} contracte`, onClick: () => setToast('Plan și plăți — vine în curând 🚀') },
              { Icon: ShieldIcon,     label: 'Securitate',       sub: 'Parolă, 2FA', onClick: () => setToast('Securitate (parolă, 2FA) — vine în curând 🔐') },
            ];
            return items.map(({ Icon, label, sub, onClick }, i) => (
              <MenuItem key={label} Icon={Icon} label={label} sub={sub} last={i === items.length - 1} onClick={onClick} />
            ));
          })()}
        </div>

        {/* Sign out */}
        <div style={{ border: '1px solid #fee2e2', borderRadius: 14, overflow: 'hidden' }}>
          <button onClick={handleSignOut} disabled={signingOut} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: '14px 16px', border: 'none', background: '#fff', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {signingOut ? <SpinnerIcon size={18} color="#ef4444" /> : <LogOutIcon size={18} color="#ef4444" />}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>{signingOut ? 'Se deconectează...' : 'Deconectare'}</span>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#ef4444', lineHeight: 1.8, fontWeight: 600 }}>
          RapidAct.ro · v{appVer ? appVer.version : '1.0.0'}
          {appVer && appVer.commit !== 'dev' && (
            <><br /><span style={{ fontSize: 11, color: '#f87171', fontWeight: 500 }}>#{appVer.commit} · {appVer.date} {appVer.time}</span></>
          )}
        </p>
      </div>

      <BottomNav active="settings" navigate={navigate} />

      {/* Profile type picker */}
      {showTypePicker && (
        <ProfileTypeSheet
          current={profile.profile_type}
          onSelect={type => { setProfile(p => ({ ...p, profile_type: type })); setShowType(false); }}
          onClose={() => setShowType(false)}
        />
      )}

      {/* Signature sheet */}
      {showSignature && (
        <SignatureSheet
          current={profile.signature}
          onSave={handleSaveSig}
          onClose={() => setShowSig(false)}
        />
      )}

      {/* Coming soon toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', borderRadius: 12, padding: '11px 18px', fontSize: 13, fontWeight: 500, zIndex: 300, maxWidth: 320, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease' }}>
          {toast}
        </div>
      )}
    </AppFrame>
  );
}

function MenuItem({ Icon, label, sub, last, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: '13px 16px', border: 'none', borderBottom: last ? 'none' : '1px solid #f1f5f9', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color="#64748b" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>}
      </div>
      <ChevRightIcon size={16} color="#cbd5e1" />
    </button>
  );
}

// ─── Profile Type Picker Sheet ────────────────────────────────────────────────
function ProfileTypeSheet({ current, onSelect, onClose }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px' }}>
        <p style={{ fontWeight: 700, fontSize: 16 }}>Domeniu activitate</p>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>
      <div style={{ padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PROFILE_TYPES_LIST.map(pt => {
          const active = current === pt.id;
          return (
            <button key={pt.id} onClick={() => onSelect(pt.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%',
              border: `2px solid ${active ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: 12, padding: '13px 14px',
              background: active ? '#eff6ff' : '#fff',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: active ? '#dbeafe' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{pt.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: active ? '#1e40af' : '#0f172a' }}>{pt.label}</p>
                <p style={{ fontSize: 12, color: active ? '#3b82f6' : '#94a3b8' }}>{pt.sub}</p>
              </div>
              {active && <CheckIcon size={18} color="#2563eb" />}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

// ─── Signature Sheet ──────────────────────────────────────────────────────────
function SignatureSheet({ current, onSave, onClose }) {
  const canvasRef   = React.useRef(null);
  const [drawing, setDrawing]     = React.useState(false);
  const [hasStrokes, setStrokes]  = React.useState(false);
  const [tab, setTab]             = React.useState(current ? 'preview' : 'draw'); // draw | preview

  React.useEffect(() => {
    if (tab === 'draw' && canvasRef.current && current) {
      // clear canvas on switch to draw
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setStrokes(false);
    }
  }, [tab]);

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / r.width;
    const scaleY = canvasRef.current.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * scaleX, y: (src.clientY - r.top) * scaleY };
  }

  function startDraw(e) {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokes(true);
  }

  function endDraw(e) { e.preventDefault(); setDrawing(false); }

  function clear() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes(false);
  }

  function save() {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
  }

  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
        <p style={{ fontWeight: 700, fontSize: 16 }}>Semnătura mea</p>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      {/* Tabs */}
      {current && (
        <div style={{ display: 'flex', gap: 6, padding: '0 20px 14px' }}>
          {['draw', 'preview'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '7px', borderRadius: 10, border: 'none',
              background: tab === t ? '#0f172a' : '#f1f5f9',
              color: tab === t ? '#fff' : '#64748b',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              {t === 'draw' ? '✍️ Redesenează' : '👁 Previzualizare'}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '0 20px' }}>
        {tab === 'preview' && current ? (
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#fafafa', padding: 16, textAlign: 'center', marginBottom: 16 }}>
            <img src={current} alt="Semnătură salvată" style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Trasează semnătura cu degetul sau mouse-ul:</p>
            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#fff', overflow: 'hidden', position: 'relative' }}>
              <canvas
                ref={canvasRef}
                width={360}
                height={130}
                style={{ display: 'block', width: '100%', touchAction: 'none', cursor: 'crosshair' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
              />
              {!hasStrokes && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <p style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>Semnătura ta aici...</p>
                </div>
              )}
            </div>
            {hasStrokes && (
              <button onClick={clear} style={{ marginTop: 6, width: '100%', padding: '7px', border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                Șterge și redesenează
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ padding: '12px 20px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tab !== 'preview' && (
          <PrimaryBtn onClick={save} disabled={!hasStrokes} bg="#0f172a">
            Salvează semnătura
          </PrimaryBtn>
        )}
        {tab === 'preview' && (
          <PrimaryBtn onClick={onClose}>Închide</PrimaryBtn>
        )}
      </div>
    </Sheet>
  );
}

// ─── Contract Detail Sheet ────────────────────────────────────────────────────
function ContractDetailSheet({ contract: c, onClose }) {
  const [emailStep, setEmailStep]   = React.useState('idle'); // idle | form | sending | sent
  const [emailAddr, setEmailAddr]   = React.useState('');
  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const name = c.parties?.[0]?.name ?? '—';
  const date = new Date(c.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

  async function handleDownload() {
    if (c.pdf_url) {
      // Contract real — deschide/descarcă fișierul
      const a = document.createElement('a');
      a.href = c.pdf_url;
      a.download = c.file_name || `${c.template_name}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setDownloaded(true);
      return;
    }
    setDownloading(true);
    await new Promise(r => setTimeout(r, 1000));
    setDownloading(false);
    setDownloaded(true);
  }

  function handleSendEmail() {
    const subject = encodeURIComponent(`${c.template_name} – ${name}`);
    const body = encodeURIComponent(
      `Bună ziua,\n\nVă transmitem contractul dumneavoastră.\n\nDetalii contract:\n` +
      `• Tip: ${c.template_name}\n• Client: ${name}\n• Data: ${date}\n\n` +
      `⚠️ Vă rugăm să atașați fișierul PDF la acest email înainte de a-l trimite.\n\n` +
      `Cu stimă`
    );
    window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
    setEmailStep('sent');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px 14px', borderBottom: '1px solid #f1f5f9' }}>
          <Avatar name={name} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{c.template_name} · {date}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <StatusBadge status={c.status} />
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Download */}
          <button onClick={handleDownload} disabled={downloading} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: `1.5px solid ${downloaded ? '#6ee7b7' : '#e2e8f0'}`, borderRadius: 12, padding: '14px 16px', background: downloaded ? '#f0fdf4' : '#fff', cursor: downloading ? 'wait' : 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { if (!downloading && !downloaded) e.currentTarget.style.borderColor = '#93c5fd'; }}
            onMouseLeave={e => { if (!downloaded) e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: downloaded ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {downloading ? <SpinnerIcon size={20} color="#2563eb" /> : downloaded ? '✅' : '⬇️'}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: downloaded ? '#065f46' : '#0f172a' }}>
                {downloading ? 'Se pregătește PDF...' : downloaded ? 'PDF descărcat!' : 'Descarcă PDF'}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{downloaded ? 'Salvat în dispozitiv' : 'Fiscă semnată în format PDF'}</p>
            </div>
          </button>

          {/* Email */}
          {emailStep === 'idle' && (
            <button onClick={() => setEmailStep('form')} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#93c5fd'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📧</div>
              <div>
                <p style={{ fontWeight: 600 }}>Trimite pe email</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Trimite PDF-ul către client</p>
              </div>
            </button>
          )}

          {emailStep === 'form' && (
            <div style={{ border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '14px 16px', background: '#eff6ff' }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#1e40af' }}>📧 Trimite pe email</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={emailAddr} onChange={e => setEmailAddr(e.target.value)}
                  placeholder="email@client.ro" type="email"
                  style={{ flex: 1, padding: '9px 11px', border: '1.5px solid #bfdbfe', borderRadius: 9, background: '#fff', outline: 'none', fontSize: 13, fontFamily: 'inherit' }} />
                <button onClick={handleSendEmail} disabled={!emailAddr.includes('@')}
                  style={{ padding: '9px 14px', borderRadius: 9, border: 'none', background: !emailAddr.includes('@') ? '#e2e8f0' : '#2563eb', color: !emailAddr.includes('@') ? '#94a3b8' : '#fff', fontWeight: 700, fontSize: 13, cursor: !emailAddr.includes('@') ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                  Trimite
                </button>
              </div>
              <button onClick={() => setEmailStep('idle')} style={{ marginTop: 8, border: 'none', background: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>Anulează</button>
            </div>
          )}

          {emailStep === 'sent' && (
            <div style={{ border: '1.5px solid #6ee7b7', borderRadius: 12, padding: '14px 16px', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📨</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#065f46' }}>Client email deschis</p>
                <p style={{ fontSize: 12, color: '#059669' }}>Atașează PDF-ul și apasă Trimite</p>
              </div>
            </div>
          )}

          <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: '4px', marginTop: 2 }}>Închide</button>
        </div>
      </div>
    </div>
  );
}

// ─── Assets (from pages-assets.jsx) ──────────────────────────────────────────
// AssetsScreen is exported by pages-assets.jsx (loaded after this file)

// ─── Date Personale Screen ────────────────────────────────────────────────────
const CI_FIELDS = [
  { key: 'legal_rep',       label: 'Nume și prenume',  type: 'text', placeholder: 'ex. Popescu Ion' },
  { key: 'cnp',             label: 'CNP',               type: 'text', placeholder: 'ex. 1850315400123' },
  { key: 'ci_serie',        label: 'Serie CI',           type: 'text', placeholder: 'ex. RX' },
  { key: 'ci_nr',           label: 'Număr CI',           type: 'text', placeholder: 'ex. 412305' },
  { key: 'ci_valabilitate', label: 'Valabil până',       type: 'text', placeholder: 'ex. 15/06/2035' },
  { key: 'data_nastere',    label: 'Data nașterii',      type: 'text', placeholder: 'ex. 15/03/1985' },
  { key: 'adresa',          label: 'Adresă domiciliu',   type: 'text', placeholder: 'Stradă, număr, localitate' },
];
const PERMIS_FIELDS_DEF = [
  { key: 'permis_serie',     label: 'Serie permis',  type: 'text', placeholder: 'ex. B' },
  { key: 'permis_nr',        label: 'Număr permis',  type: 'text', placeholder: 'ex. 1234567' },
  { key: 'permis_categorii', label: 'Categorii',     type: 'text', placeholder: 'ex. B, BE' },
  { key: 'permis_expirare',  label: 'Valabil până',  type: 'text', placeholder: 'ex. 15/06/2030' },
];

function DatePersonaleScreen({ navigate, profile, setProfile }) {
  const init = {
    legal_rep: profile.legal_rep || '', cnp: profile.cnp || '',
    ci_serie: profile.ci_serie || '',   ci_nr: profile.ci_nr || '',
    ci_valabilitate: profile.ci_valabilitate || '',
    data_nastere: profile.data_nastere || '', adresa: profile.adresa || '',
    permis_serie: profile.permis_serie || '', permis_nr: profile.permis_nr || '',
    permis_categorii: profile.permis_categorii || '', permis_expirare: profile.permis_expirare || '',
  };
  const [data, setData]         = React.useState(init);
  const [conf, setConf]         = React.useState({});
  const [showScan, setShowScan] = React.useState(false);
  const [saved, setSaved]       = React.useState(false);
  const [toast, setToast]       = React.useState('');

  const hasCI     = data.cnp && data.ci_serie && data.ci_nr;
  const hasPermis = data.permis_nr && data.permis_serie;

  function setField(key, val) { setData(p => ({ ...p, [key]: val })); setSaved(false); }

  function handleOcrDone(vals, confidence) {
    setData(p => ({ ...p, ...vals }));
    setConf(confidence || {});
    setShowScan(false);
    setSaved(false);
    setToast('Date extrase cu succes!');
    setTimeout(() => setToast(''), 2500);
  }

  async function handleSave() {
    setProfile(p => ({ ...p, ...data }));
    setSaved(true);
    const { data: { user } } = await window.sb.auth.getUser();
    if (user) {
      await window.sb.from('profiles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', user.id);
    }
    setToast('Datele au fost salvate');
    setTimeout(() => setToast(''), 2500);
  }

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px' }}>
        <button onClick={() => navigate('settings')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ChevLeftIcon size={16} color="#475569" />
        </button>
        <p style={{ fontWeight: 700, fontSize: 17 }}>Date personale</p>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* OCR CTA */}
        <div style={{ border: '2px solid #2563eb', borderRadius: 16, background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🪪</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>Extragere Automată</p>
              <p style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>Scanează CI + Permis și completăm totul cu AI</p>
            </div>
          </div>
          <button onClick={() => setShowScan(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <CameraIcon size={17} color="#fff" /> Scanează documente
          </button>
        </div>

        {/* Status chips */}
        {(hasCI || hasPermis) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hasCI && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#166534', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>✓ CI înregistrat</span>}
            {hasPermis && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dbeafe', color: '#1e40af', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>✓ Permis înregistrat</span>}
          </div>
        )}

        {/* CI section */}
        <div>
          <SectionLabel>🪪 Act de identitate</SectionLabel>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
            {CI_FIELDS.map((f, i) => (
              <PersonalFieldRow key={f.key} field={f} value={data[f.key]} confidence={conf[f.key]}
                onChange={v => setField(f.key, v)}
                last={i === CI_FIELDS.length - 1} />
            ))}
          </div>
        </div>

        {/* Permis section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <SectionLabel>🚗 Permis de conducere</SectionLabel>
            <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>dacă este cazul</span>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
            {PERMIS_FIELDS_DEF.map((f, i) => (
              <PersonalFieldRow key={f.key} field={f} value={data[f.key]} confidence={conf[f.key]}
                onChange={v => setField(f.key, v)}
                last={i === PERMIS_FIELDS_DEF.length - 1} />
            ))}
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} style={{ width: '100%', padding: '14px', borderRadius: 12, background: saved ? '#10b981' : '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
          {saved ? <><CheckIcon size={18} color="#fff" /> Date salvate</> : 'Salvează datele'}
        </button>

        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
          Datele sunt stocate local și folosite pentru completarea automată a contractelor.
        </p>
      </div>

      {showScan && <ProfileScanSheet onDone={handleOcrDone} onClose={() => setShowScan(false)} />}
      {toast && (
        <div className="slide-up" style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: 12, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, maxWidth: 380 }}>
          <CheckCircleIcon size={18} color="#34d399" /> {toast}
        </div>
      )}
    </AppFrame>
  );
}

// ─── Personal field row (inline edit inside card) ─────────────────────────────
function PersonalFieldRow({ field, value, confidence, onChange, last }) {
  const [focused, setFocused] = React.useState(false);
  const isUncertain = confidence === 'uncertain';
  const isOcr = confidence === 'confident';

  return (
    <div style={{ padding: '10px 16px', borderBottom: last ? 'none' : '1px solid #f1f5f9', background: isUncertain ? '#fffbeb' : '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8' }}>{field.label}</span>
        {isUncertain && <span style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}>⚠️ Verifică</span>}
        {isOcr && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ OCR</span>}
      </div>
      <input
        type={field.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 11px',
          border: `1.5px solid ${focused ? (isUncertain ? '#f59e0b' : '#2563eb') : isUncertain ? '#fbbf24' : '#e2e8f0'}`,
          borderRadius: 9, outline: 'none', fontSize: 14, fontFamily: 'inherit',
          background: isUncertain ? '#fffbeb' : '#fff', color: '#0f172a',
          boxShadow: focused ? `0 0 0 3px ${isUncertain ? '#fef3c7' : '#dbeafe'}` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  );
}

// ─── Profile Scan Sheet ───────────────────────────────────────────────────────
const PROFILE_SCAN_MODES = [
  {
    id: 'ci',
    icon: '🪪',
    label: 'Act de identitate',
    sub: 'CI, pașaport, permis de ședere',
    mockValues: {
      legal_rep: 'Popescu Ion', cnp: '1850315400123',
      ci_serie: 'RX', ci_nr: '412305',
      adresa: 'Str. Victoriei nr. 45, București, Sector 1',
      data_nastere: '15/03/1985',
    },
    mockConf: {
      legal_rep: 'confident', cnp: 'confident', ci_serie: 'confident',
      ci_nr: 'confident', adresa: 'uncertain', data_nastere: 'confident',
    },
  },
  {
    id: 'ci_permis',
    icon: '🪪', icon2: '🚗',
    label: 'CI + Permis de conducere',
    sub: 'Recomandat pentru rent-a-car',
    recommended: true,
    mockValues: {
      legal_rep: 'Popescu Ion', cnp: '1850315400123',
      ci_serie: 'RX', ci_nr: '412305',
      adresa: 'Str. Victoriei nr. 45, București, Sector 1',
      data_nastere: '15/03/1985',
      permis_serie: 'B', permis_nr: '1234567',
      permis_categorii: 'B, BE', permis_expirare: '15/03/2030',
    },
    mockConf: {
      legal_rep: 'confident', cnp: 'confident', ci_serie: 'confident',
      ci_nr: 'confident', adresa: 'uncertain', data_nastere: 'confident',
      permis_serie: 'confident', permis_nr: 'confident',
      permis_categorii: 'confident', permis_expirare: 'uncertain',
    },
  },
];

const FIELD_LABELS = {
  legal_rep: 'Nume complet', cnp: 'CNP', ci_serie: 'Serie CI', ci_nr: 'Număr CI',
  ci_valabilitate: 'Valabil până', adresa: 'Adresă', data_nastere: 'Data nașterii',
  permis_serie: 'Serie permis', permis_nr: 'Număr permis',
  permis_categorii: 'Categorii', permis_expirare: 'Valabil până',
};

function ProfileScanSheet({ onDone, onClose }) {
  const [mode, setMode]           = React.useState(null);
  const [status, setStatus]       = React.useState('idle');
  // idle | loading | loading_permis | done_ci | idle_permis | done | error
  const [scanStep, setScanStep]   = React.useState('ci'); // 'ci' | 'permis'
  const [barW, setBarW]           = React.useState(0);
  const [resultValues, setResult] = React.useState({});
  const [resultConf, setConf]     = React.useState({});
  const [ciValues, setCiValues]   = React.useState({});
  const [ciConf, setCiConf]       = React.useState({});
  const [errMsg, setErrMsg]       = React.useState('');
  const cameraRef  = React.useRef(null);
  const galleryRef = React.useRef(null);

  async function doOcr(file, step) {
    const isPermis = step === 'permis';
    setStatus(isPermis ? 'loading_permis' : 'loading');
    setBarW(0); setErrMsg('');
    let stop = false;
    // Progress bar — avansează până la 88%, apoi pulsează (nu se blochează vizual)
    (async () => {
      const steps = [12,25,40,55,68,78,85,88];
      for (const w of steps) {
        if (stop) break;
        await new Promise(r => setTimeout(r, 800));
        if (!stop) setBarW(w);
      }
      // după 88% pulsează între 88-92 până vine răspunsul
      let pulse = 88; let dir = 1;
      while (!stop) {
        await new Promise(r => setTimeout(r, 600));
        if (stop) break;
        pulse += dir * 2;
        if (pulse >= 92) dir = -1;
        if (pulse <= 88) dir = 1;
        setBarW(pulse);
      }
    })();
    try {
      // Compresie imagine: resize la max 1300px, JPEG 0.82 — reduce 4-8MB → ~200KB
      const base64 = await new Promise((res, rej) => {
        const img = new Image();
        const objUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objUrl);
          const MAX = 1300;
          let w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          res(canvas.toDataURL('image/jpeg', 0.82).split(',')[1]);
        };
        img.onerror = rej;
        img.src = objUrl;
      });
      const apiMode = isPermis ? 'ro_ci_permis' : 'ro_ci';
      const { data: { session } } = await window.sb.auth.getSession();
      // Timeout 30s — fără asta fetch poate atârna la infinit
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 30000);
      let resp;
      try {
        resp = await fetch('https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/ocr-ci', {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}) },
          body: JSON.stringify({ imageBase64: base64, mode: apiMode }),
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Eroare server OCR');
      const vals = {}, conf = {};
      // Convertește date în format românesc zz/ll/aaaa; sanitizează placeholdere GPT
      function toRoDate(s) {
        if (!s) return '';
        // GPT uneori returnează șablonul literal când nu găsește data
        if (/^[Dd]{2}[.\/-][Mm]{2}[.\/-][Yy]{4}$/.test(s)) return '';
        if (/^[Yy]{4}[.-][Mm]{2}[.-][Dd]{2}$/.test(s)) return '';
        const dd_mm_yyyy = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (dd_mm_yyyy) return `${dd_mm_yyyy[1]}/${dd_mm_yyyy[2]}/${dd_mm_yyyy[3]}`;
        const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
        return s;
      }

      if (!isPermis) {
        // Parse CI fields only
        const fn = json.first_name || '', ln = json.last_name || '';
        if (fn || ln) { vals.legal_rep = [fn, ln].filter(Boolean).join(' '); conf.legal_rep = 'confident'; }
        if (json.cnp)       { vals.cnp          = json.cnp;                   conf.cnp          = 'confident'; }
        if (json.ci_series) { vals.ci_serie     = json.ci_series;             conf.ci_serie     = 'confident'; }
        if (json.ci_number) { vals.ci_nr        = json.ci_number;             conf.ci_nr        = 'confident'; }
        // Noul CI românesc nu are adresă pe el
        if (json.birthdate)   { vals.data_nastere    = toRoDate(json.birthdate);   conf.data_nastere    = 'confident'; }
        if (json.valid_until) { vals.ci_valabilitate = toRoDate(json.valid_until); conf.ci_valabilitate = 'confident'; }
        stop = true; setBarW(100);
        if (mode && mode.id === 'ci_permis') {
          setCiValues(vals); setCiConf(conf);
          setResult(vals); setConf(conf);
          setStatus('done_ci');
        } else {
          setResult(vals); setConf(conf);
          setStatus('done');
        }
      } else {
        // Parse Permis fields only
        if (json.permis_number)     { vals.permis_nr        = json.permis_number;              conf.permis_nr        = 'confident'; }
        if (json.permis_categories) { vals.permis_categorii = json.permis_categories;          conf.permis_categorii = 'confident'; }
        if (json.permis_expiry)     { vals.permis_expirare  = toRoDate(json.permis_expiry);    conf.permis_expirare  = 'uncertain'; }
        if (json.permis_series)     { vals.permis_serie     = json.permis_series;               conf.permis_serie     = 'confident'; }
        stop = true; setBarW(100);
        setResult(prev => ({ ...prev, ...vals }));
        setConf(prev => ({ ...prev, ...conf }));
        setStatus('done');
      }
    } catch(err) {
      stop = true;
      const msg = err.name === 'AbortError'
        ? 'Timeout — scanarea a durat prea mult. Încearcă cu o poză mai clară sau mai mică.'
        : (err.message || 'Eroare la scanare. Încearcă din nou.');
      setErrMsg(msg);
      setStatus('error');
    }
  }

  function onFile(e) { const f = e.target.files?.[0]; e.target.value = ''; if (f) doOcr(f, scanStep); }

  function reset() {
    setMode(null); setStatus('idle'); setScanStep('ci');
    setBarW(0); setResult({}); setConf({});
    setCiValues({}); setCiConf({}); setErrMsg('');
  }

  function goBack() {
    if (status === 'idle_permis') { setStatus('done_ci'); setScanStep('ci'); }
    else if (status === 'done_ci') { setStatus('idle'); }
    else { reset(); }
  }

  const uncertain  = status === 'done' && Object.values(resultConf).some(c => c === 'uncertain');
  const isLoading  = status === 'loading' || status === 'loading_permis';

  function getTitle() {
    if (!mode) return 'Scanează documente';
    if (mode.id === 'ci_permis') {
      if (status === 'idle')             return 'Pasul 1 din 2 — CI';
      if (status === 'loading')          return 'Se analizează CI...';
      if (status === 'done_ci')          return 'CI scanat ✓';
      if (status === 'idle_permis')      return 'Pasul 2 din 2 — Permis';
      if (status === 'loading_permis')   return 'Se analizează Permisul...';
      if (status === 'done')             return 'Scanare completă ✓';
      if (status === 'error')            return 'Eroare scanare';
    }
    return mode.label;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px', flexShrink: 0, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {mode && (
              <button onClick={goBack} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ChevLeftIcon size={14} color="#475569" />
              </button>
            )}
            <p style={{ fontWeight: 700, fontSize: 16 }}>{getTitle()}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode && mode.id === 'ci_permis' && !['done','error'].includes(status) && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 22, height: 4, borderRadius: 99, background: '#2563eb' }} />
                <div style={{ width: 22, height: 4, borderRadius: 99, background: ['idle_permis','loading_permis'].includes(status) ? '#2563eb' : '#e2e8f0' }} />
              </div>
            )}
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 36px' }}>

          {/* Mode picker */}
          {!mode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Alege ce documente dorești să scanezi:</p>
              {PROFILE_SCAN_MODES.map(m => (
                <button key={m.id} onClick={() => { setMode(m); setScanStep('ci'); }} style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', border: `2px solid ${m.recommended ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 14, padding: '15px 16px',
                  background: m.recommended ? '#eff6ff' : '#fff',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (!m.recommended) { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f9ff'; }}}
                  onMouseLeave={e => { if (!m.recommended) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}}>
                  {m.recommended && (
                    <span style={{ position: 'absolute', top: -1, right: 14, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: '0 0 7px 7px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Recomandat
                    </span>
                  )}
                  <div style={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: m.recommended ? '#dbeafe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{m.icon}</div>
                    {m.icon2 && <div style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 8, background: '#dcfce7', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{m.icon2}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: m.recommended ? '#1e40af' : '#0f172a' }}>{m.label}</p>
                    <p style={{ fontSize: 12, color: m.recommended ? '#3b82f6' : '#64748b', marginTop: 3 }}>
                      {m.id === 'ci_permis' ? '2 pași: CI separat, apoi Permis separat' : m.sub}
                    </p>
                  </div>
                  <ChevRightIcon size={18} color={m.recommended ? '#93c5fd' : '#cbd5e1'} />
                </button>
              ))}
            </div>
          )}

          {/* Camera / upload — Step 1: CI (or single CI mode) */}
          {mode && status === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mode.id === 'ci_permis' && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🪪</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>Pasul 1 — Scanează CI-ul</p>
                    <p style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>Permisul de conducere se face în pasul următor, separat.</p>
                  </div>
                </div>
              )}
              <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />
              <input ref={galleryRef} type="file" accept="image/*,application/pdf"        onChange={onFile} style={{ display: 'none' }} />
              <button onClick={() => cameraRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '2px solid #93c5fd', borderRadius: 13, padding: '18px 16px', background: '#eff6ff', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CameraIcon size={24} color="#fff" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1d4ed8' }}>Fă o poză</p>
                  <p style={{ fontSize: 13, color: '#3b82f6', marginTop: 2 }}>Deschide camera telefonului</p>
                </div>
              </button>
              <button onClick={() => galleryRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '2px solid #e2e8f0', borderRadius: 13, padding: '18px 16px', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UploadIcon size={24} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#334155' }}>Încarcă din galerie</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>JPG, PNG, PDF — max. 10 MB</p>
                </div>
              </button>
            </div>
          )}

          {/* CI done — intermediate step for ci_permis mode */}
          {mode && mode.id === 'ci_permis' && status === 'done_ci' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: '1.5px solid #6ee7b7', borderRadius: 14, background: '#f0fdf4', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircleIcon size={16} color="#10b981" />
                  <p style={{ fontWeight: 700, color: '#065f46', fontSize: 13 }}>CI extras cu succes ✓</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {['legal_rep','cnp','ci_serie','ci_nr','ci_valabilitate','data_nastere','adresa'].filter(k => ciValues[k]).map(key => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '2px 0', borderBottom: '1px solid #d1fae5' }}>
                      <span style={{ fontSize: 11, color: '#059669', flexShrink: 0 }}>{FIELD_LABELS[key]}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'right', color: ciConf[key] === 'uncertain' ? '#d97706' : '#064e3b' }}>
                        {ciValues[key]}{ciConf[key] === 'uncertain' ? ' ⚠️' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>🚗</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0c4a6e' }}>Pasul 2 — Permis de conducere</p>
                    <p style={{ fontSize: 12, color: '#0284c7', marginTop: 2 }}>Scanează acum permisul pentru a completa toate datele.</p>
                  </div>
                </div>
                <button onClick={() => { setScanStep('permis'); setStatus('idle_permis'); }} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#0284c7', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CameraIcon size={17} color="#fff" /> Scanează Permisul →
                </button>
              </div>

              <button onClick={() => { setResult({ ...ciValues }); setConf({ ...ciConf }); setStatus('done'); }} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: '4px', textDecoration: 'underline' }}>
                Sari peste permis — salvează doar CI
              </button>
            </div>
          )}

          {/* Camera / upload — Step 2: Permis */}
          {mode && status === 'idle_permis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🚗</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0c4a6e' }}>Pasul 2 — Scanează Permisul</p>
                  <p style={{ fontSize: 12, color: '#0284c7', marginTop: 2 }}>Fotografiază fața permisului de conducere.</p>
                </div>
              </div>
              <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />
              <input ref={galleryRef} type="file" accept="image/*,application/pdf"        onChange={onFile} style={{ display: 'none' }} />
              <button onClick={() => cameraRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '2px solid #7dd3fc', borderRadius: 13, padding: '18px 16px', background: '#f0f9ff', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CameraIcon size={24} color="#fff" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#0c4a6e' }}>Fă o poză Permisului</p>
                  <p style={{ fontSize: 13, color: '#0284c7', marginTop: 2 }}>Deschide camera telefonului</p>
                </div>
              </button>
              <button onClick={() => galleryRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: '2px solid #e2e8f0', borderRadius: 13, padding: '18px 16px', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UploadIcon size={24} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#334155' }}>Încarcă din galerie</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>JPG, PNG, PDF — max. 10 MB</p>
                </div>
              </button>
            </div>
          )}

          {/* Loading */}
          {mode && isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '52px 0' }}>
              <div style={{ position: 'relative', width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: status === 'loading_permis' ? '#0284c7' : '#2563eb', animation: 'spin 0.85s linear infinite' }} />
                <span style={{ fontSize: 34 }}>{status === 'loading_permis' ? '🚗' : mode.icon}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, color: '#334155', fontSize: 16 }}>{status === 'loading_permis' ? 'Se extrag datele permisului...' : 'Se extrag datele...'}</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Analizăm documentul cu AI...</p>
              </div>
              <div style={{ width: 200, height: 5, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${barW}%`, background: status === 'loading_permis' ? 'linear-gradient(90deg,#0284c7,#10b981)' : 'linear-gradient(90deg,#2563eb,#10b981)', borderRadius: 99, transition: 'width 0.38s ease' }} />
              </div>
              <p style={{ fontSize: 12, color: '#cbd5e1' }}>{barW}%</p>
            </div>
          )}

          {/* Done — final results */}
          {mode && status === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: '1.5px solid #6ee7b7', borderRadius: 14, background: '#f0fdf4', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <CheckCircleIcon size={18} color="#10b981" />
                  <p style={{ fontWeight: 700, color: '#065f46', fontSize: 14 }}>Date extrase cu succes!</p>
                </div>

                <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: '#059669', marginBottom: 6 }}>🪪 Act de identitate</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  {['legal_rep','cnp','ci_serie','ci_nr','ci_valabilitate','data_nastere','adresa'].filter(k => resultValues[k]).map(key => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', borderBottom: '1px solid #d1fae5' }}>
                      <span style={{ fontSize: 11, color: '#059669', flexShrink: 0 }}>{FIELD_LABELS[key]}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'right', color: resultConf[key] === 'uncertain' ? '#d97706' : '#064e3b' }}>
                        {resultValues[key]}{resultConf[key] === 'uncertain' ? ' ⚠️' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {mode.id === 'ci_permis' && ['permis_serie','permis_nr','permis_categorii','permis_expirare'].some(k => resultValues[k]) && (
                  <>
                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: '#059669', marginBottom: 6, marginTop: 8 }}>🚗 Permis de conducere</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {['permis_serie','permis_nr','permis_categorii','permis_expirare'].filter(k => resultValues[k]).map(key => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', borderBottom: '1px solid #d1fae5' }}>
                          <span style={{ fontSize: 11, color: '#059669', flexShrink: 0 }}>{FIELD_LABELS[key]}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'right', color: resultConf[key] === 'uncertain' ? '#d97706' : '#064e3b' }}>
                            {resultValues[key]}{resultConf[key] === 'uncertain' ? ' ⚠️' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {Object.keys(resultValues).length === 0 && (
                  <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>Nu s-au putut extrage date. Completează manual.</p>
                )}
              </div>

              {uncertain && (
                <div style={{ display: 'flex', gap: 10, border: '1px solid #fde68a', borderRadius: 10, background: '#fffbeb', padding: '10px 14px' }}>
                  <AlertCircleIcon size={16} color="#d97706" />
                  <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.55 }}>Câmpurile cu <strong>⚠️</strong> au încredere scăzută — verifică-le după salvare.</p>
                </div>
              )}

              <button onClick={() => onDone(resultValues, resultConf)} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <CheckIcon size={18} color="#fff" /> Confirmă și salvează datele
              </button>
              <button onClick={reset} style={{ width: '100%', padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>
                Scanează din nou
              </button>
            </div>
          )}

          {/* Error state */}
          {mode && status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: '1.5px solid #fca5a5', borderRadius: 14, background: '#fef2f2', padding: 16, textAlign: 'center' }}>
                <span style={{ fontSize: 32 }}>😕</span>
                <p style={{ fontWeight: 700, color: '#7f1d1d', marginTop: 8 }}>Scanare eșuată</p>
                <p style={{ fontSize: 13, color: '#ef4444', marginTop: 4, lineHeight: 1.5 }}>{errMsg}</p>
              </div>
              <button onClick={() => setStatus(scanStep === 'permis' ? 'idle_permis' : 'idle')} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Încearcă din nou
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, HistoryScreen, SettingsScreen, DatePersonaleScreen });
