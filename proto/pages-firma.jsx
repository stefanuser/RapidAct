// proto/pages-firma.jsx — Date firmă screen with ANAF lookup

const {
  AppFrame, SectionLabel, PrimaryBtn, SecondaryBtn,
  ChevLeftIcon, CheckIcon, CheckCircleIcon, SpinnerIcon, AlertCircleIcon,
  Building2Icon,
} = window;

// ANAF mock data — keyed by CUI for variety
const ANAF_DB = {
  default: {
    firm_name: 'AutoLux SRL',
    firm_address: 'Str. Victoriei nr. 45, București, Sector 1',
    firm_reg: 'J40/1234/2020',
    legal_rep: 'Popescu Ion',
  },
  'RO87654321': {
    firm_name: 'TechCorp SRL',
    firm_address: 'Bd. Unirii nr. 10, București, Sector 3',
    firm_reg: 'J40/5678/2019',
    legal_rep: 'Ionescu Maria',
  },
};

function DateFirmaScreen({ navigate, profile, setProfile }) {
  const init = {
    firm_cui:     profile.firm_cui || '',
    firm_name:    profile.firm_name || '',
    firm_address: profile.firm_address || '',
    firm_reg:     profile.firm_reg || '',
    legal_rep:    profile.legal_rep || '',
  };
  const [data, setData]         = React.useState(init);
  const [anafLoading, setAnaf]  = React.useState(false);
  const [anafFresh, setFresh]   = React.useState(false);
  const [saved, setSaved]       = React.useState(false);
  const [toast, setToast]       = React.useState('');

  function setField(key, val) {
    setData(p => ({ ...p, [key]: val }));
    setSaved(false);
    setFresh(false);
  }

  async function lookupAnaf() {
    if ((data.firm_cui || '').replace(/\D/g, '').length < 5) return;
    setAnaf(true);
    setFresh(false);
    await new Promise(r => setTimeout(r, 1100));
    const result = ANAF_DB[data.firm_cui] || ANAF_DB.default;
    setData(p => ({ ...p, ...result }));
    setAnaf(false);
    setFresh(true);
    setSaved(false);
    setToast('Date preluate de la ANAF');
    setTimeout(() => setToast(''), 2500);
  }

  function handleSave() {
    setProfile(p => ({ ...p, ...data }));
    setSaved(true);
    setToast('Datele au fost salvate');
    setTimeout(() => setToast(''), 2500);
  }

  const cuiValid = (data.firm_cui || '').replace(/\D/g, '').length >= 5;
  const hasData  = data.firm_name && data.firm_cui;

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px' }}>
        <button onClick={() => navigate('settings')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ChevLeftIcon size={16} color="#475569" />
        </button>
        <p style={{ fontWeight: 700, fontSize: 17 }}>Date firmă</p>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ANAF lookup CTA */}
        <div style={{ border: '2px solid #2563eb', borderRadius: 16, background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏢</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>Preluare automată din ANAF</p>
              <p style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>Introdu CUI-ul și completăm restul automat</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={data.firm_cui}
              onChange={e => setField('firm_cui', e.target.value)}
              placeholder="ex. RO12345678"
              style={{
                flex: 1, padding: '11px 13px', border: '1.5px solid #bfdbfe',
                borderRadius: 10, background: '#fff', outline: 'none',
                fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
              }}
            />
            <button onClick={lookupAnaf} disabled={!cuiValid || anafLoading} style={{
              padding: '11px 16px', borderRadius: 10, border: 'none',
              background: !cuiValid || anafLoading ? '#cbd5e1' : '#2563eb',
              color: '#fff', fontWeight: 700, fontSize: 13,
              cursor: !cuiValid || anafLoading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {anafLoading ? <><SpinnerIcon size={14} /> ANAF</> : <>🔍 ANAF</>}
            </button>
          </div>
          {anafFresh && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '6px 10px', background: '#dcfce7', borderRadius: 8 }}>
              <CheckCircleIcon size={14} color="#10b981" />
              <p style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>Date sincronizate cu ANAF</p>
            </div>
          )}
        </div>

        {/* Status chip */}
        {hasData && !anafFresh && (
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#166534', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>✓ Firmă înregistrată</span>
          </div>
        )}

        {/* Form fields */}
        <div>
          <SectionLabel>🏢 Date juridice</SectionLabel>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
            <FirmaFieldRow label="Denumire firmă"      value={data.firm_name}    onChange={v => setField('firm_name', v)}    placeholder="ex. AutoLux SRL" />
            <FirmaFieldRow label="CUI"                 value={data.firm_cui}     onChange={v => setField('firm_cui', v)}     placeholder="ex. RO12345678" />
            <FirmaFieldRow label="Nr. Reg. Comerțului" value={data.firm_reg}     onChange={v => setField('firm_reg', v)}     placeholder="ex. J40/1234/2020" />
            <FirmaFieldRow label="Adresă sediu"        value={data.firm_address} onChange={v => setField('firm_address', v)} placeholder="Stradă, număr, localitate" />
            <FirmaFieldRow label="Reprezentant legal"  value={data.legal_rep}    onChange={v => setField('legal_rep', v)}    placeholder="Nume și prenume" last />
          </div>
        </div>

        {/* Info hint */}
        <div style={{ display: 'flex', gap: 10, border: '1px solid #bfdbfe', borderRadius: 10, background: '#eff6ff', padding: '10px 14px' }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.55 }}>Aceste date apar pe fiecare contract generat ca <strong>LOCATOR / Firma</strong>.</p>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={!data.firm_name || !data.firm_cui} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: !data.firm_name || !data.firm_cui ? '#cbd5e1' : saved ? '#10b981' : '#2563eb',
          color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
          cursor: !data.firm_name || !data.firm_cui ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.2s',
        }}>
          {saved ? <><CheckIcon size={18} color="#fff" /> Date salvate</> : 'Salvează datele firmei'}
        </button>
      </div>

      {toast && (
        <div className="slide-up" style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: 12, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, maxWidth: 380 }}>
          <CheckCircleIcon size={18} color="#34d399" /> {toast}
        </div>
      )}
    </AppFrame>
  );
}

function FirmaFieldRow({ label, value, onChange, placeholder, last }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ padding: '10px 16px', borderBottom: last ? 'none' : '1px solid #f1f5f9', background: '#fff' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', marginBottom: 5 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 11px',
          border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
          borderRadius: 9, outline: 'none', fontSize: 14, fontFamily: 'inherit',
          background: '#fff', color: '#0f172a',
          boxShadow: focused ? '0 0 0 3px #dbeafe' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  );
}

Object.assign(window, { DateFirmaScreen });
