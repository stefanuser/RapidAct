// proto/pages-contract.jsx — 4-step contract creation flow

const {
  AppFrame, StepBar, FieldInput, PrimaryBtn, SecondaryBtn, SectionLabel,
  ChevLeftIcon, ChevRightIcon, CameraIcon, UploadIcon, CheckCircleIcon,
  AlertCircleIcon, FileTextIcon, SpinnerIcon, CheckIcon, DownloadIcon,
  BottomNav,
} = window;

// AssetPickerSheet + ASSET_TYPES loaded from pages-assets.jsx (via window)

// ─── Document Schemas (sursă unică de adevăr — câmpuri per act) ──────────────
// Fiecare document știe ce câmpuri produce și cum să le afișeze.
// Câmpurile produse de documente sunt referite în FIELD_REGISTRY via docId + fieldKey.
const DOC_SCHEMAS = {
  ci: {
    label: 'Carte de identitate',
    icon: '🪪',
    color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe',
    ocrMode: 'ro_ci',
    fields: [
      { key: 'full_name',       label: 'Nume și prenume',  ocr: j => [[j.first_name, j.last_name].filter(Boolean).join(' ')] },
      { key: 'cnp',             label: 'CNP',              ocr: j => [j.cnp] },
      { key: 'ci_serie',        label: 'Serie CI',         ocr: j => [j.ci_series] },
      { key: 'ci_nr',           label: 'Nr. CI',           ocr: j => [j.ci_number] },
      { key: 'data_nastere',    label: 'Data nașterii',    ocr: j => [j.birthdate], format: 'date' },
      { key: 'ci_valabilitate', label: 'CI valabilă până', ocr: j => [j.valid_until], format: 'date', confidence: 'uncertain' },
    ],
  },
  permis: {
    label: 'Permis de conducere',
    icon: '🚗',
    color: '#059669', bg: '#f0fdf4', border: '#a7f3d0',
    ocrMode: 'ro_permis',
    fields: [
      { key: 'titular',   label: 'Titular permis', ocr: j => [[j.first_name, j.last_name].filter(Boolean).join(' '), j.name, j.full_name, j.holder], verify: true },
      { key: 'nr',        label: 'Nr. permis',      ocr: j => [j.permis_number, j.license_number, j.document_number] },
      { key: 'categorii', label: 'Categorii',       ocr: j => [j.permis_categories, j.categories] },
      { key: 'expirare',  label: 'Valabil până',     ocr: j => [j.permis_expiry, j.expiry_date, j.valid_until], format: 'date', confidence: 'uncertain' },
    ],
  },
};

// ─── Field Registry (alias la sursa canonică din field-registry.jsx) ─────────
// Fluxul de generare consumă window.FIELD_REGISTRY (chei noi: client_ci_*, contract_*, asset_*).
const FIELD_REGISTRY = window.FIELD_REGISTRY;

// ─── Template data ────────────────────────────────────────────────────────────
// Template-urile definesc DOAR ce câmpuri folosesc (keys din FIELD_REGISTRY).
// Sursa, tipul, label-ul fiecărui câmp sunt definite în FIELD_REGISTRY — nu în template.
const TEMPLATES = [
  {
    id: 'rentacar-standard',
    name: 'Închiriere Auto',
    icon: '🚗',
    active: true,
    description: 'Contract standard de închiriere autovehicul cu predare-primire',
    fields: [
      'contract_numar', 'contract_data', 'contract_loc',
      'firma_denumire', 'firma_adresa', 'firma_reg_com', 'firma_cui', 'firma_reprezentant',
      'client_ci_nume_complet', 'client_ci_cnp', 'client_ci_serie', 'client_ci_numar',
      'client_ci_valabila_pana', 'client_ci_adresa', 'client_ci_data_nastere',
      'client_permis_numar', 'client_permis_categorii', 'client_permis_valabil_pana',
      'asset_auto_marca', 'asset_auto_model', 'asset_auto_an', 'asset_auto_nr_inmatriculare',
      'asset_auto_culoare', 'asset_auto_vin', 'asset_auto_casco',
      'contract_start', 'contract_end', 'contract_durata',
      'contract_km_start', 'contract_km_limita', 'contract_combustibil_nivel',
      'contract_pret_zi', 'contract_total', 'contract_garantie', 'contract_fransiza',
      'contract_mod_plata', 'contract_observatii',
      'semnatura_mea', 'semnatura_client',
    ],
  },
];

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
    let settled = false;
    const cleanup = () => { if (!settled) { settled = true; URL.revokeObjectURL(objUrl); } };
    // Unele fișiere (ex. .HEIC pe laptop) nu pot fi decodate de browser și NU
    // declanșează nici onload, nici onerror → fără acest guard scanarea s-ar bloca
    // la infinit. Limită 10s + mesaj clar.
    const guard = setTimeout(() => {
      if (settled) return;
      cleanup();
      reject(new Error('Nu am putut citi imaginea (format neacceptat?). Încearcă JPG sau PNG.'));
    }, 10000);
    img.onload = () => {
      clearTimeout(guard);
      cleanup();
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
    img.onerror = () => {
      clearTimeout(guard);
      cleanup();
      reject(new Error('Format de imagine neacceptat. Încearcă JPG sau PNG.'));
    };
    img.src = objUrl;
  });
}

// Generic OCR parser bazat pe DOC_SCHEMAS
function parseDocOcr(docId, json) {
  const schema = DOC_SCHEMAS[docId];
  if (!schema) return { values: {}, confidence: {} };
  const values = {}, confidence = {};
  for (const f of schema.fields) {
    if (!f.ocr) continue;
    const candidates = f.ocr(json).filter(v => v && typeof v === 'string' && v.trim());
    if (!candidates.length) continue;
    const raw = candidates[0].trim();
    const val = f.format === 'date' ? toRoDate(raw) : raw;
    if (val) {
      values[f.key] = val;
      confidence[f.key] = f.confidence || 'confident';
    }
  }
  return { values, confidence };
}

// ─── Scan documents config ────────────────────────────────────────────────────
// Catalog acte scanabile — cheia = ocrDoc din FIELD_REGISTRY (window.FIELD_REGISTRY)
const SCAN_DOC_CATALOG = {
  ci:       { id: 'ci',       icon: '🪪', label: 'Carte de identitate', sub: 'CI / Buletin',      type: 'scan', ocrMode: 'ro_ci',       required: true  },
  permis:   { id: 'permis',   icon: '🚗', label: 'Permis de conducere', sub: 'Permis auto',       type: 'scan', ocrMode: 'ro_permis',   required: false },
  pasaport: { id: 'pasaport', icon: '🛂', label: 'Pașaport',            sub: 'Act de identitate', type: 'scan', ocrMode: 'ro_pasaport', required: false },
};

// Derivă actele necesare dintr-un template: ocrDoc unic al câmpurilor source:'ocr'
function neededScanDocs(template) {
  const reg = window.FIELD_REGISTRY || {};
  const ids = [...new Set(
    (template?.fields || [])
      .map(k => reg[k])
      .filter(r => r && r.source === 'ocr' && r.ocrDoc)
      .map(r => r.ocrDoc)
  )];
  return ids.map(id => SCAN_DOC_CATALOG[id]).filter(Boolean);
}

// ─── DocCard ──────────────────────────────────────────────────────────────────
const DOC_FIELD_LABELS = {
  // DOC_SCHEMAS CI keys (folosite în DocCard pentru afișare date scanate)
  full_name:        'Nume și prenume',
  cnp:              'CNP',
  ci_serie:         'Serie CI',
  ci_nr:            'Nr. CI',
  data_nastere:     'Data nașterii',
  ci_valabilitate:  'CI valabilă până',
  // DOC_SCHEMAS permis keys
  titular:    'Titular permis',
  nr:         'Nr. permis',
  categorii:  'Categorii',
  expirare:   'Valabil până',
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
function StepScan({ template, onDone, initialScanned }) {
  const [scanned, setScanned]   = React.useState(initialScanned || {});   // { docId: { values, confidence } | { error } }
  const [scanning, setScanning] = React.useState(null); // docId scanat curent

  // Actele cerute = derivate din câmpurile OCR ale template-ului
  const docs = React.useMemo(() => neededScanDocs(template), [template]);

  const hasAny = Object.values(scanned).some(s => Object.keys(s.values || {}).length > 0);

  async function scanDoc(doc, file) {
    if (scanning) return; // M21 — guard împotriva double-click / race condition
    setScanning(doc.id);
    // Limită 10s pe cererea OCR — fără asta fetch poate atârna la infinit (rotița
    // se învârte fără sfârșit). Oglindește comportamentul din scanul de profil.
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 10000);
    try {
      const base64 = await compressImage(file);
      const { data: { session } } = await window.sb.auth.getSession();
      const res = await fetch('https://wfresisyrlrawquzwlrs.supabase.co/functions/v1/ocr-ci', {
        method: 'POST',
        signal: ctrl.signal,
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
      const msg = err.name === 'AbortError'
        ? 'Timeout — scanarea a durat prea mult (peste 10s). Încearcă cu o poză mai clară sau mai mică.'
        : err.message;
      setScanned(prev => ({ ...prev, [doc.id]: { values: {}, confidence: {}, error: msg } }));
    } finally {
      clearTimeout(timeoutId);
      setScanning(null);
    }
  }

  function rescan(docId) {
    setScanned(prev => { const n = { ...prev }; delete n[docId]; return n; });
  }

  function finish() {
    // scanned = { docId: { values, confidence } } — exact formatul docData
    onDone({ docData: scanned });
  }

  const scannedCount = Object.keys(scanned).filter(id => Object.keys(scanned[id].values || {}).length > 0).length;

  // Template fără câmpuri OCR → nimic de scanat, trecem direct la completare
  if (docs.length === 0) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 32px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Scanează acte</h2>
        <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: 14, padding: '28px 20px', textAlign: 'center', background: '#fafafa', marginBottom: 20 }}>
          <p style={{ fontSize: 30, marginBottom: 10 }}>✅</p>
          <p style={{ fontWeight: 600, fontSize: 14, color: '#334155', marginBottom: 6 }}>Acest contract nu necesită scanare</p>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>Datele se completează la pasul următor.</p>
        </div>
        <PrimaryBtn onClick={finish}>Continuă → Completează datele</PrimaryBtn>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Scanează acte</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Acest contract necesită {docs.map(d => d.label.toLowerCase()).join(' + ')}. Datele se extrag automat cu AI.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {docs.map(doc => (
          <DocCard
            key={doc.id}
            doc={doc}
            data={scanned[doc.id] || null}
            scanning={scanning}
            onScanFile={file => scanDoc(doc, file)}
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

// Randează un body template cu sintaxa {{cheie}} (folosit pentru template-uri din DB)
function fillTemplate(bodyText, values) {
  return bodyText.replace(/\{\{(\w+)\}\}/g, (_, k) => values[k] || '___________');
}

// Converteste un rand din Supabase contract_templates in obiect template folosibil in app
function parseDbTemplate(row) {
  return {
    id:           row.id,
    name:         row.name,
    icon:         row.icon || '📋',
    description:  row.description || '',
    category:     row.category || 'General',
    active:       row.active,
    fields:       row.fields || [],
    bodyText:     row.body_template || '',
    userId:       row.user_id || null,
    isDbTemplate: true,
  };
}

function buildContractBody(template, values) {
  if (template.bodyText) return fillTemplate(template.bodyText, values);
  // Fallback generic (template fără body_template): listează câmpurile cu
  // label-uri din FIELD_REGISTRY. Fără chei vechi, fără hardcodare pe rentacar.
  const reg = window.FIELD_REGISTRY || {};
  const lines = (template.fields || [])
    .filter(k => reg[k] && reg[k].type !== 'image')
    .map(k => `${reg[k]?.label || k}: ${values[k] || '___________'}`);
  return `${(template.name || 'CONTRACT').toUpperCase()}\n\n${lines.join('\n')}`;
}
// ─── All available templates (active + coming soon) ──────────────────────────

// Categorii canonice — sursă unică în field-registry.jsx (window.TEMPLATE_CATEGORIES)
const CATEGORIES = window.TEMPLATE_CATEGORIES;

// ─── Step 1: Template ─────────────────────────────────────────────────────────
function StepTemplate({ onSelect, templates }) {
  templates = templates || TEMPLATES;
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
    const template = templates.find(tp => tp.id === t.id);
    if (template) onSelect(template);
  }

  const favList = templates.filter(t => favorites.includes(t.id) && t.active);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Alege contractul</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Apasă pe un contract pentru a-l vedea sau pe „Alege" ca să continui.</p>

      {/* Favorite */}
      {favList.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>⭐ Favorite</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {favList.map(t => <TemplateCard key={t.id} t={t} isFav onToggleFav={toggleFav} onSelect={handleSelect} />)}
          </div>
        </div>
      ) : (
        <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: 14, padding: '24px 20px', textAlign: 'center', marginBottom: 20, background: '#fafafa' }}>
          <p style={{ fontSize: 30, marginBottom: 8 }}>⭐</p>
          <p style={{ fontWeight: 600, fontSize: 14, color: '#334155', marginBottom: 6 }}>Niciun contract favorit</p>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            Alege un contract de mai jos sau marchează-l cu ⭐ ca să apară aici.
          </p>
        </div>
      )}

      {/* Alege alt contract → sheet cu toate categoriile */}
      <button
        onClick={() => setShowAll(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', marginBottom: 20 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f8fafc'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🗂️</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>Alege alt contract</p>
          <p style={{ fontSize: 12, color: '#64748b' }}>Explorează toate categoriile disponibile</p>
        </div>
        <ChevRightIcon size={16} color="#64748b" />
      </button>

      {/* Contract propriu */}
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

      {showAll    && <AllContractsSheet templates={templates} favorites={favorites} onToggleFav={toggleFav} onSelect={handleSelect} onClose={() => setShowAll(false)} />}
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
          <p style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc || t.description}</p>
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
  // bodyText din DB (template-uri reale) sau fallback la corpul hardcodat (rentacar legacy)
  const previewText = buildContractBody(t, {});
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
    if (downloading) return;
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
    if (downloading) return;
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
            <p style={{ fontSize: 12, color: '#64748b' }}>{t.desc || t.description}</p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {previewText && (
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
function AllContractsSheet({ templates, favorites, onToggleFav, onSelect, onClose }) {
  const [search, setSearch]     = React.useState('');
  const [expanded, setExpanded] = React.useState({});
  templates = (templates || []).filter(t => t.active);

  function toggleCat(cat) { setExpanded(prev => ({ ...prev, [cat]: !prev[cat] })); }

  const q = search.toLowerCase();
  const filtered = search
    ? templates.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.desc || t.description || '').toLowerCase().includes(q)
      )
    : null;

  // Grupare: categoriile canonice (globale) + grup virtual „Contractele Mele" (user_id ≠ null)
  const groups = [
    ...CATEGORIES.map(cat => ({ id: cat.id, icon: cat.icon, items: templates.filter(t => !t.userId && (t.category || 'General') === cat.id) })),
    { id: window.TEMPLATE_CAT_MINE.id, icon: window.TEMPLATE_CAT_MINE.icon, items: templates.filter(t => t.userId) },
  ].filter(g => g.items.length);

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
              {groups.map(cat => {
                const items = cat.items;
                const isOpen = expanded[cat.id] === true;
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
function StepForm({ template, docData, profile, savedValues, assets, onDone }) {
  // docEdits: override-uri user pentru câmpuri OCR (docId -> { fieldKey: val })
  const [docEdits, setDocEdits] = React.useState(() => {
    if (!savedValues || !Object.keys(savedValues).length) return {};
    const edits = {};
    (template.fields || []).forEach(key => {
      const reg = FIELD_REGISTRY[key];
      if (!reg || reg.source !== 'ocr') return;
      if (savedValues[key] !== undefined) {
        if (!edits[reg.ocrDoc]) edits[reg.ocrDoc] = {};
        edits[reg.ocrDoc][reg.ocrKey] = savedValues[key];
      }
    });
    return edits;
  });

  // manualVals: câmpuri cu source 'manual' sau 'computed'
  const [manualVals, setManualVals] = React.useState(() => {
    const m = {};
    (template.fields || []).forEach(key => {
      const reg = FIELD_REGISTRY[key];
      if (!reg || (reg.source !== 'manual' && reg.source !== 'computed')) return;
      if (savedValues && savedValues[key] !== undefined) {
        m[key] = savedValues[key];
      } else if (reg.compute === 'today') {
        const n = new Date();
        m[key] = `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`;
      }
    });
    return m;
  });

  const [showAssetPicker, setShowAssetPicker] = React.useState(false);
  const [selectedAsset, setSelectedAsset]     = React.useState(null);
  const AssetPickerSheet = window.AssetPickerSheet;

  function setDocField(docId, fieldKey, val) {
    setDocEdits(prev => ({ ...prev, [docId]: { ...(prev[docId] || {}), [fieldKey]: val } }));
  }

  function setManualField(key, val) {
    setManualVals(prev => {
      const next = { ...prev, [key]: val };
      // Auto-calc: nr zile (contract_durata) din date predare/restituire
      if ((key === 'contract_start' || key === 'contract_end') && next.contract_start && next.contract_end) {
        const diff = new Date(next.contract_end) - new Date(next.contract_start);
        if (diff > 0) next.contract_durata = Math.ceil(diff / 86400000).toString();
        else next.contract_durata = '';
      }
      // Auto-calc: total = zile × tarif/zi
      const toNum = s => parseFloat(String(s || '').replace(',', '.')) || 0;
      if ((key === 'contract_durata' || key === 'contract_pret_zi') && next.contract_durata && next.contract_pret_zi) {
        const auto = (toNum(next.contract_durata) * toNum(next.contract_pret_zi)).toFixed(0);
        const prevAuto = prev.contract_durata && prev.contract_pret_zi ? (toNum(prev.contract_durata) * toNum(prev.contract_pret_zi)).toFixed(0) : null;
        if (!prev.contract_total || prev.contract_total === prevAuto) next.contract_total = auto;
      }
      return next;
    });
  }

  function getDocVal(docId, fieldKey) {
    return docEdits[docId]?.[fieldKey] ?? docData[docId]?.values?.[fieldKey] ?? '';
  }
  function getDocConf(docId, fieldKey) {
    if (docEdits[docId]?.[fieldKey] !== undefined) return 'confident';
    return docData[docId]?.confidence?.[fieldKey] || null;
  }

  function resolveContractValues() {
    const out = {};
    (template.fields || []).forEach(key => {
      const reg = FIELD_REGISTRY[key];
      if (!reg) return;
      if (reg.source === 'ocr')          out[key] = getDocVal(reg.ocrDoc, reg.ocrKey);
      else if (reg.source === 'profile') out[key] = profile?.[reg.profileKey] ?? '';
      else if (reg.source === 'asset')   out[key] = selectedAsset?.details?.[reg.assetKey] ?? '';
      else                               out[key] = manualVals[key] ?? '';
    });
    return out;
  }

  const missingRequired = (template.fields || [])
    .filter(key => {
      const reg = FIELD_REGISTRY[key];
      return reg && (reg.source === 'manual' || reg.source === 'computed') && reg.required && !manualVals[key];
    })
    .map(key => FIELD_REGISTRY[key].label);

  const cnpVal = getDocVal('ci', 'cnp');
  const cnpInvalid = cnpVal.length > 0 && !validateCnp(cnpVal);

  const ciName        = getDocVal('ci', 'full_name').trim().toLowerCase();
  const permisTitular = getDocVal('permis', 'titular').trim().toLowerCase();
  const namesMismatch = ciName && permisTitular && ciName !== permisTitular;

  // Câmpuri din Active (source:'asset') — un singur tip de activ per template
  const assetFields = (template.fields || [])
    .map(k => ({ key: k, ...FIELD_REGISTRY[k] }))
    .filter(r => r.source === 'asset');
  const assetType      = assetFields[0]?.assetType || null; // 'car' | 'property' | 'company'
  const hasAssetFields = assetFields.length > 0;
  const assetCandidates = (assets || []).filter(a => a.type === assetType);
  const ASSET_META = {
    car:      { icon: '🚙', label: 'mașina',       labelPl: 'mașini',       reg: 'din registrul Active' },
    property: { icon: '🏠', label: 'proprietatea', labelPl: 'proprietăți',  reg: 'din registrul Active' },
    company:  { icon: '🏢', label: 'compania',     labelPl: 'companii',     reg: 'din registrul Active' },
  };
  const assetMeta = ASSET_META[assetType] || ASSET_META.car;

  function handleAssetSelect(asset) {
    // Valorile asset_* se rezolvă direct din asset.details[assetKey] în resolveContractValues
    setSelectedAsset(asset);
    setShowAssetPicker(false);
  }

  const focusIdxRef = React.useRef(0);
  function scrollToNextMissing() {
    const missingKeys = (template.fields || []).filter(key => {
      const reg = FIELD_REGISTRY[key];
      return reg && (reg.source === 'manual' || reg.source === 'computed') && reg.required && !manualVals[key];
    });
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

  // Grupează câmpurile manuale/computed după FIELD_REGISTRY[key].formGroup
  const manualGroups = [];
  (template.fields || []).forEach(key => {
    const reg = FIELD_REGISTRY[key];
    if (!reg || (reg.source !== 'manual' && reg.source !== 'computed')) return;
    const groupTitle = reg.formGroup || 'Contract';
    let g = manualGroups.find(x => x.title === groupTitle);
    if (!g) { g = { title: groupTitle, fields: [] }; manualGroups.push(g); }
    g.fields.push({ key, ...reg });
  });

  const docsWithData = Object.entries(docData)
    .filter(([, d]) => d && !d.error && Object.keys(d.values || {}).length > 0);

  // Rânduri profil firmă: câmpuri cu source='profile' din template
  const PROFILE_LABELS = { firm_name: 'Firmă', firm_cui: 'CUI', firm_address: 'Adresă sediu', firm_reg: 'Reg. Com.', legal_rep: 'Reprezentant legal' };
  const profileRows = (template.fields || [])
    .filter(key => FIELD_REGISTRY[key]?.source === 'profile')
    .filter((key, i, arr) => arr.indexOf(key) === i)
    .map(key => {
      const reg = FIELD_REGISTRY[key];
      const val = profile?.[reg.profileKey];
      return val ? { key, label: PROFILE_LABELS[reg.profileKey] || reg.label, value: val } : null;
    })
    .filter(Boolean);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>

        {docsWithData.map(([docId]) => {
          const schema = DOC_SCHEMAS[docId];
          if (!schema) return null;
          return (
            <div key={docId} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{schema.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: schema.color }}>{schema.label}</span>
                <span style={{ fontSize: 10, background: schema.bg, color: schema.color, border: `1px solid ${schema.border}`, borderRadius: 5, padding: '1px 7px', fontWeight: 700, marginLeft: 'auto', flexShrink: 0 }}>Din OCR — verifică</span>
              </div>
              <div style={{ background: schema.bg, border: `1.5px solid ${schema.border}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {schema.fields.map(f => {
                  const val  = getDocVal(docId, f.key);
                  const conf = getDocConf(docId, f.key);
                  if (!val && !f.verify) return null;
                  return (
                    <div key={f.key} id={`field-doc-${docId}-${f.key}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' }}>{f.label}</label>
                        {conf === 'uncertain' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fef3c7', color: '#d97706', borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                            <AlertCircleIcon size={10} /> Verifică
                          </span>
                        )}
                        {f.verify && ciName && permisTitular && (
                          namesMismatch
                            ? <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', borderRadius: 5, padding: '1px 7px', fontWeight: 700 }}>&#9888; Diferit de CI</span>
                            : <span style={{ fontSize: 10, background: '#dcfce7', color: '#16a34a', borderRadius: 5, padding: '1px 7px', fontWeight: 700 }}>&#10003; Potrivire CI</span>
                        )}
                        {f.verify && (!ciName || !permisTitular) && (
                          <span style={{ fontSize: 10, background: '#eff6ff', color: '#2563eb', borderRadius: 5, padding: '1px 7px', fontWeight: 700 }}>Cross-check</span>
                        )}
                      </div>
                      <FieldInput
                        field={{ key: `${docId}_ocr_${f.key}`, type: 'text', label: f.label }}
                        value={val}
                        onChange={v => setDocField(docId, f.key, v)}
                        confidence={conf}
                      />
                    </div>
                  );
                })}
                {docId === 'ci' && cnpInvalid && (
                  <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>&#9888;&#65039;</span>
                    <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>CNP-ul pare invalid (cifră de control greșită). Verifică manual înainte de a genera contractul.</p>
                  </div>
                )}
                {docId === 'permis' && namesMismatch && (
                  <div style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>&#128680;</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>Permisul aparține altei persoane!</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#eff6ff', color: '#1e40af', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>CI</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>{getDocVal('ci', 'full_name')}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#f0fdf4', color: '#166534', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>Permis</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>{getDocVal('permis', 'titular')}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: '#b91c1c', marginTop: 6 }}>Verifică dacă ai scanat documentele corecte sau editează manual.</p>
                    </div>
                  </div>
                )}
                {docId === 'permis' && ciName && permisTitular && !namesMismatch && (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>&#10003;</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>Titular confirmat — aceeași persoană ca în CI.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {profileRows.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>&#127962;</span>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#7c3aed' }}>Date firmă</span>
              <span style={{ fontSize: 10, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', borderRadius: 5, padding: '1px 7px', fontWeight: 700, marginLeft: 'auto', flexShrink: 0 }}>Din profil</span>
            </div>
            <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {profileRows.map(({ key, label, value }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <span style={{ fontSize: 11, color: '#7c3aed', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4c1d95', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasAssetFields && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>{assetType === 'property' ? 'Proprietate' : assetType === 'company' ? 'Companie' : 'Vehicul'}</SectionLabel>
            {selectedAsset ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '11px 14px' }}>
                <span style={{ fontSize: 22 }}>{assetMeta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>{selectedAsset.name || selectedAsset.details?.plate || selectedAsset.details?.name}</p>
                  <p style={{ fontSize: 12, color: '#3b82f6' }}>{assetFields.map(f => selectedAsset.details?.[f.assetKey]).filter(Boolean).slice(0, 3).join(' · ')}</p>
                </div>
                <button onClick={() => { setSelectedAsset(null); setShowAssetPicker(true); }} style={{ fontSize: 12, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>Schimbă</button>
              </div>
            ) : (
              <button onClick={() => setShowAssetPicker(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: '1.5px dashed #bfdbfe', borderRadius: 12, padding: '12px 14px', background: '#f0f9ff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#bfdbfe'}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{assetMeta.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1e40af' }}>{assetCandidates.length > 0 ? `Alege ${assetMeta.label} ${assetMeta.reg}` : `Adaugă ${assetMeta.labelPl} în Active`}</p>
                  <p style={{ fontSize: 12, color: '#3b82f6' }}>{assetCandidates.length > 0 ? `${assetCandidates.length} salvat${assetCandidates.length === 1 ? '' : 'e'} · completare automată` : 'Economisești timp la contracte repetitive'}</p>
                </div>
                <ChevRightIcon size={16} color="#3b82f6" />
              </button>
            )}
          </div>
        )}

        {manualGroups.map(({ title, fields }) => (
          <FieldSection key={title} title={title} fields={fields} values={manualVals} onChange={setManualField} />
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
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
            <p style={{ fontSize: 11, color: '#ef4444', lineHeight: 1.5 }}>{missingRequired.join(' · ')}</p>
            <p style={{ fontSize: 11, color: '#b91c1c', marginTop: 5, fontWeight: 600 }}>&#8595; Apasă pentru a merge la câmpul următor</p>
          </div>
        )}
        <PrimaryBtn onClick={() => onDone(resolveContractValues())} disabled={missingRequired.length > 0}>
          Preview contract &#8594;
        </PrimaryBtn>
        {missingRequired.length > 0 && (
          <button
            onClick={() => onDone(resolveContractValues())}
            style={{ display: 'block', width: '100%', marginTop: 8, padding: '10px', border: '1.5px solid #16a34a', borderRadius: 10, background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
            onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}>
            Continuă fără câmpuri obligatorii &#8594;
          </button>
        )}
      </div>

      {showAssetPicker && AssetPickerSheet && (
        <AssetPickerSheet
          type={assetType || 'car'}
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
                {clientSig ? `${values.client_ci_nume_complet || 'Client'} a semnat` : 'Clientul poate semna acum pe ecran'}
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
  const STEPS = ['template', 'scan', 'form', 'preview'];

  // Template-uri: hardcoded (fallback) + DB (globale + custom ale userului)
  const [allTemplates, setAllTemplates] = React.useState(TEMPLATES);

  React.useEffect(() => {
    async function loadDbTemplates() {
      try {
        const { data, error } = await window.sb
          .from('contract_templates')
          .select('*')
          .eq('active', true)
          .order('sort_order');
        if (error || !data || !data.length) return;
        const parsed = data.map(parseDbTemplate);
        setAllTemplates(prev => {
          const merged = [...prev];
          for (const tpl of parsed) {
            const idx = merged.findIndex(t => t.id === tpl.id);
            // DB-ul are prioritate — suprascrie dacă există deja (ex: rentacar-standard cu bodyText)
            if (idx >= 0) merged[idx] = { ...merged[idx], ...tpl };
            else merged.push(tpl);
          }
          return merged;
        });
      } catch(e) {
        console.warn('DB templates load failed:', e);
      }
    }
    loadDbTemplates();
  }, []);


  const [stepIdx, setStepIdx]     = React.useState(0);
  const [template, setTemplate]   = React.useState(null);
  const [docData, setDocData]     = React.useState({});
  const [formValues, setFormValues] = React.useState({});
  const [generating, setGenerating] = React.useState(false);
  const [pdfError, setPdfError]   = React.useState('');
  const [done, setDone]           = React.useState(false);
  const [skipSig, setSkipSig]     = React.useState(false);
  const [pdfBlob, setPdfBlob]     = React.useState(null);
  const [pdfFilename, setPdfFilename] = React.useState('');

  const step = STEPS[stepIdx];

  function goBack() {
    if (stepIdx === 0) {
      navigate('dashboard');
    } else {
      if (stepIdx === 2) setFormValues({});
      setStepIdx(i => i - 1);
    }
  }

  async function handleGenerate(clientSig = null) {
    setGenerating(true);
    try {
      const contractBody = buildContractBody(template, formValues);
      const driverName = formValues.client_ci_nume_complet || 'client';
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
        parties:       [{ name: formValues.client_ci_nume_complet || 'Necunoscut' }],
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
    setStepIdx(0); setTemplate(null);
    setDocData({});
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
          driverName={formValues.client_ci_nume_complet}
          pdfBlob={pdfBlob}
          filename={pdfFilename}
          onNew={reset}
          onHistory={() => navigate('history')}
        />
      ) : step === 'template' ? (
        <StepTemplate onSelect={t => { setTemplate(t); setStepIdx(1); }} templates={allTemplates} />
      ) : step === 'scan' ? (
        <StepScan
          template={template}
          onDone={o => { setDocData(o.docData); setFormValues({}); setStepIdx(2); }}
          initialScanned={docData}
        />
      ) : step === 'form' && template ? (
        <StepForm
          template={template}
          docData={docData}
          profile={profile}
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
// Expus global pentru regenerare PDF din arhivă (ContractDetailSheet în pages-main.jsx)
window.buildContractBody = buildContractBody;
// TEMPLATES_MAP: keyed atât by id cât și by name (pages-main.jsx caută by template_name)
window.TEMPLATES_MAP = {
  ...Object.fromEntries(TEMPLATES.map(t => [t.id, t])),
  ...Object.fromEntries(TEMPLATES.map(t => [t.name, t])),
};
// window.FIELD_REGISTRY e definit în field-registry.jsx (încărcat primul în index.html)

Object.assign(window, { ContractNewScreen });
