// proto/pages-contract.jsx — 4-step contract creation flow

const {
  AppFrame, StepBar, FieldInput, PrimaryBtn, SecondaryBtn, SectionLabel,
  ChevLeftIcon, ChevRightIcon, CameraIcon, UploadIcon, CheckCircleIcon,
  AlertCircleIcon, FileTextIcon, SpinnerIcon, CheckIcon, DownloadIcon,
  BottomNav,
} = window;

// AssetPickerSheet + ASSET_TYPES loaded from pages-assets.jsx (via window)

// ─── Template data ────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'rentacar-standard',
    name: 'Închiriere Auto',
    icon: '🚗',
    description: 'Contract standard de închiriere autovehicul cu predare-primire',
    fields: [
      { key: 'firma_nume',          label: 'Denumire firmă',           source: 'profile',  type: 'text',     required: true },
      { key: 'firma_cui',           label: 'CUI',                      source: 'profile',  type: 'text',     required: true },
      { key: 'firma_adresa',        label: 'Adresă sediu',             source: 'profile',  type: 'text',     required: true },
      { key: 'firma_reg',           label: 'Nr. Reg. Comerțului',      source: 'profile',  type: 'text',     required: true },
      { key: 'firma_reprezentant',  label: 'Reprezentant legal',       source: 'profile',  type: 'text',     required: true },
      { key: 'sofer_nume',          label: 'Nume și prenume șofer',    source: 'ocr',      type: 'text',     required: true },
      { key: 'sofer_cnp',           label: 'CNP',                      source: 'ocr',      type: 'text',     required: true },
      { key: 'sofer_ci_serie',         label: 'Serie CI',                  source: 'ocr',    type: 'text',  required: true,  placeholder: 'ex. RX' },
      { key: 'sofer_ci_nr',           label: 'Număr CI',                  source: 'ocr',    type: 'text',  required: true,  placeholder: 'ex. 123456' },
      { key: 'sofer_ci_valabilitate', label: 'CI valabilă până',          source: 'ocr',    type: 'text',  required: false, placeholder: 'ex. 15/06/2035' },
      { key: 'sofer_adresa',          label: 'Adresă domiciliu',          source: 'manual', type: 'text',  required: false, placeholder: 'Stradă, număr, localitate (completare manuală)' },
      { key: 'sofer_data_nastere',    label: 'Data nașterii',             source: 'ocr',    type: 'text',  required: true,  placeholder: 'ex. 26/02/1984' },
      { key: 'permis_nr',             label: 'Nr. permis conducere',      source: 'ocr',    type: 'text',  required: false, placeholder: 'ex. IO0299449F' }, // permisul RO nu are serie — M fix
      { key: 'permis_categorii',      label: 'Categorii permis',          source: 'ocr',    type: 'text',  required: false, placeholder: 'ex. B, BE' },
      { key: 'permis_expirare',       label: 'Permis valabil până',       source: 'ocr',    type: 'text',  required: false, placeholder: 'ex. 15/03/2030' },
      { key: 'masina_marca',        label: 'Marcă',                    source: 'manual',   type: 'text',     required: true, placeholder: 'ex. Dacia' },
      { key: 'masina_model',        label: 'Model',                    source: 'manual',   type: 'text',     required: true, placeholder: 'ex. Logan' },
      { key: 'masina_an',           label: 'An fabricație',            source: 'manual',   type: 'text',     required: true, placeholder: 'ex. 2022' },
      { key: 'masina_nr_inmatr',    label: 'Nr. înmatriculare',        source: 'manual',   type: 'text',     required: true, placeholder: 'ex. B 123 ABC' },
      { key: 'masina_culoare',      label: 'Culoare',                  source: 'manual',   type: 'text',     required: false, placeholder: 'ex. Alb' },
      { key: 'masina_serie_vin',    label: 'Serie VIN / Șasiu',        source: 'manual',   type: 'text',     required: false, placeholder: 'ex. VSSZZZ6K...' },
      { key: 'predare_data_ora',    label: 'Data și ora predării',     source: 'manual',   type: 'datetime', required: true },
      { key: 'restituire_data_ora', label: 'Data și ora restituirii',  source: 'manual',   type: 'datetime', required: true },
      { key: 'nr_zile',             label: 'Număr zile închiriate',    source: 'manual',   type: 'number',   required: true, hint: 'Calculat automat din date' },
      { key: 'km_predare',          label: 'Km la predare',            source: 'manual',   type: 'number',   required: true, placeholder: 'ex. 45230' },
      { key: 'combustibil_predare', label: 'Combustibil la predare',   source: 'manual',   type: 'select',   required: true, options: ['1/4', '1/2', '3/4', 'Plin'] },
      { key: 'tarif_zi',            label: 'Tarif / zi (RON)',         source: 'manual',   type: 'number',   required: true, placeholder: 'ex. 150' },
      { key: 'valoare_totala',      label: 'Valoare totală (RON)',     source: 'manual',   type: 'number',   required: true, hint: 'Calculat automat: zile × tarif' },
      { key: 'garantie',            label: 'Garanție (RON)',           source: 'manual',   type: 'number',   required: true, placeholder: 'ex. 500' },
      { key: 'mod_plata',           label: 'Mod de plată',             source: 'manual',   type: 'select',   required: true, options: ['Numerar', 'Card bancar', 'Transfer bancar', 'Online'] },
      { key: 'km_inclusi',          label: 'Km incluși / zi',          source: 'manual',   type: 'select',   required: true, options: ['Nelimitați', '100 km/zi', '150 km/zi', '200 km/zi', '300 km/zi'] },
      { key: 'fransiza',            label: 'Franșiză daune (RON)',     source: 'manual',   type: 'number',   required: false, placeholder: 'ex. 1000' },
      { key: 'casco',               label: 'Asigurare CASCO',          source: 'manual',   type: 'select',   required: true, options: ['Inclusă', 'Nu este inclusă'] },
      { key: 'loc_predare',         label: 'Locul predării',           source: 'manual',   type: 'text',     required: false, placeholder: 'ex. Aeroportul Otopeni' },
      { key: 'observatii',          label: 'Observații / daune',       source: 'manual',   type: 'textarea', required: false, placeholder: 'ex. Zgârietură pe aripa...' },
      { key: 'data_contract',       label: 'Data contractului',        source: 'manual',   type: 'date',     required: true },
      { key: 'loc_incheiere',       label: 'Locul încheierii',         source: 'manual',   type: 'text',     required: true, placeholder: 'ex. București' },
    ],
  },
];

// All templates defined in ALL_TEMPLATE_LIST below

// ─── Utilities ────────────────────────────────────────────────────────────────
// M10 — toRoDate mutat în shared.jsx; referință la global
const toRoDate = window.toRoDate;

// H3 — Validare CNP românesc (13 cifre + cifră de control)
function validateCnp(cnp) {
  if (!cnp || !/^\d{13}$/.test(cnp)) return false;
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(cnp[i]) * weights[i];
  const ctrl = sum % 11;
  const check = ctrl < 10 ? ctrl : 1;
  return check === parseInt(cnp[12]);
}

async function compressImage(file) {
  return new Promise((resolve, reject) => {
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
      resolve(canvas.toDataURL('image/jpeg', 0.82).split(',')[1]);
    };
    img.onerror = reject;
    img.src = objUrl;
  });
}

function parseDocOcr(docId, json) {
  const values = {}, confidence = {};
  if (docId === 'ci') {
    const fn = json.first_name || '', ln = json.last_name || '';
    if (fn || ln) { values.sofer_nume = [fn, ln].filter(Boolean).join(' '); confidence.sofer_nume = 'confident'; }
    if (json.cnp)       { values.sofer_cnp        = json.cnp;       confidence.sofer_cnp        = 'confident'; }
    if (json.ci_series) { values.sofer_ci_serie    = json.ci_series; confidence.sofer_ci_serie   = 'confident'; }
    if (json.ci_number) { values.sofer_ci_nr       = json.ci_number; confidence.sofer_ci_nr      = 'confident'; }
    const bd = toRoDate(json.birthdate);
    if (bd) { values.sofer_data_nastere = bd; confidence.sofer_data_nastere = 'confident'; }
    const exp = toRoDate(json.valid_until);
    if (exp) { values.sofer_ci_valabilitate = exp; confidence.sofer_ci_valabilitate = 'uncertain'; }
    // Noul CI românesc nu are adresă pe el
  }
  if (docId === 'permis') {
    // Afișat în card pentru verificare — permisul poate aparține altei persoane decât CI-ul
    // Fallback pentru diferite formate de răspuns OCR (first_name/last_name sau name complet)
    const fn = json.first_name || '', ln = json.last_name || '';
    const fullName = [fn, ln].filter(Boolean).join(' ') || json.name || json.full_name || json.holder || '';
    if (fullName) { values.permis_titular = fullName; confidence.permis_titular = 'confident'; }
    const bd = toRoDate(json.birthdate);
    if (bd) { values.permis_data_nastere = bd; confidence.permis_data_nastere = 'confident'; }
    // Câmpuri pentru formular și contract
    // Permisul RO are DOAR număr (fără serie) — json.permis_number sau json.license_number
    const permisNr = json.permis_number || json.license_number || json.document_number || '';
    if (permisNr) { values.permis_nr = permisNr; confidence.permis_nr = 'confident'; }
    if (json.permis_categories || json.categories) {
      values.permis_categorii = json.permis_categories || json.categories;
      confidence.permis_categorii = 'confident';
    }
    const exp = toRoDate(json.permis_expiry || json.expiry_date || json.valid_until);
    if (exp) { values.permis_expirare = exp; confidence.permis_expirare = 'uncertain'; }
  }
  return { values, confidence };
}

// ─── Scan documents config ────────────────────────────────────────────────────
const SCAN_DOCS = [
  { id: 'ci',     icon: '🪪', label: 'Carte de identitate', sub: 'CI / Buletin',           type: 'scan', ocrMode: 'ro_ci',     required: true  },
  { id: 'permis', icon: '🚗', label: 'Permis de conducere', sub: 'Recomandat rent-a-car',   type: 'scan', ocrMode: 'ro_permis', required: false },
  { id: 'firma',  icon: '🏢', label: 'Date firmă (CUI)',    sub: 'Lookup automat via ANAF', type: 'anaf', ocrMode: null,        required: false },
];

// ─── DocCard ──────────────────────────────────────────────────────────────────
const DOC_FIELD_LABELS = {
  // CI
  sofer_nume: 'Nume', sofer_cnp: 'CNP',
  sofer_ci_serie: 'Serie CI', sofer_ci_nr: 'Nr. CI',
  sofer_data_nastere: 'Data nașterii', sofer_ci_valabilitate: 'CI valabilă până',
  // Permis (permisul RO nu are serie — doar nr.)
  permis_titular: 'Titular permis', permis_data_nastere: 'Dată naștere (permis)',
  permis_nr: 'Nr. permis', permis_categorii: 'Categorii', permis_expirare: 'Permis valabil până',
  // Firmă
  client_firma: 'Firmă', client_cui: 'CUI',
  client_adresa: 'Adresă', client_reg: 'Reg. Com.',
};

function DocCard({ doc, data, scanning, cuiVal, onCuiChange, onScanFile, onLookupAnaf, onRescan }) {
  const cameraRef  = React.useRef(null);
  const galleryRef = React.useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) onScanFile(file);
    e.target.value = '';
  }

  const isScanning = scanning === doc.id;
  const isSuccess  = data && !data.error && Object.keys(data.values || {}).length > 0;
  const isError    = data && !!data.error;

  // ── Success ────────────────────────────────────────────────────────────────
  if (isSuccess) {
    const isFirma    = doc.id === 'firma';
    const border     = isFirma ? '#bfdbfe' : '#6ee7b7';
    const bg         = isFirma ? '#eff6ff' : '#f0fdf4';
    const titleColor = isFirma ? '#1e40af' : '#065f46';
    const labelColor = isFirma ? '#3b82f6' : '#059669';
    const valColor   = isFirma ? '#1e3a8a' : '#064e3b';
    const checkColor = isFirma ? '#2563eb' : '#10b981';
    return (
      <div style={{ border: `1.5px solid ${border}`, borderRadius: 14, background: bg, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{doc.icon}</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <CheckCircleIcon size={15} color={checkColor} />
            <p style={{ fontWeight: 700, fontSize: 13, color: titleColor }}>{doc.label}</p>
            {isFirma && <span style={{ fontSize: 10, fontWeight: 700, background: '#dbeafe', color: '#1e40af', borderRadius: 5, padding: '1px 7px', flexShrink: 0 }}>ANAF</span>}
          </div>
          <button onClick={onRescan} style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${border}`, borderRadius: 8, padding: '4px 10px', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: labelColor, flexShrink: 0 }}>
            ↻ Rescanează
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(data.values).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 11, color: labelColor, flexShrink: 0 }}>{DOC_FIELD_LABELS[key] || key.replace(/_/g, ' ')}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'right', color: data.confidence?.[key] === 'uncertain' ? '#d97706' : valColor }}>
                {val}{data.confidence?.[key] === 'uncertain' ? ' ⚠️' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div style={{ border: '1.5px solid #fca5a5', borderRadius: 14, background: '#fff5f5', padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{doc.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#dc2626' }}>Eroare — {doc.label}</p>
            <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2, wordBreak: 'break-word' }}>{data.error}</p>
          </div>
          <button onClick={onRescan} style={{ border: 'none', background: '#fee2e2', borderRadius: 8, padding: '6px 12px', color: '#dc2626', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  // ── Scanning ───────────────────────────────────────────────────────────────
  if (isScanning) {
    return (
      <div style={{ border: '1.5px solid #bfdbfe', borderRadius: 14, background: '#eff6ff', padding: '28px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #dbeafe', borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 28 }}>{doc.icon}</span>
        </div>
        <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 13, textAlign: 'center' }}>Se analizează {doc.label.toLowerCase()}...</p>
        <div style={{ width: '100%', maxWidth: 200 }}><LoadingBar /></div>
      </div>
    );
  }

  // ── Default ────────────────────────────────────────────────────────────────
  return (
    <div style={{ border: `1.5px solid ${doc.required ? '#e2e8f0' : '#f1f5f9'}`, borderRadius: 14, background: '#fff', padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: doc.required ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{doc.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>{doc.label}</p>
            {doc.required && <span style={{ fontSize: 9, fontWeight: 800, background: '#eff6ff', color: '#2563eb', borderRadius: 4, padding: '1px 6px', textTransform: 'uppercase', letterSpacing: 0.4, flexShrink: 0 }}>Obligatoriu</span>}
          </div>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{doc.sub}</p>
        </div>
      </div>

      {doc.type === 'scan' ? (
        <>
          <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
          <input ref={galleryRef} type="file" accept="image/*"                       onChange={handleFile} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => cameraRef.current?.click()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px solid #2563eb', borderRadius: 10, padding: '11px 0', background: '#eff6ff', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
              onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}>
              <CameraIcon size={18} color="#2563eb" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>📷 Fotografiază</span>
            </button>
            <button onClick={() => galleryRef.current?.click()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 0', background: '#f8fafc', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
              <UploadIcon size={18} color="#64748b" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>🖼️ Galerie</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={cuiVal}
            onChange={e => onCuiChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onLookupAnaf()}
            placeholder="ex. RO12345678"
            style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', outline: 'none', fontSize: 14, fontFamily: 'inherit' }}
          />
          {/* M24 — dezactivat și în timp ce o scanare e în curs */}
          {(() => {
            const anafDisabled = cuiVal.replace(/\D/g, '').length < 6 || !!scanning;
            return (
              <button onClick={onLookupAnaf} disabled={anafDisabled} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: anafDisabled ? '#cbd5e1' : '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: anafDisabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                🔍 ANAF
              </button>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Scan — un singur ecran, toate documentele odată ──────────────────
function StepScan({ onDone, initialScanned, initialCui }) {
  const [scanned, setScanned]       = React.useState(initialScanned || {});   // { docId: { values, confidence } | { error } }
  const [scanning, setScanning]     = React.useState(null); // docId scanat curent
  const [cui, setCui]               = React.useState(initialCui || '');
  const [cuiLoading, setCuiLoading] = React.useState(false);

  const hasAny = Object.values(scanned).some(s => Object.keys(s.values || {}).length > 0);

  async function scanDoc(doc, file) {
    if (scanning) return; // M21 — guard împotriva double-click / race condition
    setScanning(doc.id);
    try {
      const base64 = await compressImage(file);
      const { data: { session } } = await window.sb.auth.getSession();
      const res = await fetch('https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/ocr-ci', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ imageBase64: base64, mode: doc.ocrMode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Eroare OCR');
      const { values, confidence } = parseDocOcr(doc.id, json);
      setScanned(prev => ({ ...prev, [doc.id]: { values, confidence } }));
    } catch (err) {
      setScanned(prev => ({ ...prev, [doc.id]: { values: {}, confidence: {}, error: err.message } }));
    } finally {
      setScanning(null);
    }
  }

  async function lookupAnaf(doc) {
    const rawCui = cui.replace(/^RO/i, '').replace(/\s/g, '').replace(/\D/g, '');
    if (rawCui.length < 6) return;
    setScanning(doc.id);
    setCuiLoading(true);
    try {
      const { data: { session } } = await window.sb.auth.getSession();
      const headers = session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
      const res  = await fetch(`https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/anaf-lookup?cui=${rawCui}`, { headers });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      const cuiClean = (json.firm_cui || rawCui).replace(/^RO/i, '').trim();
      const values = {
        client_firma:  json.firm_name    || '',
        client_cui:    cuiClean,
        client_adresa: json.firm_address || '',
        client_reg:    json.firm_reg     || '',
      };
      const confidence = Object.fromEntries(Object.keys(values).map(k => [k, 'confident']));
      setScanned(prev => ({ ...prev, [doc.id]: { values, confidence } }));
    } catch (err) {
      setScanned(prev => ({ ...prev, [doc.id]: { values: {}, confidence: {}, error: err.message } }));
    } finally {
      setScanning(null);
      setCuiLoading(false);
    }
  }

  function rescan(docId) {
    setScanned(prev => { const n = { ...prev }; delete n[docId]; return n; });
    if (docId === 'firma') setCui('');
  }

  function finish() {
    const allValues = {}, allConf = {};
    Object.values(scanned).forEach(s => {
      Object.assign(allValues, s.values    || {});
      Object.assign(allConf,  s.confidence || {});
    });
    // Returnăm și starea per-doc + cui pentru a putea reface UI-ul când userul navighează înapoi
    onDone({ values: allValues, confidence: allConf, scanned, cui });
  }

  const scannedCount = Object.keys(scanned).filter(id => Object.keys(scanned[id].values || {}).length > 0).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Scanează acte</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Fotografiază sau încarcă documentele. Datele se extrag automat cu AI.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SCAN_DOCS.map(doc => (
          <DocCard
            key={doc.id}
            doc={doc}
            data={scanned[doc.id] || null}
            scanning={scanning}
            cuiVal={doc.id === 'firma' ? cui : ''}
            onCuiChange={val => setCui(val)}
            onScanFile={file => scanDoc(doc, file)}
            onLookupAnaf={() => lookupAnaf(doc)}
            onRescan={() => rescan(doc.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryBtn onClick={finish}>
          {hasAny ? 'Continuă → Completează datele' : 'Sari peste — completez manual'}
        </PrimaryBtn>
        {scannedCount > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
            ✓ {scannedCount} document{scannedCount > 1 ? 'e' : ''} scanat{scannedCount > 1 ? 'e' : ''} — verifică datele la pasul următor
          </p>
        )}
      </div>
    </div>
  );
}

function buildContractBody(template, values) {
  const fill = (k) => values[k] || '___________';
  return `CONTRACT DE ÎNCHIRIERE AUTOVEHICUL
Nr. _____ / ${fill('data_contract')}

Încheiat la ${fill('loc_incheiere')}, astăzi ${fill('data_contract')},

I. PĂRȚILE CONTRACTANTE

LOCATOR (Firma):
${fill('firma_nume')}, sediu în ${fill('firma_adresa')},
Reg. Com. ${fill('firma_reg')}, CUI ${fill('firma_cui')},
reprezentată prin ${fill('firma_reprezentant')},

LOCATAR (Șoferul):
${fill('sofer_nume')}, CNP ${fill('sofer_cnp')},
CI seria ${fill('sofer_ci_serie')} nr. ${fill('sofer_ci_nr')}, valabilă: ${fill('sofer_ci_valabilitate')},
domiciliu: ${fill('sofer_adresa')},
data nașterii: ${fill('sofer_data_nastere')},
permis conducere seria ${fill('permis_serie')} nr. ${fill('permis_nr')}, categorii: ${fill('permis_categorii')}, valabil: ${fill('permis_expirare')},

II. OBIECTUL CONTRACTULUI

Autovehicul: ${fill('masina_marca')} ${fill('masina_model')} ${fill('masina_an')}
Nr. înmatriculare: ${fill('masina_nr_inmatr')}
Culoare: ${fill('masina_culoare')} · VIN: ${fill('masina_serie_vin')}
CASCO: ${fill('casco')}

III. DURATA ÎNCHIRIERII

Predare: ${fill('predare_data_ora')}
Restituire: ${fill('restituire_data_ora')}
Perioadă: ${fill('nr_zile')} zile
Loc predare: ${fill('loc_predare')}

IV. PREȚUL ȘI PLATA

Tarif: ${fill('tarif_zi')} RON/zi
Valoare totală: ${fill('valoare_totala')} RON
Garanție: ${fill('garantie')} RON
Mod plată: ${fill('mod_plata')}

V. CONDIȚII

Km incluși: ${fill('km_inclusi')}
Franșiză daune: ${fill('fransiza')} RON
Km la predare: ${fill('km_predare')} km
Combustibil: ${fill('combustibil_predare')}
Observații: ${fill('observatii') || '—'}

VI. SEMNĂTURI

LOCATOR: ${fill('firma_reprezentant')}
LOCATAR: ${fill('sofer_nume')}

________________________    ________________________
  (semnătură + ștampilă)          (semnătură)`;
}

// ─── All available templates (active + coming soon) ──────────────────────────
const ALL_TEMPLATE_LIST = [
  { id: 'rentacar-standard',   name: 'Închiriere Auto',            icon: '🚗', desc: 'Contract predare-primire autovehicul',    category: 'Mobilitate',    active: true  },
  { id: 'inchiriere-apt',      name: 'Închiriere Apartament',      icon: '🏠', desc: 'Contract de locațiune rezidențial',       category: 'Imobiliare',    active: false },
  { id: 'vanzare-proprietate', name: 'Vânzare Proprietate',        icon: '🏘️', desc: 'Antecontract / promisiune de vânzare',    category: 'Imobiliare',    active: false },
  { id: 'cim',                 name: 'Contract Individual Muncă',  icon: '👥', desc: 'CIM conform Codul Muncii',                category: 'Resurse Umane', active: false },
  { id: 'prestari-servicii',   name: 'Prestări Servicii',          icon: '📋', desc: 'Contract de servicii B2B',               category: 'Servicii',      active: false },
  { id: 'colaborare-pfa',      name: 'Colaborare PFA',             icon: '🤝', desc: 'Contract colaborare cu persoană fizică',  category: 'Resurse Umane', active: false },
  { id: 'inchiriere-spatiu',   name: 'Închiriere Spațiu Comercial',icon: '🏪', desc: 'Birou, depozit sau spațiu comercial',     category: 'Comercial',     active: false },
];

const CATEGORIES = [
  { id: 'Mobilitate',    icon: '🚗' },
  { id: 'Imobiliare',    icon: '🏠' },
  { id: 'Resurse Umane', icon: '👥' },
  { id: 'Servicii',      icon: '📋' },
  { id: 'Comercial',     icon: '🏪' },
];

// ─── Step 1: Template ─────────────────────────────────────────────────────────
function StepTemplate({ onSelect }) {
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ra_fav_tpl') || '[]'); } catch { return []; }
  });
  const [showAll, setShowAll]       = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);

  function toggleFav(id) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('ra_fav_tpl', JSON.stringify(next));
      return next;
    });
  }

  function handleSelect(t) {
    if (!t.active) return;
    const template = TEMPLATES.find(tp => tp.id === t.id);
    if (template) onSelect(template);
  }

  const favList    = ALL_TEMPLATE_LIST.filter(t => favorites.includes(t.id));
  const activeList = ALL_TEMPLATE_LIST.filter(t => t.active);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Alege contractul</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Apasă pe un contract pentru a-l citi înainte de a-l alege.</p>

      {/* Favorites */}
      {favList.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>⭐ Favorite</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {favList.map(t => <TemplateCard key={t.id} t={t} isFav onToggleFav={toggleFav} onSelect={handleSelect} />)}
          </div>
        </div>
      )}

      {/* Active contracts + browse all button */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <SectionLabel>Toate contractele</SectionLabel>
          <button onClick={() => setShowAll(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer', marginBottom: 8 }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
            🗂️ Browse ({ALL_TEMPLATE_LIST.length})
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeList.map(t => <TemplateCard key={t.id} t={t} isFav={favorites.includes(t.id)} onToggleFav={toggleFav} onSelect={handleSelect} />)}
        </div>
        <button onClick={() => setShowAll(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: '1px dashed #e2e8f0', borderRadius: 10, padding: '11px 14px', background: 'none', cursor: 'pointer', marginTop: 8, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 13, color: '#94a3b8', flex: 1, textAlign: 'left' }}>+{ALL_TEMPLATE_LIST.filter(t => !t.active).length} template-uri în curând — Explorează toate categoriile</span>
          <ChevRightIcon size={15} color="#94a3b8" />
        </button>
      </div>

      {/* Upload own */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
        <SectionLabel>Contract propriu</SectionLabel>
        <button onClick={() => setShowUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '14px 16px', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: '#334155' }}>Încarcă contractul tău</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Îl vom adăuga în profilul tău în 24-48h</p>
          </div>
          <ChevRightIcon size={16} color="#94a3b8" />
        </button>
      </div>

      {showAll    && <AllContractsSheet favorites={favorites} onToggleFav={toggleFav} onSelect={handleSelect} onClose={() => setShowAll(false)} />}
      {showUpload && <UploadContractSheet onClose={() => setShowUpload(false)} />}
    </div>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────
function TemplateCard({ t, isFav, onToggleFav, onSelect }) {
  const [showPreview, setShowPreview] = React.useState(false);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1.5px solid ${t.active ? '#e2e8f0' : '#f1f5f9'}`, borderRadius: 12, padding: '11px 12px', background: t.active ? '#fff' : '#fafafa', transition: 'all 0.15s', cursor: 'pointer' }}
        onClick={() => setShowPreview(true)}
        onMouseEnter={e => { if (t.active) e.currentTarget.style.borderColor = '#bfdbfe'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.active ? '#e2e8f0' : '#f1f5f9'; }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: t.active ? '#eff6ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, flexShrink: 0 }}>{t.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: t.active ? '#0f172a' : '#94a3b8' }}>{t.name}</p>
            {!t.active && <span style={{ background: '#f1f5f9', color: '#94a3b8', borderRadius: 5, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>CURÂND</span>}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onToggleFav(t.id); }} title={isFav ? 'Elimină' : 'Favorit'} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: isFav ? '#fef3c7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>
            {isFav ? '⭐' : '☆'}
          </button>
          {t.active ? (
            <button onClick={e => { e.stopPropagation(); onSelect(t); }} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 13px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Alege</button>
          ) : (
            <span style={{ background: '#f1f5f9', color: '#94a3b8', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>Curând</span>
          )}
        </div>
      </div>
      {showPreview && <ContractPreviewSheet t={t} onSelect={onSelect} onClose={() => setShowPreview(false)} />}
    </>
  );
}

// ─── Contract preview sheet ───────────────────────────────────────────────────
function ContractPreviewSheet({ t, onSelect, onClose }) {
  const template = TEMPLATES.find(tp => tp.id === t.id);
  const previewText = template ? buildContractBody(template, {}) : null;
  const [downloading, setDownloading] = React.useState(false);

  async function generateBlankPDF() {
    const { PDFDocument, rgb } = window.PDFLib;
    const fontBytes = await fetch('./assets/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(window.fontkit);
    const font = await pdfDoc.embedFont(fontBytes);
    const PW = 595.28, PH = 841.89, MX = 51, MY = 45;
    const TW = PW - MX * 2;
    const FS = 9.5, LH = FS * 1.55;
    function wrapText(text, maxW) {
      if (!text.trim()) return [''];
      const words = text.split(' '); const lines = []; let cur = '';
      for (const w of words) {
        const candidate = cur ? cur + ' ' + w : w;
        if (font.widthOfTextAtSize(candidate, FS) <= maxW) { cur = candidate; }
        else { if (cur) lines.push(cur); cur = w; }
      }
      if (cur) lines.push(cur);
      return lines.length ? lines : [''];
    }
    let page = pdfDoc.addPage([PW, PH]);
    let y = PH - MY;
    page.drawText('RapidAct.ro', { x: MX, y, font, size: 14, color: rgb(0.145, 0.388, 0.922) });
    const hdr = 'Template necompletat · ' + t.name;
    const hdrW = font.widthOfTextAtSize(hdr, 8);
    page.drawText(hdr, { x: PW - MX - hdrW, y, font, size: 8, color: rgb(0.39, 0.455, 0.545) });
    y -= 8;
    page.drawLine({ start: { x: MX, y }, end: { x: PW - MX, y }, thickness: 0.4, color: rgb(0.145, 0.388, 0.922) });
    y -= 20;
    for (const rawLine of previewText.split('\n')) {
      for (const wl of wrapText(rawLine, TW)) {
        if (y < MY) { page = pdfDoc.addPage([PW, PH]); y = PH - MY; }
        if (wl) page.drawText(wl, { x: MX, y, font, size: FS, color: rgb(0, 0, 0) });
        y -= LH;
      }
    }
    return await pdfDoc.save();
  }

  async function handleDownloadBlank() {
    if (!template || downloading) return;
    setDownloading(true);
    try {
      const pdfBytes = await generateBlankPDF();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${t.name.replace(/\s+/g, '_')}_Template.pdf`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch(err) { console.error('PDF blank error:', err); }
    finally { setDownloading(false); }
  }

  async function handleShare() {
    if (!template || downloading) return;
    setDownloading(true);
    try {
      const pdfBytes = await generateBlankPDF();
      const fname = `${t.name.replace(/\s+/g, '_')}_Template.pdf`;
      const file = new File([pdfBytes], fname, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: t.name, text: `Template contract: ${t.name}` });
      } else {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fname;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch(err) { if (err.name !== 'AbortError') console.error('Share error:', err); }
    finally { setDownloading(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 14px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{t.desc}</p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {template && (
              <button onClick={handleShare} title="Distribuie template" disabled={downloading} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: downloading ? 'wait' : 'pointer', fontSize: 14, opacity: downloading ? 0.6 : 1 }}>📤</button>
            )}
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {previewText ? (
            <pre style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, lineHeight: 1.75, color: '#334155', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
              {previewText}
            </pre>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</p>
              <p style={{ fontWeight: 600, color: '#334155', marginBottom: 6 }}>Template în pregătire</p>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>Acest template va fi disponibil în curând. Poți adăuga contractul tău propriu dacă îl ai deja.</p>
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{ padding: '12px 20px 28px', borderTop: '1px solid #f1f5f9', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {t.active ? (
            <>
              <PrimaryBtn onClick={() => { onSelect(t); onClose(); }} bg="#2563eb">
                Folosește acest template →
              </PrimaryBtn>
              <SecondaryBtn onClick={handleDownloadBlank} disabled={downloading}>
                {downloading ? '⏳ Se generează...' : '⬇️  Descarcă template gol'}
              </SecondaryBtn>
            </>
          ) : (
            <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#64748b' }}>Disponibil în curând · <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>Notifică-mă</span></p>
            </div>
          )}
          <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: '4px' }}>Închide</button>
        </div>
      </div>
    </div>
  );
}

// ─── All contracts sheet (categorized + search) ───────────────────────────────
function AllContractsSheet({ favorites, onToggleFav, onSelect, onClose }) {
  const [search, setSearch]     = React.useState('');
  const [expanded, setExpanded] = React.useState({});

  function toggleCat(cat) { setExpanded(prev => ({ ...prev, [cat]: !prev[cat] })); }

  const filtered = search
    ? ALL_TEMPLATE_LIST.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 12px', flexShrink: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Toate contractele</p>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
        <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Caută după nume sau categorie..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 28px' }}>
          {search ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.length === 0
                ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0', fontSize: 14 }}>Niciun contract găsit.</p>
                : filtered.map(t => <TemplateCard key={t.id} t={t} isFav={favorites.includes(t.id)} onToggleFav={onToggleFav} onSelect={v => { onSelect(v); onClose(); }} />)
              }
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const items = ALL_TEMPLATE_LIST.filter(t => t.category === cat.id);
                if (!items.length) return null;
                const isOpen = expanded[cat.id] !== false;
                return (
                  <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                    <button onClick={() => toggleCat(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 14px', border: 'none', background: isOpen ? '#f8fafc' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: 20 }}>{cat.icon}</span>
                      <span style={{ fontWeight: 700, flex: 1 }}>{cat.id}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{items.length}</span>
                      <span style={{ color: '#94a3b8', fontSize: 16, display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                    </button>
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #f1f5f9', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {items.map(t => <TemplateCard key={t.id} t={t} isFav={favorites.includes(t.id)} onToggleFav={onToggleFav} onSelect={v => { onSelect(v); onClose(); }} />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Upload contract sheet ────────────────────────────────────────────────────
function UploadContractSheet({ onClose }) {
  const [step, setStep]             = React.useState('form'); // form | success
  const [fileName, setFileName]     = React.useState('');
  const [description, setDesc]      = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setStep('success');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={step === 'success' ? onClose : undefined} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }} />
      <div className="slide-up" style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', paddingTop: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>

        {step === 'form' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px' }}>
              <p style={{ fontWeight: 700, fontSize: 16 }}>Încarcă contractul tău</p>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <div style={{ padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b', marginBottom: 6 }}>Fișier contract *</label>
                <button onClick={() => setFileName('Contract_Servicii.docx')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: `1.5px dashed ${fileName ? '#6ee7b7' : '#e2e8f0'}`, borderRadius: 10, padding: 14, background: fileName ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 22 }}>{fileName ? '📄' : '📤'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: fileName ? '#065f46' : '#334155' }}>{fileName || 'Selectează fișierul'}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>DOC, DOCX, PDF — max. 10 MB</p>
                  </div>
                  {fileName && <span style={{ color: '#10b981' }}>✓</span>}
                </button>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b', marginBottom: 8 }}>Ce se va scana pentru autocompletare *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { id: 'ci',       icon: '🪪', label: 'Buletin / Carte de identitate' },
                    { id: 'permis',   icon: '🚗', label: 'Permis de conducere' },
                    { id: 'cui',      icon: '🏢', label: 'CUI / Date firmă (ANAF)' },
                    { id: 'pasaport', icon: '📄', label: 'Pașaport' },
                    { id: 'prop',     icon: '🏘️', label: 'Act de proprietate' },
                    { id: 'alt',      icon: '📋', label: 'Alt document' },
                  ].map(opt => {
                    const checked = (description || '').includes(opt.id);
                    return (
                      <button key={opt.id} onClick={() => {
                        const cur = description ? description.split(',').filter(Boolean) : [];
                        const next = checked ? cur.filter(x => x !== opt.id) : [...cur, opt.id];
                        setDesc(next.join(','));
                      }} style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        border: `1.5px solid ${checked ? '#2563eb' : '#e2e8f0'}`,
                        borderRadius: 10, padding: '9px 12px',
                        background: checked ? '#eff6ff' : '#fff',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? '#2563eb' : '#cbd5e1'}`, background: checked ? '#2563eb' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                          {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 16 }}>{opt.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: checked ? 600 : 400, color: checked ? '#1e40af' : '#374151' }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                <p style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>Echipa RapidAct va analiza contractul și îl va digitiza cu câmpuri inteligente în 24-48h. Vei fi notificat pe email.</p>
              </div>
              <PrimaryBtn onClick={handleSubmit} disabled={!fileName || !description || submitting}>
                {submitting ? <><SpinnerIcon size={18} /> Se trimite...</> : 'Trimite contractul →'}
              </PrimaryBtn>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 40px', textAlign: 'center', gap: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Contract primit!</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
              Îl vom analiza și adăuga în profilul tău în <strong>24-48 ore</strong>.<br />
              Vei fi notificat pe email.
            </p>
            <PrimaryBtn onClick={onClose} bg="#0f172a">Înțeles, mulțumesc!</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingBar() {
  const [width, setWidth] = React.useState(10);
  React.useEffect(() => {
    const frames = [30, 55, 72, 88, 94];
    let i = 0;
    const id = setInterval(() => {
      if (i < frames.length) { setWidth(frames[i]); i++; }
      else clearInterval(id);
    }, 450);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99 }}>
      <div style={{ height: '100%', width: `${width}%`, background: '#2563eb', borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  );
}

// ─── Step 3: Form ─────────────────────────────────────────────────────────────
function StepForm({ template, ocrValues, ocrConfidence, profileValues, savedValues, onDone, assets }) {
  // Dacă userul a navigat înapoi de la preview, restaurăm valorile editate anterior
  const [values, setValues] = React.useState(() =>
    (savedValues && Object.keys(savedValues).length > 0)
      ? { ...savedValues }
      : { ...profileValues, ...ocrValues }
  );
  const [showAssetPicker, setShowAssetPicker] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const AssetPickerSheet = window.AssetPickerSheet;

  function setField(key, val) {
    setValues(prev => {
      const next = { ...prev, [key]: val };

      // Auto-calc nr_zile din datetime-uri
      if ((key === 'predare_data_ora' || key === 'restituire_data_ora') && next.predare_data_ora && next.restituire_data_ora) {
        const diff = new Date(next.restituire_data_ora) - new Date(next.predare_data_ora);
        if (diff > 0) next.nr_zile = Math.ceil(diff / 86400000).toString();
        else next.nr_zile = ''; // M4 — reset când restituire e înainte de predare
      }

      // M2 — parseFloat acceptă și virgulă (format RO: 150,5 → 150.5)
      const toNum = s => parseFloat(String(s || '').replace(',', '.')) || 0;

      if ((key === 'nr_zile' || key === 'tarif_zi') && next.nr_zile && next.tarif_zi) {
        const auto = (toNum(next.nr_zile) * toNum(next.tarif_zi)).toFixed(0);
        // M3 — nu suprascrie dacă totalul a fost editat manual
        // (totalul e "auto" dacă era egal cu produsul valorilor ANTERIOARE)
        const prevAuto = prev.nr_zile && prev.tarif_zi
          ? (toNum(prev.nr_zile) * toNum(prev.tarif_zi)).toFixed(0)
          : null;
        if (!prev.valoare_totala || prev.valoare_totala === prevAuto) {
          next.valoare_totala = auto;
        }
      }

      return next;
    });
  }

  function handleAssetSelect(asset) {
    const cfg = window.ASSET_TYPES?.[asset.type];
    if (cfg?.contractMap) {
      const patch = {};
      Object.entries(cfg.contractMap).forEach(([contractKey, assetKey]) => {
        if (asset.details?.[assetKey]) patch[contractKey] = asset.details[assetKey];
      });
      setValues(prev => ({ ...prev, ...patch }));
    }
    setSelectedAsset(asset);
    setShowAssetPicker(false);
  }

  const ocrFieldsCI     = template.fields.filter(f => f.source === 'ocr' && !f.key.startsWith('permis_'));
  const ocrFieldsPermis = template.fields.filter(f => f.source === 'ocr' &&  f.key.startsWith('permis_'));
  const manualFields    = template.fields.filter(f => f.source === 'manual');

  // H1 — cross-check titular permis vs CI (date afișate pentru verificare umană, NU în contract)
  const permisVerifItems = [
    ocrValues?.permis_titular     && { label: 'Titular permis',   value: ocrValues.permis_titular },
    ocrValues?.permis_data_nastere && { label: 'Data nașterii (permis)', value: ocrValues.permis_data_nastere },
  ].filter(Boolean);

  // H3 — warning CNP invalid (non-blocking)
  const cnpVal = values.sofer_cnp || '';
  const cnpInvalid = cnpVal.length > 0 && !validateCnp(cnpVal);
  const carAssets       = (assets || []).filter(a => a.type === 'car');

  const groups = [
    { title: 'Vehicul',         keys: ['masina_marca','masina_model','masina_an','masina_nr_inmatr','masina_culoare','masina_serie_vin'] },
    { title: 'Perioadă',        keys: ['predare_data_ora','restituire_data_ora','nr_zile','loc_predare'] },
    { title: 'Tarife și plată', keys: ['tarif_zi','valoare_totala','garantie','mod_plata'] },
    { title: 'Condiții',        keys: ['km_inclusi','fransiza','casco','km_predare','combustibil_predare'] },
    { title: 'Contract',        keys: ['observatii','data_contract','loc_incheiere'] },
  ];

  const missingRequired = template.fields
    .filter(f => f.required && !values[f.key])
    .map(f => f.label);

  // Auto-scroll la câmpul obligatoriu următor (ciclează prin toate)
  const focusIdxRef = React.useRef(0);
  function scrollToNextMissing() {
    const missingKeys = template.fields
      .filter(f => f.required && !values[f.key])
      .map(f => f.key);
    if (!missingKeys.length) return;
    if (focusIdxRef.current >= missingKeys.length) focusIdxRef.current = 0;
    const key = missingKeys[focusIdxRef.current];
    focusIdxRef.current = (focusIdxRef.current + 1) % missingKeys.length;
    const el = document.getElementById(`field-${key}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const input = el.querySelector('input:not([type="hidden"]), select, textarea');
      if (input) { input.focus(); try { input.select(); } catch (_) {} }
    }, 320);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
        {/* OCR sections — CI și Permis separat */}
        {ocrFieldsCI.length > 0 && (
          <>
            <FieldSection title="Date din CI — verifică" fields={ocrFieldsCI} values={values} onChange={setField} confidence={ocrConfidence} />
            {/* H3 — warning CNP invalid */}
            {cnpInvalid && (
              <div style={{ marginTop: -16, marginBottom: 16, background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>CNP-ul pare invalid (cifră de control greșită). Verifică manual înainte de a genera contractul.</p>
              </div>
            )}
          </>
        )}
        {ocrFieldsPermis.length > 0 && (
          <>
            <FieldSection title="Date din Permis — verifică" fields={ocrFieldsPermis} values={values} onChange={setField} confidence={ocrConfidence} />
            {/* H1 — cross-check titular permis vs CI */}
            {permisVerifItems.length > 0 && (
              <div style={{ marginTop: -16, marginBottom: 16, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>🔍 Verificare cruce — titularul permisului</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {permisVerifItems.map(item => (
                    <span key={item.label} style={{ fontSize: 12, color: '#1e3a8a', background: '#dbeafe', borderRadius: 6, padding: '3px 8px', fontWeight: 500 }}>
                      {item.label}: <strong>{item.value}</strong>
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#3b82f6', marginTop: 5 }}>Confirmă că permisul aparține persoanei din CI.</p>
              </div>
            )}
          </>
        )}

        {/* Asset quick-select for rentacar template */}
        {template.id === 'rentacar-standard' && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Vehicul</SectionLabel>
            {selectedAsset ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '11px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>🚗</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>{selectedAsset.details?.plate}</p>
                  <p style={{ fontSize: 12, color: '#3b82f6' }}>{[selectedAsset.details?.make, selectedAsset.details?.model, selectedAsset.details?.year].filter(Boolean).join(' ')}</p>
                </div>
                <button onClick={() => { setSelectedAsset(null); setShowAssetPicker(true); }} style={{ fontSize: 12, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
                  Schimbă
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAssetPicker(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: '1.5px dashed #bfdbfe', borderRadius: 12, padding: '12px 14px', background: '#f0f9ff', cursor: 'pointer', marginBottom: 12, textAlign: 'left', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#bfdbfe'}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🚗</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1e40af' }}>
                    {carAssets.length > 0 ? 'Alege mașina din registru' : 'Adaugă mașini în registru'}
                  </p>
                  <p style={{ fontSize: 12, color: '#3b82f6' }}>
                    {carAssets.length > 0
                      ? `${carAssets.length} mașin${carAssets.length === 1 ? 'ă' : 'i'} salvat${carAssets.length === 1 ? 'ă' : 'e'} · completare automată`
                      : 'Economisești timp la contracte repetitive'}
                  </p>
                </div>
                <ChevRightIcon size={16} color="#3b82f6" />
              </button>
            )}
            {/* Vehicle fields inline (always editable) */}
            <FieldSection title="" fields={manualFields.filter(f => groups[0].keys.includes(f.key))} values={values} onChange={setField} compact />
          </div>
        )}

        {/* Remaining manual sections */}
        {groups.slice(template.id === 'rentacar-standard' ? 1 : 0).map(g => {
          const fields = manualFields.filter(f => g.keys.includes(f.key));
          if (!fields.length) return null;
          return <FieldSection key={g.title} title={g.title} fields={fields} values={values} onChange={setField} />;
        })}
      </div>
      <div style={{ borderTop: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        {/* M1 — card eroare câmpuri lipsă; clickabil pentru auto-scroll */}
        {missingRequired.length > 0 && (
          <div
            onClick={scrollToNextMissing}
            style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 8, cursor: 'pointer', transition: 'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
            onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>
              Câmpuri obligatorii necompletate ({missingRequired.length}):
            </p>
            <p style={{ fontSize: 11, color: '#ef4444', lineHeight: 1.5 }}>
              {missingRequired.join(' · ')}
            </p>
            <p style={{ fontSize: 11, color: '#b91c1c', marginTop: 5, fontWeight: 600 }}>
              ↓ Apasă pentru a merge la câmpul următor
            </p>
          </div>
        )}
        <PrimaryBtn onClick={() => onDone(values)} disabled={missingRequired.length > 0}>
          Preview contract →
        </PrimaryBtn>
        {/* Continuă fără câmpuri obligatorii — buton de bypass */}
        {missingRequired.length > 0 && (
          <button
            onClick={() => onDone(values)}
            style={{ display: 'block', width: '100%', marginTop: 8, padding: '8px', border: 'none', background: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Continuă fără câmpuri obligatorii
          </button>
        )}
      </div>

      {showAssetPicker && AssetPickerSheet && (
        <AssetPickerSheet
          type="car"
          assets={assets || []}
          onSelect={handleAssetSelect}
          onClose={() => setShowAssetPicker(false)}
        />
      )}
    </div>
  );
}

function FieldSection({ title, fields, values, onChange, confidence, compact }) {
  return (
    <div style={{ marginBottom: compact ? 0 : 24 }}>
      {title ? <SectionLabel>{title}</SectionLabel> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map(f => (
          <div key={f.key} id={`field-${f.key}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' }}>{f.label}</label>
              {f.required && <span style={{ color: '#f87171', fontSize: 12 }}>*</span>}
              {confidence?.[f.key] === 'uncertain' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fef3c7', color: '#d97706', borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                  <AlertCircleIcon size={10} /> Verifică
                </span>
              )}
              {confidence?.[f.key] === 'missing' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fee2e2', color: '#dc2626', borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                  <AlertCircleIcon size={10} /> Lipsă
                </span>
              )}
            </div>
            <FieldInput field={f} value={values[f.key] ?? ''} onChange={v => onChange(f.key, v)} confidence={confidence?.[f.key]} />
            {f.hint && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{f.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Client Signature Pad (inline canvas, no modal) ──────────────────────────
function ClientSignaturePad({ onSig }) {
  const canvasRef = React.useRef(null);
  const [drawing, setDrawing]  = React.useState(false);
  const [hasStrokes, setStrokes] = React.useState(false);

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / r.width;
    const scaleY = canvasRef.current.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * scaleX, y: (src.clientY - r.top) * scaleY };
  }

  function startDraw(e) {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0f172a';
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.stroke();
    setStrokes(true);
    onSig(canvasRef.current.toDataURL('image/png'));
  }

  function endDraw(e) { e.preventDefault(); setDrawing(false); }

  function clear() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes(false);
    onSig(null);
  }

  return (
    <div>
      <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#fff', overflow: 'hidden', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={360} height={100}
          style={{ display: 'block', width: '100%', touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!hasStrokes && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <p style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>Clientul semnează aici...</p>
          </div>
        )}
      </div>
      {hasStrokes && (
        <button onClick={clear} style={{ marginTop: 6, width: '100%', padding: '5px', border: 'none', background: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>
          Șterge semnătura clientului
        </button>
      )}
    </div>
  );
}

// ─── Step 4: Preview ──────────────────────────────────────────────────────────
function StepPreview({ template, values, onGenerate, generating, pdfError, profile, navigate, skipSig, onSkipSig }) {
  const body = buildContractBody(template, values);
  const sig = profile?.signature;
  const [clientSig, setClientSig] = React.useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid #f1f5f9', padding: '12px 18px' }}>
        <SectionLabel>Preview contract</SectionLabel>
        <p style={{ fontSize: 13, color: '#64748b' }}>Verifică textul înainte de generare.</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
        <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: '16px', fontFamily: 'ui-monospace, monospace', fontSize: 11, lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {body}
        </div>

        {/* ── LOCATOR (user) signature card ── */}
        <div style={{ marginTop: 14, border: `1.5px solid ${sig && !skipSig ? '#6ee7b7' : sig && skipSig ? '#e2e8f0' : '#fde68a'}`, borderRadius: 12, background: sig && !skipSig ? '#f0fdf4' : sig && skipSig ? '#f8fafc' : '#fffbeb', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>✍️</span>
            <p style={{ fontWeight: 700, fontSize: 13, color: sig && !skipSig ? '#065f46' : sig && skipSig ? '#64748b' : '#92400e' }}>
              {sig && !skipSig ? 'Semnătura ta (LOCATOR) — va apărea pe contract' : sig && skipSig ? 'Semnătura ta nu va fi adăugată' : 'Semnătura ta lipsește'}
            </p>
          </div>
          {sig && !skipSig ? (
            <>
              <div style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <img src={sig} alt="Semnătură" style={{ height: 48, maxWidth: 200, objectFit: 'contain' }} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#065f46' }}>LOCATOR</p>
                  <p style={{ fontSize: 11, color: '#059669' }}>{values.firma_reprezentant || profile?.legal_rep || '—'}</p>
                </div>
              </div>
              <button onClick={() => onSkipSig(true)} style={{ marginTop: 8, width: '100%', border: 'none', background: 'none', fontSize: 12, color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0', textAlign: 'center' }}>
                Nu adaugă semnătura pe acest contract
              </button>
            </>
          ) : sig && skipSig ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <p style={{ fontSize: 12, color: '#64748b' }}>Va apărea o linie goală în locul semnăturii.</p>
              <button onClick={() => onSkipSig(false)} style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Adaugă totuși →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                Pe contract va apărea o linie goală. Adaugă semnătura din Profil → Semnătura mea.
              </p>
              {navigate && (
                <button onClick={() => {
                  if (window.confirm('Navigând la Setări vei pierde progresul contractului curent.\nContinui?')) navigate('settings');
                }} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Adaugă →
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── LOCATAR (client) signature card ── */}
        <div style={{ marginTop: 10, border: `1.5px solid ${clientSig ? '#6ee7b7' : '#e2e8f0'}`, borderRadius: 12, background: clientSig ? '#f0fdf4' : '#f8fafc', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🖊️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: clientSig ? '#065f46' : '#0f172a' }}>
                {clientSig ? 'Semnătura clientului (LOCATAR) ✓' : 'Semnătură client — opțional'}
              </p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                {clientSig ? `${values.sofer_nume || 'Client'} a semnat` : 'Clientul poate semna acum pe ecran'}
              </p>
            </div>
          </div>
          <ClientSignaturePad onSig={setClientSig} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* H5 — eroare generare PDF */}
        {pdfError && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>A apărut o eroare</p>
              <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{pdfError}</p>
            </div>
          </div>
        )}
        <PrimaryBtn onClick={() => onGenerate(clientSig)} disabled={generating} bg="#10b981">
          {generating
            ? <><SpinnerIcon size={18} /> Se generează PDF...</>
            : pdfError
              ? <><FileTextIcon size={18} /> Reîncearcă generarea</>
              : <><FileTextIcon size={18} /> Generează PDF</>}
        </PrimaryBtn>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>PDF-ul va fi salvat în istoricul contractelor</p>
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function StepSuccess({ driverName, pdfBlob, filename, onNew, onHistory }) {
  const [downloaded, setDownloaded] = React.useState(false);

  function handleDownload() {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = filename || 'contract.pdf';
    a.target  = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    setDownloaded(true);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', gap: 16, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircleIcon size={40} color="#10b981" />
      </div>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Contract generat!</h2>
        <p style={{ marginTop: 6, fontSize: 14, color: '#64748b' }}>
          {driverName ? `Contractul pentru ${driverName} a fost salvat.` : 'PDF-ul a fost salvat în arhivă.'}
        </p>
      </div>

      {/* Buton download manual — funcționează pe iOS și Android */}
      {pdfBlob && (
        <button onClick={handleDownload} style={{
          width: '100%', padding: '14px 16px', borderRadius: 12,
          border: `1.5px solid ${downloaded ? '#dcfce7' : '#2563eb'}`,
          background: downloaded ? '#f0fdf4' : '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <DownloadIcon size={20} color={downloaded ? '#10b981' : '#2563eb'} />
          <span style={{ fontSize: 14, fontWeight: 600, color: downloaded ? '#065f46' : '#1e40af' }}>
            {downloaded ? '✓ PDF descărcat' : '📄 Descarcă PDF'}
          </span>
        </button>
      )}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryBtn onClick={onNew}>
          <span>+</span> Contract nou
        </PrimaryBtn>
        <button onClick={onHistory} style={{ border: 'none', background: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
          Vezi arhiva
        </button>
      </div>
    </div>
  );
}

// ─── ContractNew root ─────────────────────────────────────────────────────────
// M35 — dacă există un singur template activ, sări pasul de selecție
const ACTIVE_TEMPLATES = TEMPLATES.filter(t => t.active);

function ContractNewScreen({ navigate, profile, onContractCreated, assets }) {
  const props = { assets };  // passed down to StepForm
  const STEPS = ['template', 'scan', 'form', 'preview'];
  // M35 — auto-selectăm singurul template activ și pornim direct de la step 1 (scan)
  const autoTemplate = ACTIVE_TEMPLATES.length === 1 ? ACTIVE_TEMPLATES[0] : null;
  const fullAutoTpl  = autoTemplate ? TEMPLATES.find(t => t.id === autoTemplate.id) : null;
  const [stepIdx, setStepIdx]     = React.useState(fullAutoTpl ? 1 : 0);
  const [template, setTemplate]   = React.useState(fullAutoTpl || null);
  const [ocr, setOcr]             = React.useState({ values: {}, confidence: {} });
  // B6 — Stare OCR per-doc (ID → { values, confidence, error }) și CUI, ridicate din StepScan
  const [scanDocs, setScanDocs]   = React.useState({});
  const [scanCui, setScanCui]     = React.useState('');
  const [formValues, setFormValues] = React.useState({});
  const [generating, setGenerating] = React.useState(false);
  const [pdfError, setPdfError]   = React.useState('');
  const [done, setDone]           = React.useState(false);
  const [skipSig, setSkipSig]     = React.useState(false);
  const [pdfBlob, setPdfBlob]     = React.useState(null);
  const [pdfFilename, setPdfFilename] = React.useState('');

  const step = STEPS[stepIdx];

  const profileValues = {
    firma_nume:         profile.firm_name,
    firma_cui:          profile.firm_cui,
    firma_adresa:       profile.firm_address,
    firma_reg:          profile.firm_reg,
    firma_reprezentant: profile.legal_rep,
    data_contract: (() => { const n = new Date(); return `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`; })(),
  };

  function goBack() {
    // M35 — dacă template a fost auto-selectat, "înapoi" de la scan merge direct la dashboard
    const firstStep = fullAutoTpl ? 1 : 0;
    if (stepIdx <= firstStep) {
      navigate('dashboard');
    } else {
      // B6 — Dacă userul se întoarce de la formular la scan, resetăm valorile formularului
      // astfel la re-scanare câmpurile se pre-completează din nou din OCR + profil.
      // Dacă se întoarce de la preview la formular, formValues se PĂSTREAZĂ (init via savedValues).
      if (stepIdx === 2) setFormValues({});
      setStepIdx(i => i - 1);
    }
  }

  async function handleGenerate(clientSig = null) {
    setGenerating(true);
    try {
      const contractBody = buildContractBody(template, formValues);
      const driverName = formValues.sofer_nume || 'client';
      const lastName   = driverName.split(' ').slice(-1)[0];
      const now        = new Date();
      const timeStr    = String(now.getHours()).padStart(2,'0') + '-' + String(now.getMinutes()).padStart(2,'0');
      const dateStr    = now.toISOString().split('T')[0];
      const tipClean   = template.name.replace(/\s+/g,'').replace(/[ăâ]/gi,'a').replace(/[îÎ]/g,'i').replace(/[șşȘ]/g,'s').replace(/[țţȚ]/g,'t');
      // M7 — sanitizare diacritice + caractere invalide în filename (Windows-safe)
      const lastClean  = lastName.replace(/[ăâÂ]/gi,'a').replace(/[îÎ]/g,'i').replace(/[șşȘŞ]/g,'s').replace(/[țţȚŢ]/g,'t').replace(/[^a-zA-Z0-9_-]/g,'');
      const filename   = `${tipClean}_${lastClean || 'client'}_${timeStr}_${dateStr}.pdf`;

      const { PDFDocument, rgb } = window.PDFLib;

      // NotoSans embeds full Unicode so Romanian diacritics (ă â î ș ț) render correctly
      const fontBytes = await fetch('./assets/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(window.fontkit);
      const font = await pdfDoc.embedFont(fontBytes);

      const PW = 595.28, PH = 841.89, MX = 51, MY = 45;
      const TW = PW - MX * 2;
      const FS = 9.5, LH = FS * 1.55;

      function wrapText(text, maxW) {
        if (!text.trim()) return [''];
        const words = text.split(' ');
        const lines = [];
        let cur = '';
        for (const w of words) {
          // M8 — cuvânt mai lat decât linia (email/URL/IBAN) → rupt caracter cu caracter
          if (font.widthOfTextAtSize(w, FS) > maxW) {
            if (cur) { lines.push(cur); cur = ''; }
            let chunk = '';
            for (const ch of w) {
              if (font.widthOfTextAtSize(chunk + ch, FS) <= maxW) {
                chunk += ch;
              } else {
                if (chunk) lines.push(chunk);
                chunk = ch;
              }
            }
            cur = chunk;
            continue;
          }
          const candidate = cur ? cur + ' ' + w : w;
          if (font.widthOfTextAtSize(candidate, FS) <= maxW) {
            cur = candidate;
          } else {
            if (cur) lines.push(cur);
            cur = w;
          }
        }
        if (cur) lines.push(cur);
        return lines.length ? lines : [''];
      }

      let page = pdfDoc.addPage([PW, PH]);
      let y = PH - MY;

      // Header
      page.drawText('RapidAct.ro', { x: MX, y, font, size: 14, color: rgb(0.145, 0.388, 0.922) });
      const headerDate = 'Generat: ' + new Date().toLocaleDateString('ro-RO');
      const dateW = font.widthOfTextAtSize(headerDate, 8);
      page.drawText(headerDate, { x: PW - MX - dateW, y, font, size: 8, color: rgb(0.39, 0.455, 0.545) });
      y -= 8;
      page.drawLine({ start: { x: MX, y }, end: { x: PW - MX, y }, thickness: 0.4, color: rgb(0.145, 0.388, 0.922) });
      y -= 20;

      // Contract body
      for (const rawLine of contractBody.split('\n')) {
        for (const wl of wrapText(rawLine, TW)) {
          if (y < MY) { page = pdfDoc.addPage([PW, PH]); y = PH - MY; }
          if (wl) page.drawText(wl, { x: MX, y, font, size: FS, color: rgb(0, 0, 0) });
          y -= LH;
        }
      }

      // Signature block — LOCATOR (stânga) + LOCATAR (dreapta)
      const hasLocatorSig = !!(profile?.signature && !skipSig);
      if (hasLocatorSig || clientSig) {
        if (y < MY + 80) { page = pdfDoc.addPage([PW, PH]); y = PH - MY; }
        y -= 14;
        page.drawLine({ start: { x: MX, y }, end: { x: PW - MX, y }, thickness: 0.3, color: rgb(0.86, 0.86, 0.86) });
        y -= 18;
        page.drawText('LOCATOR', { x: MX + 51, y, font, size: 7, color: rgb(0.39, 0.455, 0.545) });
        page.drawText('LOCATAR', { x: PW - MX - 113, y, font, size: 7, color: rgb(0.39, 0.455, 0.545) });
        y -= 40;
        // LOCATOR sig sau linie goală (stânga)
        // M23 — guard: split(',')[1] poate fi undefined dacă sig nu e data URL
        const extractB64 = s => (s && s.includes(',')) ? s.split(',')[1] : s;
        if (hasLocatorSig) {
          try {
            const sigBase64 = extractB64(profile.signature);
            const sigBytes  = Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0));
            const sigImg    = await pdfDoc.embedPng(sigBytes);
            page.drawImage(sigImg, { x: MX, y, width: 102, height: 40 });
          } catch { page.drawLine({ start: { x: MX, y: y + 40 }, end: { x: MX + 142, y: y + 40 }, thickness: 0.3, color: rgb(0,0,0) }); }
        } else {
          page.drawLine({ start: { x: MX, y: y + 40 }, end: { x: MX + 142, y: y + 40 }, thickness: 0.3, color: rgb(0, 0, 0) });
        }
        // LOCATAR sig sau linie goală (dreapta)
        if (clientSig) {
          try {
            const cSigBase64 = extractB64(clientSig);
            const cSigBytes  = Uint8Array.from(atob(cSigBase64), c => c.charCodeAt(0));
            const cSigImg    = await pdfDoc.embedPng(cSigBytes);
            page.drawImage(cSigImg, { x: PW - MX - 142, y, width: 102, height: 40 });
          } catch { page.drawLine({ start: { x: PW - MX - 142, y: y + 40 }, end: { x: PW - MX, y: y + 40 }, thickness: 0.3, color: rgb(0,0,0) }); }
        } else {
          page.drawLine({ start: { x: PW - MX - 142, y: y + 40 }, end: { x: PW - MX, y: y + 40 }, thickness: 0.3, color: rgb(0, 0, 0) });
        }
      }

      const pdfBytes = await pdfDoc.save();

      // 1. Salvează blob în state pentru butonul de download din ecranul de succes
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      setPdfFilename(filename);

      // 2. Salvează în DB — întotdeauna primul, fără niciun download automat
      await onContractCreated({
        template_name: template.name,
        status:        'generated',
        parties:       [{ name: formValues.sofer_nume || 'Necunoscut' }],
        fields:        formValues,
        created_at:    new Date().toISOString(),
        pdf_url:       null,
      });

      // 3. Arată ecranul de succes — userul descarcă manual prin buton
      setDone(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      setPdfError(err.message || 'Eroare la generarea PDF. Încearcă din nou.');
    } finally {
      setGenerating(false);
    }
  }

  function reset() {
    // M35 — la reset, pornim din nou de la pasul corect (1 dacă template auto-selectat)
    setStepIdx(fullAutoTpl ? 1 : 0); setTemplate(fullAutoTpl || null);
    setOcr({ values: {}, confidence: {} });
    setScanDocs({}); setScanCui('');
    setFormValues({}); setDone(false); setSkipSig(false);
    setPdfBlob(null); setPdfFilename('');
  }

  const stepTitle = done ? 'Gata!' : template ? template.name : 'Contract nou';

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <button onClick={goBack} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ChevLeftIcon size={18} color="#475569" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stepTitle}</p>
          {!done && <p style={{ fontSize: 11, color: '#94a3b8' }}>Pasul {stepIdx + 1} din 4</p>}
        </div>
      </header>

      {!done && <StepBar current={stepIdx} />}

      {done ? (
        <StepSuccess
          driverName={formValues.sofer_nume}
          pdfBlob={pdfBlob}
          filename={pdfFilename}
          onNew={reset}
          onHistory={() => navigate('history')}
        />
      ) : step === 'template' ? (
        <StepTemplate onSelect={t => { setTemplate(t); setStepIdx(1); }} />
      ) : step === 'scan' ? (
        <StepScan
          onDone={o => { setOcr({ values: o.values, confidence: o.confidence }); setScanDocs(o.scanned); setScanCui(o.cui); setStepIdx(2); }}
          initialScanned={scanDocs}
          initialCui={scanCui}
        />
      ) : step === 'form' && template ? (
        <StepForm
          template={template}
          ocrValues={ocr.values}
          ocrConfidence={ocr.confidence}
          profileValues={profileValues}
          savedValues={formValues}
          assets={assets}
          onDone={v => { setFormValues(v); setStepIdx(3); }}
        />
      ) : step === 'preview' && template ? (
        <StepPreview template={template} values={formValues} onGenerate={handleGenerate} generating={generating} pdfError={pdfError} profile={profile} navigate={navigate} skipSig={skipSig} onSkipSig={setSkipSig} />
      ) : null}
    </AppFrame>
  );
}

// ─── ContractTemplates Screen ─────────────────────────────────────────────────
function ContractTemplatesScreen({ navigate }) {
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ra_fav_tpl') || '[]'); } catch { return []; }
  });
  const [showAll, setShowAll]       = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);

  function toggleFav(id) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('ra_fav_tpl', JSON.stringify(next));
      return next;
    });
  }

  function handleSelect(t) {
    if (!t.active) return;
    navigate('contract-new');
  }

  const favList    = ALL_TEMPLATE_LIST.filter(t => favorites.includes(t.id));
  const activeList = ALL_TEMPLATE_LIST.filter(t => t.active);

  return (
    <AppFrame>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px' }}>
        <button onClick={() => navigate('settings')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ChevLeftIcon size={16} color="#475569" />
        </button>
        <p style={{ fontWeight: 700, fontSize: 17 }}>Contractele mele</p>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 100px' }}>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Gestionează template-urile favorite și alege contractul potrivit.</p>

        {/* Favorites */}
        {favList.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>⭐ Favorite</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {favList.map(t => <TemplateCard key={t.id} t={t} isFav onToggleFav={toggleFav} onSelect={handleSelect} />)}
            </div>
          </div>
        )}

        {/* All active + browse all */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionLabel>Toate contractele</SectionLabel>
            <button onClick={() => setShowAll(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer', marginBottom: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
              🗂️ Browse ({ALL_TEMPLATE_LIST.length})
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeList.map(t => <TemplateCard key={t.id} t={t} isFav={favorites.includes(t.id)} onToggleFav={toggleFav} onSelect={handleSelect} />)}
          </div>
          <button onClick={() => setShowAll(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: '1px dashed #e2e8f0', borderRadius: 10, padding: '11px 14px', background: 'none', cursor: 'pointer', marginTop: 8, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <span style={{ fontSize: 13, color: '#94a3b8', flex: 1, textAlign: 'left' }}>+{ALL_TEMPLATE_LIST.filter(t => !t.active).length} template-uri în curând — Explorează toate categoriile</span>
            <ChevRightIcon size={15} color="#94a3b8" />
          </button>
        </div>

        {/* Upload own */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
          <SectionLabel>Contract propriu</SectionLabel>
          <button onClick={() => setShowUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '14px 16px', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📤</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#334155' }}>Încarcă contractul tău</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Îl vom adăuga în profilul tău în 24-48h</p>
            </div>
            <ChevRightIcon size={16} color="#94a3b8" />
          </button>
        </div>
      </div>

      <BottomNav active="settings" navigate={navigate} />

      {showAll    && <AllContractsSheet favorites={favorites} onToggleFav={toggleFav} onSelect={handleSelect} onClose={() => setShowAll(false)} />}
      {showUpload && <UploadContractSheet onClose={() => setShowUpload(false)} />}
    </AppFrame>
  );
}

// Expus global pentru regenerare PDF din arhivă (ContractDetailSheet în pages-main.jsx)
window.buildContractBody = buildContractBody;
window.TEMPLATES_MAP = Object.fromEntries(TEMPLATES.map(t => [t.name, t]));

Object.assign(window, { ContractNewScreen, ContractTemplatesScreen });
