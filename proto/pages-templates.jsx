// proto/pages-templates.jsx — Template management dashboard

const {
  AppFrame, BottomNav, SectionLabel,
  ChevLeftIcon, PlusIcon, EditIcon, SpinnerIcon, CheckIcon,
} = window;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractFields(bodyText) {
  if (!bodyText) return [];
  const reg = window.FIELD_REGISTRY || {};
  const keys = (bodyText.match(/\{\{([^}]+)\}\}/g) || []).map(m => m.slice(2, -2).trim());
  return [...new Set(keys.filter(k => k in reg))];
}

function deriveScanDocs(fields) {
  const reg = window.FIELD_REGISTRY || {};
  const docs = new Set();
  fields.forEach(key => {
    const r = reg[key];
    if (r?.source === 'ocr') docs.add(r.docId);
  });
  return [...docs];
}

function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}

function parseTemplateRow(row) {
  return {
    id:          row.id,
    name:        row.name,
    icon:        row.icon || '📋',
    description: row.description || '',
    category:    row.category || 'General',
    active:      row.active !== false,
    fields:      row.fields || [],
    bodyText:    row.body_template || '',
    userId:      row.user_id || null,
    isGlobal:    !row.user_id,
    sortOrder:   row.sort_order ?? 9999,
    createdAt:   row.created_at,
  };
}

// ─── Source style helpers ─────────────────────────────────────────────────────
const SOURCE_STYLE = {
  ocr:      { bg: '#dcfce7', color: '#166534', label: 'OCR' },
  profile:  { bg: '#dbeafe', color: '#1e40af', label: 'Profil' },
  manual:   { bg: '#fef9c3', color: '#92400e', label: 'Manual' },
  computed: { bg: '#f3e8ff', color: '#6b21a8', label: 'Auto' },
};

// ─── FieldPickerSheet ─────────────────────────────────────────────────────────
function FieldPickerSheet({ onSelect, onClose }) {
  const reg = window.FIELD_REGISTRY || {};
  const [activeCategory, setActiveCategory] = React.useState('Persoana');

  const CAT_ORDER = ['Persoana', 'Firma', 'Vehicul', 'Contract'];
  const CAT_EMOJI = { Persoana: '👤', Firma: '🏢', Vehicul: '🚗', Contract: '📋' };

  const fieldsInCategory = Object.entries(reg).filter(([, v]) => v.cat === activeCategory);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }} />

      <div className="slide-up" style={{
        position: 'relative', width: '100%', maxWidth: 420,
        background: '#fff', borderRadius: '20px 20px 0 0',
        maxHeight: '72vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 12px' }}>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Câmpuri disponibile</p>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, color: '#64748b' }}>✕</button>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px', overflowX: 'auto' }}>
          {CAT_ORDER.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '6px 13px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
              background: activeCategory === cat ? '#2563eb' : '#f1f5f9',
              color: activeCategory === cat ? '#fff' : '#64748b',
              transition: 'all 0.15s',
            }}>
              {CAT_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Fields list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 28px' }}>
          {fieldsInCategory.map(([key, r]) => {
            const st = SOURCE_STYLE[r.source] || SOURCE_STYLE.manual;
            return (
              <button key={key} onClick={() => onSelect(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                  background: '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: 6,
                  transition: 'border-color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{r.label}</p>
                  <p style={{ fontSize: 12, fontFamily: '"SF Mono","Fira Code",monospace', color: '#2563eb', marginTop: 2 }}>
                    {`{{${key}}}`}
                  </p>
                </div>
                <span style={{
                  background: st.bg, color: st.color,
                  borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TemplateCard ─────────────────────────────────────────────────────────────
function TemplateCard({ template, onEdit }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      border: '1.5px solid #e2e8f0', borderRadius: 12,
      padding: '13px 14px', marginBottom: 8, background: '#fff',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#93c5fd'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
    >
      {/* Icon */}
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>
        {template.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <p style={{ fontWeight: 600, fontSize: 14 }}>{template.name}</p>
          {template.isGlobal && (
            <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>Standard</span>
          )}
          {!template.active && (
            <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>Inactiv</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {template.description || `${template.fields.length} câmpuri`}
        </p>
      </div>

      {/* Action */}
      <button onClick={onEdit} style={{
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
        padding: '6px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        color: '#475569', flexShrink: 0, transition: 'background 0.12s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
      >
        {template.isGlobal ? 'Vezi' : 'Editează'}
      </button>
    </div>
  );
}

// ─── TemplateEditor ───────────────────────────────────────────────────────────
function TemplateEditor({ template, userId, onSave, onDelete, onClose }) {
  const isNew  = !template;
  const isOwn  = isNew || (template.userId && template.userId === userId);
  const isGlobal = !isNew && template.isGlobal;

  const [name,        setName]        = React.useState(template?.name || '');
  const [icon,        setIcon]        = React.useState(template?.icon || '📋');
  const [description, setDescription] = React.useState(template?.description || '');
  const [category,    setCategory]    = React.useState(template?.category || 'General');
  const [active,      setActive]      = React.useState(template?.active !== false);
  const [body,        setBody]        = React.useState(template?.bodyText || '');
  const [saving,      setSaving]      = React.useState(false);
  const [deleting,    setDeleting]    = React.useState(false);
  const [error,       setError]       = React.useState('');
  const [showPicker,  setShowPicker]  = React.useState(false);

  const taRef        = React.useRef(null);
  const savedCursor  = React.useRef(0);

  const derivedFields = extractFields(body);

  function saveCursor() {
    if (taRef.current) savedCursor.current = taRef.current.selectionStart ?? body.length;
  }

  function insertField(key) {
    const pos     = savedCursor.current;
    const snippet = `{{${key}}}`;
    const newBody = body.slice(0, pos) + snippet + body.slice(pos);
    const newPos  = pos + snippet.length;
    setBody(newBody);
    savedCursor.current = newPos;
    setShowPicker(false);
    setTimeout(() => {
      if (taRef.current) {
        taRef.current.focus();
        taRef.current.setSelectionRange(newPos, newPos);
      }
    }, 60);
  }

  async function handleSave() {
    if (!name.trim())  { setError('Numele template-ului este obligatoriu.'); return; }
    if (!body.trim())  { setError('Corpul contractului este obligatoriu.'); return; }
    setError('');
    setSaving(true);
    try {
      const fields   = extractFields(body);
      const scanDocs = deriveScanDocs(fields);
      const now      = new Date().toISOString();

      const row = {
        name:          name.trim(),
        icon:          icon || '📋',
        description:   description.trim(),
        category:      category || 'General',
        active,
        body_template: body,
        fields,
        scan_docs:     scanDocs,
        updated_at:    now,
      };

      let savedRow;
      if (isNew) {
        row.id         = generateSlug(name);
        row.user_id    = userId;
        row.created_at = now;
        const { data, error: err } = await window.sb.from('contract_templates').insert(row).select().single();
        if (err) throw err;
        savedRow = data;
      } else {
        const { data, error: err } = await window.sb.from('contract_templates').update(row).eq('id', template.id).select().single();
        if (err) throw err;
        savedRow = data;
      }
      onSave(savedRow);
    } catch (err) {
      setError(err.message || 'Eroare la salvare. Încearcă din nou.');
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

  const inputStyle = (editable) => ({
    width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #e2e8f0',
    padding: '0 12px', fontSize: 14, outline: 'none',
    background: editable ? '#fff' : '#f8fafc',
    color: editable ? '#0f172a' : '#64748b',
    transition: 'border-color 0.15s',
  });

  return (
    <>
      {/* Overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }} />

        <div className="slide-up" style={{
          position: 'relative', width: '100%', maxWidth: 420,
          background: '#fff', borderRadius: '20px 20px 0 0',
          maxHeight: '94vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.16)',
        }}>
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <button onClick={onClose} style={{ fontSize: 14, color: '#64748b', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, padding: '4px 0' }}>
              Anulează
            </button>
            <p style={{ fontWeight: 700, fontSize: 16 }}>
              {isNew ? 'Template nou' : (isOwn ? 'Editează template' : 'Vizualizează')}
            </p>
            {isOwn ? (
              <button onClick={handleSave} disabled={saving} style={{
                fontSize: 14, fontWeight: 700, border: 'none', background: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                color: saving ? '#94a3b8' : '#2563eb', padding: '4px 0',
              }}>
                {saving ? 'Salvez...' : 'Salvează'}
              </button>
            ) : (
              <div style={{ width: 60 }} />
            )}
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 36px' }}>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            {/* Icon + Name */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Icon</label>
                <input value={icon} onChange={e => setIcon(e.target.value)} disabled={!isOwn} maxLength={2}
                  style={{ width: 52, height: 44, borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 22, textAlign: 'center', outline: 'none', background: isOwn ? '#fff' : '#f8fafc', cursor: isOwn ? 'text' : 'default' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Nume *</label>
                <input value={name} onChange={e => setName(e.target.value)} disabled={!isOwn}
                  placeholder="ex. Închiriere Auto"
                  style={inputStyle(isOwn)}
                  onFocus={e => { if (isOwn) e.target.style.borderColor = '#93c5fd'; }}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Descriere</label>
              <input value={description} onChange={e => setDescription(e.target.value)} disabled={!isOwn}
                placeholder="Scurtă descriere a contractului"
                style={inputStyle(isOwn)}
                onFocus={e => { if (isOwn) e.target.style.borderColor = '#93c5fd'; }}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* Category + Active */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Categorie</label>
                <select value={category} onChange={e => setCategory(e.target.value)} disabled={!isOwn}
                  style={{ ...inputStyle(isOwn), cursor: isOwn ? 'pointer' : 'default' }}>
                  {['General', 'Închiriere Auto', 'Imobiliare', 'Servicii', 'Muncă', 'Altele'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {isOwn && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Activ</span>
                  <button onClick={() => setActive(a => !a)} style={{
                    width: 46, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer',
                    background: active ? '#2563eb' : '#cbd5e1',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: active ? 23 : 3,
                      width: 20, height: 20, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '0 -16px 18px' }} />

            {/* Body template */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8' }}>
                  Corp contract *
                </label>
                {isOwn && (
                  <button onClick={() => { saveCursor(); setShowPicker(true); }} style={{
                    fontSize: 12, color: '#2563eb', fontWeight: 700,
                    border: '1px solid #bfdbfe', borderRadius: 7,
                    padding: '4px 10px', background: '#eff6ff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <PlusIcon size={11} /> Câmp
                  </button>
                )}
              </div>

              <textarea
                ref={taRef}
                value={body}
                onChange={e => setBody(e.target.value)}
                onMouseUp={saveCursor} onKeyUp={saveCursor} onClick={saveCursor}
                disabled={!isOwn}
                placeholder={
                  `Scrie corpul contractului.\nFolosește {{câmp}} pentru câmpuri dinamice.\n\nEx: Subsemnatul {{driver_name}}, CNP {{driver_cnp}}, legitimat cu CI seria {{driver_ci_series}} nr. {{driver_ci_number}}, în calitate de Locatar...`
                }
                style={{
                  width: '100%', minHeight: 200, maxHeight: 380,
                  borderRadius: 10, border: '1.5px solid #e2e8f0',
                  padding: '12px', fontSize: 13, lineHeight: 1.7,
                  fontFamily: '"SF Mono","Fira Code","Consolas",monospace',
                  background: isOwn ? '#fafcff' : '#f8fafc',
                  color: isOwn ? '#0f172a' : '#64748b',
                  outline: 'none', resize: 'vertical',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { if (isOwn) e.target.style.borderColor = '#93c5fd'; }}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Detected fields chips */}
            {derivedFields.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94a3b8', marginBottom: 8 }}>
                  Câmpuri detectate — {derivedFields.length}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {derivedFields.map(key => {
                    const r  = (window.FIELD_REGISTRY || {})[key];
                    const st = r ? (SOURCE_STYLE[r.source] || SOURCE_STYLE.manual) : { bg: '#f1f5f9', color: '#64748b', label: '?' };
                    return (
                      <span key={key} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: 7, padding: '4px 8px', fontSize: 11,
                      }}>
                        <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{`{{${key}}}`}</span>
                        <span style={{ background: st.bg, color: st.color, borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700 }}>{st.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Global read-only notice */}
            {isGlobal && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#0369a1', lineHeight: 1.5, marginBottom: 14 }}>
                📋 Acesta este un template standard RapidAct și nu poate fi modificat. Poți crea un template propriu din secțiunea <strong>Ale mele</strong>.
              </div>
            )}

            {/* Delete */}
            {!isNew && isOwn && (
              <button onClick={handleDelete} disabled={deleting} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                border: '1.5px solid #fecaca', background: '#fff',
                color: deleting ? '#94a3b8' : '#dc2626',
                fontWeight: 600, fontSize: 14, cursor: deleting ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'background 0.15s',
              }}
                onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                {deleting ? 'Se șterge...' : '🗑  Șterge template-ul'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Field picker (rendered above editor) */}
      {showPicker && (
        <FieldPickerSheet onSelect={insertField} onClose={() => setShowPicker(false)} />
      )}
    </>
  );
}

// ─── TemplateDashboardScreen ──────────────────────────────────────────────────
function TemplateDashboardScreen({ navigate, profile }) {
  const [templates,  setTemplates]  = React.useState([]);
  const [loading,    setLoading]    = React.useState(true);
  const [loadError,  setLoadError]  = React.useState('');
  const [editTarget, setEditTarget] = React.useState(null); // null | 'new' | templateObj
  const [userId,     setUserId]     = React.useState(null);

  React.useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setLoadError('');
    try {
      const { data: { user } } = await window.sb.auth.getUser();
      const uid = user?.id || null;
      setUserId(uid);

      let query = window.sb
        .from('contract_templates')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (uid) {
        query = query.or(`user_id.is.null,user_id.eq.${uid}`);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTemplates((data || []).map(parseTemplateRow));
    } catch (err) {
      console.error('[RapidAct] loadTemplates:', err);
      setLoadError('Nu am putut încărca template-urile. Verifică conexiunea.');
    } finally {
      setLoading(false);
    }
  }

  function handleSave(savedRow) {
    const parsed = parseTemplateRow(savedRow);
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.id === parsed.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = parsed;
        return next;
      }
      return [...prev, parsed];
    });
    // Sync into global TEMPLATES_MAP so the contract flow can use the new template
    if (window.TEMPLATES_MAP) {
      window.TEMPLATES_MAP[parsed.id]   = parsed;
      window.TEMPLATES_MAP[parsed.name] = parsed;
    }
    setEditTarget(null);
  }

  function handleDelete(id) {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (window.TEMPLATES_MAP) {
      const t = window.TEMPLATES_MAP[id];
      if (t) delete window.TEMPLATES_MAP[t.name];
      delete window.TEMPLATES_MAP[id];
    }
    setEditTarget(null);
  }

  const globalTemplates = templates.filter(t => t.isGlobal);
  const userTemplates   = templates.filter(t => !t.isGlobal);

  return (
    <AppFrame>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '14px 18px' }}>
        <button onClick={() => navigate('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 4px 4px 0', color: '#64748b' }}>
          <ChevLeftIcon size={22} />
        </button>
        <p style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>Template-uri</p>
        <button onClick={loadAll} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: loading ? 0.4 : 1 }} title="Reîncarcă">
          🔄
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 100px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <SpinnerIcon size={30} color="#2563eb" />
          </div>
        ) : loadError ? (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>😞</p>
            <p style={{ fontSize: 14, color: '#dc2626', marginBottom: 12 }}>{loadError}</p>
            <button onClick={loadAll} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Reîncearcă
            </button>
          </div>
        ) : (
          <>
            {/* ── Standard (global) templates ── */}
            <section>
              <SectionLabel>Standard</SectionLabel>

              {globalTemplates.length === 0 ? (
                <p style={{ fontSize: 13, color: '#94a3b8', padding: '4px 0 8px' }}>Niciun template standard disponibil.</p>
              ) : (
                globalTemplates.map(t => (
                  <TemplateCard key={t.id} template={t} onEdit={() => setEditTarget(t)} />
                ))
              )}
            </section>

            {/* ── User templates ── */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <SectionLabel>Ale mele</SectionLabel>
                <button onClick={() => setEditTarget('new')} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: '#2563eb', fontWeight: 700,
                  border: '1px solid #bfdbfe', borderRadius: 8,
                  padding: '5px 11px', background: '#eff6ff', cursor: 'pointer',
                }}>
                  <PlusIcon size={12} /> Nou
                </button>
              </div>

              {userTemplates.length === 0 ? (
                <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: 12, padding: '32px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>📋</p>
                  <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 6 }}>Niciun template personalizat.</p>
                  <button onClick={() => setEditTarget('new')} style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                    Creează primul template →
                  </button>
                </div>
              ) : (
                userTemplates.map(t => (
                  <TemplateCard key={t.id} template={t} onEdit={() => setEditTarget(t)} />
                ))
              )}
            </section>

            {/* Tip section */}
            <section>
              <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #dbeafe', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Cum funcționează template-urile</p>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                  Adaugă câmpuri dinamice cu <span style={{ fontFamily: 'monospace', background: '#fff', borderRadius: 4, padding: '1px 5px', fontSize: 11, border: '1px solid #e2e8f0' }}>{'{{câmp}}'}</span> în corpul contractului. Câmpurile se completează automat din CI scanat, profilul firmei sau la completare manuală.
                </p>
              </div>
            </section>
          </>
        )}
      </div>

      {/* FAB */}
      {!loading && (
        <button onClick={() => setEditTarget('new')} style={{
          position: 'absolute', bottom: 74, right: 16,
          width: 52, height: 52, borderRadius: '50%',
          background: '#2563eb', color: '#fff',
          border: 'none', boxShadow: '0 4px 16px rgba(37,99,235,0.45)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 20, transition: 'transform 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <PlusIcon size={22} />
        </button>
      )}

      <BottomNav active="settings" navigate={navigate} />

      {/* Editor modal */}
      {editTarget !== null && (
        <TemplateEditor
          template={editTarget === 'new' ? null : editTarget}
          userId={userId}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditTarget(null)}
        />
      )}
    </AppFrame>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
Object.assign(window, { TemplateDashboardScreen });
