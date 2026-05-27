// proto/pages-assets.jsx — Firm Asset Registry: Cars, Properties, Companies

const {
  AppFrame, BottomNav, SectionLabel, PrimaryBtn, SecondaryBtn,
  PlusIcon, ChevRightIcon, SpinnerIcon, FileTextIcon,
} = window;

// ─── Asset type configuration ─────────────────────────────────────────────────
const ASSET_TYPES = {
  car: {
    label: 'Auto', singular: 'mașină',
    icon: '🚗',
    color: '#2563eb',
    lightBg: '#eff6ff',
    border: '#bfdbfe',
    fields: [
      { key: 'plate',   label: 'Nr. înmatriculare', placeholder: 'ex. B 123 ABC',   required: true,  transform: 'upper'      },
      { key: 'make',    label: 'Marcă',             placeholder: 'ex. Dacia',        required: true,  transform: 'capitalize' },
      { key: 'model',   label: 'Model',             placeholder: 'ex. Logan',        required: true,  transform: 'capitalize' },
      { key: 'year',    label: 'An fabricație',     placeholder: 'ex. 2022',         required: true                           },
      { key: 'color',   label: 'Culoare',           placeholder: 'ex. Alb',          required: false, transform: 'capitalize' },
      { key: 'vin',     label: 'Serie VIN / Șasiu', placeholder: 'ex. VSSZZZ6K...', required: false, transform: 'upper'      },
      { key: 'casco',   label: 'Asigurare CASCO',   type: 'select', options: ['Da', 'Nu'], required: false },
      { key: 'rca_exp', label: 'Expirare RCA',      type: 'slash_date', placeholder: 'ex. 15/06/2030', required: false },
    ],
    primary:   d => d.plate || '—',
    secondary: d => [d.make, d.model, d.year].filter(Boolean).join(' '),
    tertiary:  d => d.color,
    // map to contract fields for auto-fill
    contractMap: {
      masina_marca:     'make',
      masina_model:     'model',
      masina_an:        'year',
      masina_nr_inmatr: 'plate',
      masina_culoare:   'color',
      masina_serie_vin: 'vin',
      casco:            'casco',
    },
  },
  property: {
    label: 'Proprietăți', singular: 'proprietate',
    icon: '🏠',
    color: '#059669',
    lightBg: '#f0fdf4',
    border: '#a7f3d0',
    fields: [
      { key: 'name',      label: 'Denumire',        placeholder: 'ex. Apt. 3 camere',     required: true  },
      { key: 'address',   label: 'Adresă completă', placeholder: 'Str., nr., bl., ap., oraș', required: true },
      { key: 'prop_type', label: 'Tip proprietate', type: 'select',
        options: ['Apartament', 'Casă', 'Vilă', 'Spațiu comercial', 'Teren', 'Garaj', 'Altele'], required: true },
      { key: 'owner',     label: 'Proprietar',      placeholder: 'Nume proprietar',       required: false },
      { key: 'surface',   label: 'Suprafață (mp)',  placeholder: 'ex. 65',               required: false },
      { key: 'rooms',     label: 'Nr. camere',      placeholder: 'ex. 3',                required: false },
      { key: 'cadastral', label: 'Nr. cadastral',   placeholder: 'ex. 12345/A',          required: false },
    ],
    primary:   d => d.name || '—',
    secondary: d => d.address || '',
    tertiary:  d => [d.prop_type, d.surface ? `${d.surface} mp` : ''].filter(Boolean).join(' · '),
    contractMap: {
      imobil_adresa:     'address',
      imobil_tip:        'prop_type',
      imobil_proprietar: 'owner',
      imobil_suprafata:  'surface',
      imobil_cadastral:  'cadastral',
    },
  },
  company: {
    label: 'Companii', singular: 'companie',
    icon: '🏢',
    color: '#7c3aed',
    lightBg: '#faf5ff',
    border: '#ddd6fe',
    fields: [
      { key: 'name',          label: 'Denumire firmă',   placeholder: 'ex. TechCorp SRL',      required: true  },
      { key: 'cui',           label: 'CUI',              placeholder: 'ex. RO12345678',        required: false },
      { key: 'reg_com',       label: 'Nr. Reg. Com.',    placeholder: 'ex. J40/1234/2020',     required: false },
      { key: 'address',       label: 'Adresă sediu',     placeholder: 'Str., nr., oraș',       required: false },
      { key: 'contact_name',  label: 'Persoană contact', placeholder: 'Nume și prenume',       required: false },
      { key: 'contact_phone', label: 'Telefon contact',  placeholder: 'ex. 0721 123 456',      required: false },
      { key: 'contact_email', label: 'Email contact',    placeholder: 'ex. contact@firma.ro',  required: false },
    ],
    primary:   d => d.name || '—',
    secondary: d => d.address || '',
    tertiary:  d => d.contact_name || '',
    contractMap: {
      client_firma:    'name',
      client_cui:      'cui',
      client_adresa:   'address',
      client_contact:  'contact_name',
    },
  },
};

const TYPE_ORDER = ['car', 'property', 'company'];

// ─── Assets Screen ─────────────────────────────────────────────────────────────
function AssetsScreen({ navigate, assets, setAssets, contracts, addAsset, deleteAsset }) {
  const [activeType, setActiveType] = React.useState('car');
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);

  // Calculează nr. contracte per asset din lista reală
  function contractsForAsset(assetId) {
    return (contracts || []).filter(c => c.asset_id === assetId);
  }

  // Assets cu contract_count calculat dinamic
  const filtered = assets
    .filter(a => a.type === activeType)
    .map(a => ({ ...a, contract_count: contractsForAsset(a.id).length }));

  const cfg = ASSET_TYPES[activeType];

  async function handleAddAsset(asset) {
    await addAsset(asset);
    setShowAdd(false);
  }

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 18 }}>Active firmă</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{assets.length} înregistrări</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#2563eb', color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <PlusIcon size={15} /> Adaugă
          </button>
        </div>

        {/* Segmented tabs */}
        <div style={{ display: 'flex', padding: '0 18px 12px', gap: 6 }}>
          {TYPE_ORDER.map(type => {
            const c = ASSET_TYPES[type];
            const count = assets.filter(a => a.type === type).length;
            const active = activeType === type;
            return (
              <button key={type} onClick={() => setActiveType(type)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '7px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? c.color : '#f1f5f9',
                color: active ? '#fff' : '#64748b',
                fontWeight: active ? 700 : 500, fontSize: 12,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                {c.label}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: active ? '#fff' : '#64748b',
                  borderRadius: 20, padding: '0px 6px', fontSize: 11, fontWeight: 700,
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 100px' }}>
        {filtered.length === 0 ? (
          <EmptyAssets type={activeType} cfg={cfg} onAdd={() => setShowAdd(true)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(asset => (
              <AssetCard key={asset.id} asset={asset} cfg={cfg} onClick={() => setSelectedAsset(asset)} />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="assets" navigate={navigate} />

      {/* Detail sheet */}
      {selectedAsset && (
        <AssetDetailSheet
          asset={selectedAsset}
          cfg={ASSET_TYPES[selectedAsset.type]}
          contracts={contractsForAsset(selectedAsset.id)}
          onClose={() => setSelectedAsset(null)}
          onNewContract={() => { setSelectedAsset(null); navigate('contract-new'); }}
          onDelete={() => {
            deleteAsset(selectedAsset.id);
            setSelectedAsset(null);
          }}
        />
      )}

      {/* Add sheet */}
      {showAdd && (
        <AddAssetSheet
          type={activeType}
          onClose={() => setShowAdd(false)}
          onSave={handleAddAsset}
        />
      )}
    </AppFrame>
  );
}

// ─── Asset Card ───────────────────────────────────────────────────────────────
function AssetCard({ asset, cfg, onClick }) {
  const d = asset.details || {};
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      border: '1px solid #e2e8f0', borderRadius: 12, padding: '13px 14px',
      background: '#fff', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.border; e.currentTarget.style.background = cfg.lightBg; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
      {/* Icon */}
      <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.lightBg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {cfg.icon}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0f172a' }}>
          {cfg.primary(d)}
        </p>
        <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
          {cfg.secondary(d)}
        </p>
        {cfg.tertiary(d) && (
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{cfg.tertiary(d)}</p>
        )}
      </div>
      {/* Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        {asset.contract_count > 0 && (
          <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
            {asset.contract_count} contracte
          </span>
        )}
        <ChevRightIcon size={16} color="#cbd5e1" />
      </div>
    </button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyAssets({ type, cfg, onAdd }) {
  const messages = {
    car:      { title: 'Nicio mașină adăugată', sub: 'Adaugă mașinile din flota ta pentru completare rapidă în contracte.' },
    property: { title: 'Nicio proprietate adăugată', sub: 'Adaugă proprietățile tale pentru completare rapidă.' },
    company:  { title: 'Nicio companie adăugată', sub: 'Adaugă companiile cu care lucrezi.' },
  };
  const m = messages[type];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 70, textAlign: 'center' }}>
      <div style={{ width: 68, height: 68, borderRadius: 20, background: cfg.lightBg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>
        {cfg.icon}
      </div>
      <p style={{ fontWeight: 700, fontSize: 16, color: '#334155' }}>{m.title}</p>
      <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, maxWidth: 260, lineHeight: 1.5 }}>{m.sub}</p>
      <button onClick={onAdd} style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, background: cfg.color, color: '#fff', borderRadius: 12, padding: '12px 20px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        <PlusIcon size={16} /> Adaugă {cfg.label.toLowerCase()}
      </button>
    </div>
  );
}

// ─── Asset Detail Sheet ───────────────────────────────────────────────────────
function AssetDetailSheet({ asset, cfg, contracts, onClose, onNewContract, onDelete }) {
  const d = asset.details || {};
  return (
    <Overlay onClose={onClose}>
      {/* Handle */}
      <SheetHandle />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cfg.icon}</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{cfg.primary(d)}</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{cfg.label}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: '55vh', padding: '0 20px 20px' }}>
        {/* Fields */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          {cfg.fields.filter(f => d[f.key]).map((f, i, arr) => {
            let displayVal = d[f.key];
            // Formatează datele ISO → zz/ll/aaaa pentru afișare (date vechi salvate ca ISO)
            if ((f.type === 'date' || f.type === 'slash_date') && /^\d{4}-\d{2}-\d{2}$/.test(displayVal)) {
              const [y, m, z] = displayVal.split('-');
              displayVal = `${z}/${m}/${y}`;
            }
            return (
              <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '11px 14px', borderBottom: i < arr.length-1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>{f.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>{displayVal}</span>
              </div>
            );
          })}
        </div>

        {/* Linked contracts */}
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>Contracte legate ({asset.contract_count})</SectionLabel>
          {contracts.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>Niciun contract legat de acest activ.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {contracts.slice(0, 3).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f1f5f9', borderRadius: 10, padding: '9px 12px', background: '#f8fafc' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.parties?.[0]?.name ?? '—'}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(c.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryBtn onClick={onNewContract} bg={cfg.color}>
          Contract nou cu acest activ →
        </PrimaryBtn>
        <button onClick={onDelete} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer', padding: '6px' }}>
          Șterge activ
        </button>
      </div>
    </Overlay>
  );
}

// ─── Add Asset Sheet ──────────────────────────────────────────────────────────
function AddAssetSheet({ type = 'car', onClose, onSave }) {
  const [values, setValues]       = React.useState({});
  const [saving, setSaving]       = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [cuiLoading, setCuiLoad]  = React.useState(false);
  const [cuiStatus, setCuiStatus] = React.useState(''); // '' | 'ok' | 'err'
  const cfg = ASSET_TYPES[type];

  function setVal(key, val) { setValues(prev => ({ ...prev, [key]: val })); }

  async function lookupCui() {
    const raw = (values.cui || '').replace(/^RO/i, '').replace(/\D/g, '');
    if (!raw || raw.length < 4) return;
    setCuiLoad(true);
    setCuiStatus('');
    try {
      const { data: { session } } = await window.sb.auth.getSession();
      const headers = session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
      const res = await fetch(
        `https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/anaf-lookup?cui=${raw}`,
        { headers }
      );
      const d = await res.json();
      if (!res.ok || d.error) {
        setCuiStatus('err');
      } else {
        // Stochează CUI fără prefixul RO
        const cuiClean = (d.firm_cui || '').replace(/^RO/i, '').trim() || prev.cui || '';
        setValues(prev => ({
          ...prev,
          name:    d.firm_name    || prev.name    || '',
          cui:     cuiClean,
          address: d.firm_address || prev.address || '',
          reg_com: d.firm_reg     || prev.reg_com || '',
        }));
        setCuiStatus('ok');
      }
    } catch (e) {
      console.error('[RapidAct] ANAF error:', e);
      setCuiStatus('err');
    }
    setCuiLoad(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      await onSave({ type, details: values });
    } catch(e) {
      console.error('[RapidAct] handleSave error:', e);
      setSaveError('Eroare la salvare. Încearcă din nou.');
    }
    setSaving(false);
  }

  const canSave = cfg.fields.filter(f => f.required).every(f => values[f.key]);

  return (
    <Overlay onClose={onClose}>
      <SheetHandle />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{cfg.icon}</span>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Adaugă {cfg.singular}</p>
        </div>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      {/* Fields */}
      <div style={{ overflowY: 'auto', maxHeight: '48vh', padding: '4px 20px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cfg.fields.map(f => {
            function applyTransform(v) {
              if (f.transform === 'upper')      return v.toUpperCase();
              if (f.transform === 'capitalize') return v.charAt(0).toUpperCase() + v.slice(1);
              return v;
            }
            const isCui = type === 'company' && f.key === 'cui';
            return (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b', marginBottom: 5 }}>
                  {f.label}{f.required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
                </label>

                {/* CUI field cu buton ANAF */}
                {isCui ? (
                  <div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={values.cui || ''}
                        onChange={e => { setVal('cui', e.target.value); setCuiStatus(''); }}
                        placeholder={f.placeholder}
                        inputMode="numeric"
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button onClick={lookupCui} disabled={cuiLoading || (values.cui || '').replace(/\D/g,'').length < 4}
                        style={{ padding: '0 14px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0, opacity: cuiLoading || (values.cui || '').replace(/\D/g,'').length < 4 ? 0.5 : 1 }}>
                        {cuiLoading ? <SpinnerIcon size={16} color="#fff" /> : '🔍 ANAF'}
                      </button>
                    </div>
                    {cuiStatus === 'ok'  && <p style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>✓ Date completate din ANAF</p>}
                    {cuiStatus === 'err' && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>CUI negăsit sau eroare ANAF</p>}
                  </div>
                ) : f.type === 'select' ? (
                  <select value={values[f.key] || ''} onChange={e => setVal(f.key, e.target.value)} style={inputStyle}>
                    <option value="">— Selectează —</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'slash_date' ? (
                  <SlashDateInput
                    value={values[f.key] || ''}
                    onChange={v => setVal(f.key, v)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <AddInput
                    value={values[f.key] || ''}
                    onChange={v => setVal(f.key, applyTransform(v))}
                    placeholder={f.placeholder}
                    transform={f.transform}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px' }}>
        <PrimaryBtn onClick={handleSave} disabled={!canSave || saving} bg={cfg.color}>
          {saving ? <><SpinnerIcon size={18} /> Se salvează...</> : `Salvează ${cfg.singular}`}
        </PrimaryBtn>
        {saveError && <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 8 }}>{saveError}</p>}
      </div>
    </Overlay>
  );
}

// ─── Asset Picker Sheet (used in contract flow) ───────────────────────────────
function AssetPickerSheet({ type, assets, onSelect, onClose }) {
  const cfg = ASSET_TYPES[type] || ASSET_TYPES.car;
  const filtered = assets.filter(a => a.type === type);
  return (
    <Overlay onClose={onClose}>
      <SheetHandle />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 14px' }}>
        <p style={{ fontWeight: 700, fontSize: 16 }}>Alege {cfg.label.toLowerCase()}</p>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: '50vh', padding: '0 20px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 32 }}>{cfg.icon}</p>
            <p style={{ fontSize: 14, marginTop: 10 }}>Niciun {cfg.label.toLowerCase()} salvat.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Adaugă din tab-ul Active.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(asset => {
              const d = asset.details || {};
              return (
                <button key={asset.id} onClick={() => onSelect(asset)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  border: `1.5px solid ${cfg.border}`, borderRadius: 12, padding: '13px 14px',
                  background: cfg.lightBg, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = cfg.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = cfg.border}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{cfg.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cfg.primary(d)}</p>
                    <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cfg.secondary(d)}</p>
                  </div>
                  <ChevRightIcon size={16} color={cfg.color} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Overlay>
  );
}

// ─── Shared sheet primitives ──────────────────────────────────────────────────
function Overlay({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', paddingTop: 6 }}>
        {children}
      </div>
    </div>
  );
}

function SheetHandle() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12 }}>
      <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
    </div>
  );
}

// Auto-slash date input: tipește cifre, barele se inserează automat → dd/mm/yyyy
function SlashDateInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = React.useState(false);
  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '');
    let out = '';
    for (let i = 0; i < Math.min(digits.length, 8); i++) {
      if (i === 2 || i === 4) out += '/';
      out += digits[i];
    }
    onChange(out);
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder || 'zz/ll/aaaa'}
      maxLength={10}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
        boxShadow: focused ? '0 0 0 3px #dbeafe' : 'none',
      }}
    />
  );
}

function AddInput({ value, onChange, placeholder, transform }) {
  const [focused, setFocused] = React.useState(false);
  const autoCapitalize = transform === 'upper' ? 'characters' : transform === 'capitalize' ? 'words' : 'sentences';
  const textTransform  = transform === 'upper' ? 'uppercase' : 'none';
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      autoCorrect="off"
      spellCheck={false}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
        boxShadow: focused ? '0 0 0 3px #dbeafe' : 'none',
        textTransform,
      }}
    />
  );
}

const inputStyle = {
  width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
  background: '#fff', outline: 'none', fontSize: 14, transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit',
};

Object.assign(window, { AssetsScreen, AssetPickerSheet, ASSET_TYPES });
