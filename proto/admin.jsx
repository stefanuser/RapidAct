// proto/admin.jsx — RapidAct Admin Dashboard v2

// ─── Icons ────────────────────────────────────────────────────────────────────
const Svg = ({ size=18, color='currentColor', children, className='', strokeWidth=2, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ flexShrink:0, display:'block' }} {...p}>{children}</svg>
);
const HomeIcon      = p => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>;
const UsersIcon     = p => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const FileTextIcon  = p => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>;
const LogOutIcon    = p => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const PlusIcon      = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const SearchIcon    = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const EditIcon      = p => <Svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
const TrashIcon     = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const XIcon         = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const SpinnerIcon   = p => <Svg {...p} className={`animate-spin ${p.className||''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Svg>;
const ChevRightIcon = p => <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>;
const ChevLeftIcon  = p => <Svg {...p}><polyline points="15 18 9 12 15 6"/></Svg>;
const ShieldOffIcon = p => <Svg {...p}><path d="M12 22s-8-4-8-10V5l8-3 8 3v4"/><line x1="1" y1="1" x2="23" y2="23"/></Svg>;
const RefreshIcon   = p => <Svg {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Svg>;
const CheckIcon     = p => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>;
const MaximizeIcon  = p => <Svg {...p}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></Svg>;
const MinimizeIcon  = p => <Svg {...p}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></Svg>;
const PanelIcon     = p => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></Svg>;

// ─── Registry (sursă unică — proto/field-registry.jsx) ───────────────────────
const {
  FIELD_REGISTRY: FIELD_REG,
  CAT_ORDER, CAT_ICONS, CONTRACT_GROUPS, SOURCE_STYLE,
  extractFields,
} = window;

// ─── Markup renderer (local, admin standalone — shared.jsx nu e inclus în admin.html) ──
function renderMarkupHtml(text, values) {
  if (!text) return '';
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function inlineParse(s, vals) {
    let r = esc(s);
    r = r.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    r = r.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    r = r.replace(/__(.+?)__/g, '<u>$1</u>');
    r = r.replace(/\[size=(\d+)\](.+?)\[\/size\]/g, (_, n, t) =>
      `<span style="font-size:${n}pt;line-height:1.4">${t}</span>`);
    if (vals) {
      r = r.replace(/\{\{(\w+)\}\}/g, (_, k) => esc(vals[k] || '___________'));
    } else {
      r = r.replace(/\{\{(\w+)\}\}/g,
        '<span style="background:#eff6ff;color:#2563eb;padding:1px 4px;border-radius:3px;' +
        'font-size:0.82em;font-family:monospace;white-space:nowrap;font-weight:600">{{$1}}</span>');
    }
    return r;
  }
  const lines = text.split('\n'); let html = '';
  for (const rawLine of lines) {
    let line = rawLine, alignStyle = '', sizeStyle = '', m;
    if ((m = line.match(/^\[center\]([\s\S]*)\[\/center\]$/))) { alignStyle = 'text-align:center;'; line = m[1]; }
    else if ((m = line.match(/^\[right\]([\s\S]*)\[\/right\]$/))) { alignStyle = 'text-align:right;'; line = m[1]; }
    else if ((m = line.match(/^\[left\]([\s\S]*)\[\/left\]$/))) { line = m[1]; }
    if ((m = line.match(/^\[size=(\d+)\]([\s\S]*)\[\/size\]$/))) { sizeStyle = `font-size:${m[1]}pt;line-height:1.4;`; line = m[2]; }
    html += `<p style="${alignStyle + sizeStyle}margin:0;min-height:1.55em;">${inlineParse(line, values)}</p>\n`;
  }
  return html;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
    + '-' + Date.now().toString(36);
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ro-RO',{day:'2-digit',month:'short',year:'numeric'});
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ro-RO',{day:'2-digit',month:'short'}) + ' ' +
         d.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'});
}
// Wrap selected text in textarea with before/after markers
function wrapSelection(taRef, before, after, body, setBody, cursorRef) {
  const ta = taRef.current;
  if (!ta) return;
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  const sel   = body.slice(start, end);
  const replacement = before + (sel || 'text') + after;
  const newBody = body.slice(0,start) + replacement + body.slice(end);
  setBody(newBody);
  const newCursor = start + replacement.length;
  cursorRef.current = newCursor;
  setTimeout(() => {
    ta.focus();
    const selStart = start + before.length;
    const selEnd   = sel ? start + before.length + sel.length : start + replacement.length - after.length;
    ta.setSelectionRange(selStart, selEnd);
  }, 20);
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Badge({ bg, color, children, small }) {
  return (
    <span style={{ background:bg, color, borderRadius:5, padding: small ? '1px 5px' : '2px 7px', fontSize: small ? 10 : 11, fontWeight:700, whiteSpace:'nowrap', flexShrink:0 }}>
      {children}
    </span>
  );
}
function PlanBadge({ plan }) {
  const c = { free:['#f1f5f9','#475569'], starter:['#dbeafe','#1e40af'], pro:['#f3e8ff','#6b21a8'], business:['#0f172a','#fff'] };
  const [bg,color] = c[plan]||c.free;
  return <Badge bg={bg} color={color}>{plan}</Badge>;
}
function Spinner({ size=20, color='#2563eb' }) {
  return <SpinnerIcon size={size} color={color} />;
}
function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px', color:'#94a3b8', textAlign:'center', flex:1 }}>
      <div style={{ fontSize:44, marginBottom:14, opacity:0.4 }}>{icon}</div>
      <p style={{ fontWeight:700, color:'#64748b', fontSize:15, marginBottom:4 }}>{title}</p>
      {sub && <p style={{ fontSize:13, marginBottom:18, maxWidth:260 }}>{sub}</p>}
      {action && (
        <button onClick={onAction} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'9px 22px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─── AdminLogin ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data, error:err } = await window.sb.auth.signInWithPassword({ email:email.trim(), password });
      if (err) throw err;
      onLogin(data.user);
    } catch(err) { setError(err.message||'Autentificare eșuată.'); }
    finally { setLoading(false); }
  }

  const iStyle = { width:'100%', height:44, border:'1.5px solid #e2e8f0', borderRadius:8, padding:'0 12px', fontSize:14, outline:'none', transition:'border-color 0.15s' };
  return (
    <div style={{ minHeight:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc' }}>
      <div style={{ width:400, background:'#fff', borderRadius:16, boxShadow:'0 4px 32px rgba(0,0,0,0.10)', padding:'40px 36px' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
          <h1 style={{ fontSize:22, fontWeight:800 }}>RapidAct Admin</h1>
          <p style={{ fontSize:13, color:'#94a3b8', marginTop:4 }}>Panou de administrare intern</p>
        </div>
        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#dc2626' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:6 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus placeholder="stefan@rapidact.ro"
              style={iStyle} onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'} />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:6 }}>Parolă</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
              style={iStyle} onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'} />
          </div>
          <button type="submit" disabled={loading} style={{ width:'100%', height:44, background:loading?'#93c5fd':'#2563eb', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {loading ? <><Spinner size={18} color="#fff" /> Autentificare...</> : 'Intră în Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────
function AdminSidebar({ section, setSection, adminEmail, onLogout, collapsed, onToggle }) {
  const NAV = [
    { id:'overview',  label:'Overview',      Icon:HomeIcon     },
    { id:'users',     label:'Utilizatori',   Icon:UsersIcon    },
    { id:'templates', label:'Template-uri',  Icon:FileTextIcon },
  ];
  const [ver, setVer] = React.useState(null);
  React.useEffect(() => {
    fetch('./version.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => setVer(d))
      .catch(() => {});
  }, []);
  return (
    <aside style={{ width:collapsed?52:218, flexShrink:0, background:'#0f172a', display:'flex', flexDirection:'column', height:'100vh', position:'sticky', top:0, transition:'width 0.22s ease', overflow:'hidden' }}>
      {/* Logo */}
      <div style={{ padding: collapsed?'20px 0':'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight:64 }}>
        {!collapsed && (
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <span style={{ fontSize:22 }}>⚡</span>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:'#fff', lineHeight:1.1 }}>RapidAct</p>
              <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:0.8 }}>Admin</p>
            </div>
          </div>
        )}
        {collapsed && <span style={{ fontSize:22 }}>⚡</span>}
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'10px 6px' }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = section === id;
          return (
            <button key={id} onClick={() => setSection(id)} title={collapsed ? label : ''} style={{
              display:'flex', alignItems:'center', gap: collapsed?0:10, justifyContent: collapsed?'center':'flex-start',
              width:'100%', padding: collapsed?'10px 0':'9px 12px', borderRadius:8, border:'none', marginBottom:2,
              background: active ? 'rgba(37,99,235,0.28)' : 'transparent',
              color: active ? '#60a5fa' : '#94a3b8',
              fontWeight: active ? 700 : 500, fontSize:13,
              cursor:'pointer', transition:'all 0.12s', whiteSpace:'nowrap', overflow:'hidden',
            }}
              onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}
            >
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
              {active && collapsed && <div style={{ position:'absolute', left:0, width:3, height:32, background:'#2563eb', borderRadius:'0 4px 4px 0' }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: collapsed?'12px 6px':'12px 10px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        {!collapsed && <p style={{ fontSize:11, color:'#475569', marginBottom:6, padding:'0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{adminEmail}</p>}
        <button onClick={onToggle} title={collapsed?'Extinde bara':'Colapseaza bara'} style={{ display:'flex', alignItems:'center', justifyContent: collapsed?'center':'flex-start', gap:8, width:'100%', padding: collapsed?'8px 0':'8px 10px', borderRadius:7, border:'none', background:'transparent', color:'#64748b', fontSize:12, cursor:'pointer', marginBottom:4, transition:'all 0.12s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          {collapsed ? <ChevRightIcon size={16}/> : <><ChevLeftIcon size={16}/><span>Colapseaza</span></>}
        </button>
        <button onClick={onLogout} title="Deconectare" style={{ display:'flex', alignItems:'center', justifyContent: collapsed?'center':'flex-start', gap:8, width:'100%', padding: collapsed?'8px 0':'8px 10px', borderRadius:7, border:'none', background:'transparent', color:'#64748b', fontSize:12, cursor:'pointer', transition:'all 0.12s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <LogOutIcon size={15}/> {!collapsed && 'Deconectare'}
        </button>

        {/* Version chip */}
        {ver && !collapsed && (
          <div style={{ marginTop:10, padding:'5px 8px', borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize:10, color:'#334155', fontFamily:'monospace', lineHeight:1.6 }}>
              v{ver.version} · <span style={{ color:'#2563eb' }}>{ver.commit}</span>
            </p>
            <p style={{ fontSize:10, color:'#334155', fontFamily:'monospace' }}>{ver.date}</p>
          </div>
        )}
        {ver && collapsed && (
          <div title={`v${ver.version} · ${ver.commit} · ${ver.date}`} style={{ marginTop:8, textAlign:'center', cursor:'default' }}>
            <span style={{ fontSize:9, color:'#334155', fontFamily:'monospace' }}>{ver.commit}</span>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── OverviewSection ──────────────────────────────────────────────────────────
function OverviewSection({ users, contracts, templates }) {
  const todayStr = new Date().toISOString().slice(0,10);
  const stats = [
    { label:'Utilizatori',        value:users.length,                                           icon:'👥', bg:'#dbeafe', color:'#1e40af' },
    { label:'Contracte totale',   value:contracts.length,                                       icon:'📄', bg:'#dcfce7', color:'#166534' },
    { label:'Template-uri active',value:templates.filter(t=>t.active).length,                   icon:'📋', bg:'#f3e8ff', color:'#6b21a8' },
    { label:'Contracte azi',      value:contracts.filter(c=>(c.created_at||'').startsWith(todayStr)).length, icon:'⚡', bg:'#fef9c3', color:'#92400e' },
  ];
  const recent = [...contracts].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,12);

  return (
    <div className="fade-in" style={{ padding:'32px 36px', maxWidth:1100 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:800 }}>Overview</h2>
        <p style={{ fontSize:13, color:'#64748b', marginTop:2 }}>Situație generală a platformei</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.6 }}>{s.label}</p>
              <div style={{ width:32, height:32, borderRadius:8, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{s.icon}</div>
            </div>
            <p style={{ fontSize:30, fontWeight:800, color:s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid #e2e8f0' }}>
          <p style={{ fontWeight:700, fontSize:15 }}>Contracte recente</p>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon="📄" title="Niciun contract" sub="Contractele vor apărea aici." />
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Data','Utilizator','Template','Client','Status'].map(h => (
                  <th key={h} style={{ padding:'10px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.6, borderBottom:'1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((c,i) => {
                const user = users.find(u=>u.id===c.user_id);
                const party = (c.parties||[])[0]?.name||'—';
                return (
                  <tr key={c.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2===0?'#fff':'#fafbfc' }}>
                    <td style={{ padding:'11px 18px', fontSize:13, color:'#64748b', whiteSpace:'nowrap' }}>{fmtDateTime(c.created_at)}</td>
                    <td style={{ padding:'11px 18px', fontSize:13, fontWeight:500 }}>{user?.firm_name||user?.email||'—'}</td>
                    <td style={{ padding:'11px 18px', fontSize:13, color:'#64748b' }}>{c.template_name||c.template_id||'—'}</td>
                    <td style={{ padding:'11px 18px', fontSize:13 }}>{party}</td>
                    <td style={{ padding:'11px 18px' }}>
                      <Badge bg={c.status==='generated'?'#dbeafe':'#f1f5f9'} color={c.status==='generated'?'#1e40af':'#64748b'}>{c.status||'draft'}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── UserDetailPanel ──────────────────────────────────────────────────────────
function UserDetailPanel({ user, contracts, templates, onNewTemplate, onEditTemplate, onClose }) {
  const uContracts = contracts.filter(c=>c.user_id===user.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const uTemplates = templates.filter(t=>t.user_id===user.id);

  return (
    <div className="fade-in" style={{ width:380, flexShrink:0, background:'#fff', borderLeft:'1px solid #e2e8f0', height:'100%', overflowY:'auto', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'18px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'sticky', top:0, background:'#fff', zIndex:5 }}>
        <div>
          <p style={{ fontWeight:700, fontSize:16, marginBottom:2 }}>{user.firm_name||'—'}</p>
          <p style={{ fontSize:13, color:'#64748b' }}>{user.email}</p>
        </div>
        <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'7px 8px', display:'flex', alignItems:'center', color:'#64748b', cursor:'pointer' }}>
          <XIcon size={15}/>
        </button>
      </div>

      <div style={{ padding:'18px 20px', flex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22, background:'#f8fafc', borderRadius:10, padding:14 }}>
          {[['Plan',<PlanBadge plan={user.plan||'free'}/>],['Contracte',`${user.contracts_used||0} / ${user.contracts_limit||5}`],['CUI',user.firm_cui||'—'],['Repr.',user.legal_rep||'—']].map(([k,v])=>(
            <div key={k}>
              <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.6, marginBottom:2 }}>{k}</p>
              <p style={{ fontSize:13, fontWeight:500 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:22 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <p style={{ fontWeight:700, fontSize:13 }}>Template-uri <span style={{ color:'#94a3b8', fontWeight:400 }}>({uTemplates.length})</span></p>
            <button onClick={()=>onNewTemplate(user)} style={{ display:'flex', alignItems:'center', gap:4, background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:7, padding:'5px 10px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              <PlusIcon size={11}/> Adaugă
            </button>
          </div>
          {uTemplates.length === 0 ? (
            <div style={{ border:'1.5px dashed #e2e8f0', borderRadius:8, padding:16, textAlign:'center' }}>
              <p style={{ fontSize:13, color:'#94a3b8' }}>Niciun template personalizat</p>
              <button onClick={()=>onNewTemplate(user)} style={{ marginTop:4, fontSize:12, color:'#2563eb', border:'none', background:'none', fontWeight:600, cursor:'pointer' }}>Creează primul →</button>
            </div>
          ) : uTemplates.map(t=>(
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', border:'1px solid #e2e8f0', borderRadius:8, marginBottom:5 }}>
              <span style={{ fontSize:18 }}>{t.icon||'📋'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</p>
                <p style={{ fontSize:11, color:'#94a3b8' }}>{(t.fields||[]).length} câmpuri</p>
              </div>
              <button onClick={()=>onEditTemplate(t)} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#64748b', display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>
                <EditIcon size={11}/> Edit
              </button>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Contracte recente <span style={{ color:'#94a3b8', fontWeight:400 }}>({uContracts.length})</span></p>
          {uContracts.length === 0 ? <p style={{ fontSize:13, color:'#94a3b8' }}>Niciun contract generat.</p>
          : uContracts.slice(0,6).map(c=>(
            <div key={c.id} style={{ padding:'9px 12px', border:'1px solid #e2e8f0', borderRadius:8, marginBottom:5, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:500 }}>{(c.parties||[])[0]?.name||'—'}</p>
                <p style={{ fontSize:11, color:'#94a3b8' }}>{c.template_name||c.template_id} · {fmtDate(c.created_at)}</p>
              </div>
              <Badge bg="#dbeafe" color="#1e40af">{c.status||'draft'}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── UsersSection ─────────────────────────────────────────────────────────────
function UsersSection({ users, contracts, templates, onNewTemplate, onEditTemplate }) {
  const [search, setSearch]     = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.firm_name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q);
  });

  return (
    <div className="fade-in" style={{ padding:'32px 36px', flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:800 }}>Utilizatori</h2>
        <p style={{ fontSize:13, color:'#64748b', marginTop:2 }}>{users.length} conturi înregistrate</p>
      </div>

      <div style={{ flex:1, display:'flex', minHeight:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative', flex:1, maxWidth:320 }}>
              <SearchIcon size={14} color="#94a3b8" style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)' }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Caută firmă sau email..."
                style={{ width:'100%', height:34, border:'1.5px solid #e2e8f0', borderRadius:8, padding:'0 10px 0 30px', fontSize:13, outline:'none' }}
                onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'} />
            </div>
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead style={{ position:'sticky', top:0, zIndex:2 }}>
                <tr style={{ background:'#f8fafc' }}>
                  {['Firmă','Email','Plan','Contracte','Template-uri','Înregistrat',''].map(h=>(
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.6, borderBottom:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Niciun utilizator găsit.</td></tr>}
                {filtered.map(u => {
                  const uC = contracts.filter(c=>c.user_id===u.id).length;
                  const uT = templates.filter(t=>t.user_id===u.id).length;
                  const isSel = selected?.id===u.id;
                  return (
                    <tr key={u.id} onClick={()=>setSelected(isSel?null:u)} style={{ borderTop:'1px solid #f1f5f9', cursor:'pointer', background: isSel?'#eff6ff':'#fff', transition:'background 0.1s' }}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background='#f8fafc'; }}
                      onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background='#fff'; }}
                    >
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:30, height:30, borderRadius:8, background: u.is_admin?'#0f172a':'linear-gradient(135deg,#2563eb,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 }}>
                            {(u.firm_name||u.email||'?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize:13, fontWeight:600 }}>{u.firm_name||'—'}</p>
                            {u.is_admin && <span style={{ fontSize:9, background:'#0f172a', color:'#fff', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'13px 16px', fontSize:13, color:'#64748b' }}>{u.email}</td>
                      <td style={{ padding:'13px 16px' }}><PlanBadge plan={u.plan||'free'}/></td>
                      <td style={{ padding:'13px 16px', fontSize:13, fontWeight:600, textAlign:'center' }}>{uC}</td>
                      <td style={{ padding:'13px 16px', fontSize:13, textAlign:'center' }}>{uT>0?<span style={{ fontWeight:700, color:'#2563eb' }}>{uT}</span>:<span style={{ color:'#cbd5e1' }}>0</span>}</td>
                      <td style={{ padding:'13px 16px', fontSize:12, color:'#94a3b8', whiteSpace:'nowrap' }}>{fmtDate(u.created_at)}</td>
                      <td style={{ padding:'13px 16px' }}><ChevRightIcon size={15} color={isSel?'#2563eb':'#cbd5e1'}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {selected && (
          <UserDetailPanel user={selected} contracts={contracts} templates={templates}
            onNewTemplate={onNewTemplate} onEditTemplate={onEditTemplate}
            onClose={()=>setSelected(null)} />
        )}
      </div>
    </div>
  );
}

// ─── FieldPickerPanel ─────────────────────────────────────────────────────────
function FieldPickerPanel({ onInsert }) {
  const [activeCat,   setActiveCat]   = React.useState('CI Client');
  const [activeGroup, setActiveGroup] = React.useState('Generic');
  const [search,      setSearch]      = React.useState('');

  const fields = Object.entries(FIELD_REG).filter(([key,v]) => {
    if (v.cat !== activeCat) return false;
    if (activeCat === 'Contract' && v.group !== activeGroup) return false;
    if (search) {
      const q = search.toLowerCase();
      return v.label.toLowerCase().includes(q) || key.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ width:272, flexShrink:0, borderLeft:'1px solid #e2e8f0', background:'#fafbff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'12px 12px 8px', borderBottom:'1px solid #e2e8f0', background:'#fff' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.6, marginBottom:8 }}>Inserează câmp</p>
        {/* Category dropdown */}
        <select value={activeCat} onChange={e=>{setActiveCat(e.target.value); setSearch('');}}
          style={{ width:'100%', height:36, border:'1.5px solid #e2e8f0', borderRadius:8, padding:'0 8px', fontSize:13, background:'#fff', cursor:'pointer', outline:'none', marginBottom:6 }}>
          {CAT_ORDER.map(cat => (
            <option key={cat} value={cat}>{CAT_ICONS[cat]} {cat}</option>
          ))}
        </select>
        {/* Search within category */}
        <div style={{ position:'relative' }}>
          <SearchIcon size={12} color="#94a3b8" style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Caută câmp..."
            style={{ width:'100%', height:30, border:'1px solid #e2e8f0', borderRadius:7, padding:'0 8px 0 24px', fontSize:12, outline:'none', background:'#f8fafc' }}
            onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
        </div>
      </div>

      {/* Contract sub-groups */}
      {activeCat === 'Contract' && (
        <div style={{ display:'flex', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
          {CONTRACT_GROUPS.map(g => (
            <button key={g} onClick={()=>setActiveGroup(g)} style={{ flex:1, padding:'7px 2px', border:'none', background:'transparent', fontSize:11, fontWeight:700, cursor:'pointer', color: activeGroup===g?'#2563eb':'#94a3b8', borderBottom:`2px solid ${activeGroup===g?'#2563eb':'transparent'}`, transition:'all 0.12s' }}>
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Fields */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 8px 20px' }}>
        {fields.length === 0 && (
          <p style={{ fontSize:12, color:'#94a3b8', padding:16, textAlign:'center' }}>Niciun câmp{search?' găsit':' în această categorie'}.</p>
        )}
        {fields.map(([key, r]) => {
          const src = r.type === 'image' ? 'image' : r.source;
          const st  = SOURCE_STYLE[src] || SOURCE_STYLE.manual;
          return (
            <button key={key} onClick={()=>onInsert(key)} style={{ display:'flex', flexDirection:'column', width:'100%', padding:'8px 10px', borderRadius:7, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', textAlign:'left', marginBottom:5, transition:'all 0.1s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#93c5fd'; e.currentTarget.style.background='#f0f9ff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#fff';}}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#0f172a' }}>{r.label}</span>
                <Badge bg={st.bg} color={st.color} small>{st.label}</Badge>
              </div>
              <span style={{ fontSize:11, fontFamily:'monospace', color:'#2563eb', opacity:0.85 }}>{`{{${key}}}`}</span>
              {r.desc && <span style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>{r.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── FormatToolbar ────────────────────────────────────────────────────────────
function FormatToolbar({ onFormat, onInsertRaw, showPicker, onTogglePicker, isFullscreen, onToggleFullscreen, previewMode, onTogglePreview }) {
  const divider = <div style={{ width:1, height:20, background:'#e2e8f0', margin:'0 4px', flexShrink:0 }} />;

  const fmtBtn = (label, title, before, after, extraStyle={}) => (
    <button onClick={()=>onFormat(before, after)} title={title} disabled={previewMode}
      style={{ width:28, height:28, border:'1px solid #e2e8f0', borderRadius:6, background:'#fff', cursor: previewMode?'default':'pointer', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.1s', opacity: previewMode ? 0.4 : 1, ...extraStyle }}
      onMouseEnter={e=>{ if(!previewMode) e.currentTarget.style.background='#f1f5f9'; }}
      onMouseLeave={e=>e.currentTarget.style.background='#fff'}
    >{label}</button>
  );

  const insertBtn = (label, title, raw, extraStyle={}) => (
    <button onClick={()=>onInsertRaw(raw)} title={title} disabled={previewMode}
      style={{ height:26, padding:'0 7px', border:'1px solid #e2e8f0', borderRadius:6, background:'#fff', cursor: previewMode?'default':'pointer', fontSize:11, fontWeight:600, color:'#475569', transition:'background 0.1s', flexShrink:0, opacity: previewMode ? 0.4 : 1, ...extraStyle }}
      onMouseEnter={e=>{ if(!previewMode) e.currentTarget.style.background='#f1f5f9'; }}
      onMouseLeave={e=>e.currentTarget.style.background='#fff'}
    >{label}</button>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', gap:3, padding:'6px 14px', background:'#fff', borderBottom:'1px solid #e2e8f0', flexShrink:0, overflowX:'auto' }}>
      {/* Preview mode toggle */}
      <button onClick={onTogglePreview} title={previewMode ? 'Înapoi la editare' : 'Previzualizare document'} style={{
        display:'flex', alignItems:'center', gap:5, height:28, padding:'0 10px',
        background: previewMode ? '#0f172a' : '#f8fafc',
        color: previewMode ? '#fff' : '#475569',
        border: `1px solid ${previewMode ? '#0f172a' : '#e2e8f0'}`,
        borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, transition:'all 0.15s',
      }}>
        {previewMode
          ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editare</>
          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Preview</>
        }
      </button>
      {divider}
      {/* Text style */}
      {fmtBtn('B','Bold','**','**',{ fontWeight:800 })}
      {fmtBtn('I','Italic','*','*',{ fontStyle:'italic' })}
      {fmtBtn(<span style={{ textDecoration:'underline' }}>U</span>,'Underline','__','__')}
      {divider}
      {/* Size */}
      {[['Mic','[size=9]','[/size]'],['Normal','',''],['Mare','[size=13]','[/size]'],['Titlu','[size=18]','[/size]']].map(([lbl,before,after])=>(
        <button key={lbl} onClick={()=>{ if(before && !previewMode) onFormat(before,after); }} title={`Dimensiune: ${lbl}`}
          disabled={previewMode}
          style={{ height:26, padding:'0 7px', border:'1px solid #e2e8f0', borderRadius:6, background:'#fff', cursor: previewMode?'default':'pointer', fontSize:11, fontWeight:600, color:'#475569', transition:'background 0.1s', flexShrink:0, opacity: previewMode ? 0.4 : 1 }}
          onMouseEnter={e=>{ if(!previewMode) e.currentTarget.style.background='#f1f5f9'; }}
          onMouseLeave={e=>e.currentTarget.style.background='#fff'}
        >{lbl}</button>
      ))}
      {divider}
      {/* Alignment */}
      {[['Stânga','[left]','[/left]'],['Centru','[center]','[/center]'],['Dreapta','[right]','[/right]']].map(([title,before,after],i)=>(
        <button key={i} onClick={()=>{ if(!previewMode) onFormat(before,after); }} title={title} disabled={previewMode}
          style={{ width:28, height:28, border:'1px solid #e2e8f0', borderRadius:6, background:'#fff', cursor: previewMode?'default':'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.1s', opacity: previewMode ? 0.4 : 1 }}
          onMouseEnter={e=>{ if(!previewMode) e.currentTarget.style.background='#f1f5f9'; }}
          onMouseLeave={e=>e.currentTarget.style.background='#fff'}
        >
          {i===0&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>}
          {i===1&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>}
          {i===2&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>}
        </button>
      ))}
      {divider}
      {/* Elemente speciale */}
      {insertBtn('── Linie','Inserează linie separator','\n─────────────────────────────────────────────────────────\n')}
      {divider}
      {/* Spacer */}
      <div style={{ flex:1 }} />
      {/* Picker toggle */}
      <button onClick={onTogglePicker} style={{ display:'flex', alignItems:'center', gap:5, height:28, padding:'0 10px', background: showPicker?'#1e40af':'#eff6ff', color: showPicker?'#fff':'#2563eb', border:`1px solid ${showPicker?'#1e40af':'#bfdbfe'}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, transition:'all 0.15s' }}>
        <PanelIcon size={13}/> {showPicker?'✕ Câmpuri':'+ Câmpuri'}
      </button>
      {/* Fullscreen */}
      <button onClick={onToggleFullscreen} title={isFullscreen?'Ieși din fullscreen':'Fullscreen'} style={{ width:28, height:28, border:'1px solid #e2e8f0', borderRadius:7, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.1s', flexShrink:0 }}
        onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
        onMouseLeave={e=>e.currentTarget.style.background='#fff'}
      >
        {isFullscreen ? <MinimizeIcon size={14}/> : <MaximizeIcon size={14}/>}
      </button>
    </div>
  );
}

// ─── AdminTemplateEditor ──────────────────────────────────────────────────────
function AdminTemplateEditor({ template, users, presetUserId, onSave, onDelete, onClose, isFullscreen, onToggleFullscreen }) {
  const isNew    = !template;
  const isGlobal = !isNew && !template.user_id;

  const [name,        setName]        = React.useState(template?.name        || '');
  const [icon,        setIcon]        = React.useState(template?.icon        || '📋');
  const [description, setDescription] = React.useState(template?.description || '');
  const [category,    setCategory]    = React.useState(template?.category    || window.DEFAULT_TEMPLATE_CATEGORY || 'General');
  const [active,      setActive]      = React.useState(template?.active !== false);
  const [body,        setBody]        = React.useState(template?.bodyText || template?.body_template || '');
  const [assignedTo,  setAssignedTo]  = React.useState(template?.user_id || presetUserId || '__global__');
  const [showPicker,   setShowPicker]   = React.useState(true);
  const [previewMode,  setPreviewMode]  = React.useState(false);
  const [saving,       setSaving]       = React.useState(false);
  const [deleting,     setDeleting]     = React.useState(false);
  const [error,        setError]        = React.useState('');
  const [saved,        setSaved]        = React.useState(false);
  const [showMeta,     setShowMeta]     = React.useState(false);

  const taRef    = React.useRef(null);
  const cursorRef= React.useRef(0);
  const derivedFields = extractFields(body);

  // Calculare ghiduri de pagini A4 în editor.
  // A4 la 96dpi = 794×1123px. Editor: font 13px × line-height 1.9 = 24.7px/linie.
  // PDF: (841.89-90)/14.725 ≈ 51 linii/pagină → 51×24.7 ≈ 1260px conținut/pagină.
  // Ghid la: 64(padding-top) + n×1260px din topul textareaei.
  const PAGE_CONTENT_PX = 1260;
  const PAGE_PAD_TOP    = 64;
  // Număr de ghiduri: estimăm din numărul de linii din body
  const lineCount = body.split('\n').length;
  const pageGuideCount = Math.max(1, Math.ceil(lineCount / 51) + 1);
  const pageGuides = Array.from({ length: pageGuideCount }, (_, i) => PAGE_PAD_TOP + (i + 1) * PAGE_CONTENT_PX);

  function saveCursor() {
    if (taRef.current) cursorRef.current = taRef.current.selectionStart ?? body.length;
  }

  function handleFormat(before, after) {
    wrapSelection(taRef, before, after, body, setBody, cursorRef);
  }

  function handleInsertRaw(raw) {
    const ta  = taRef.current;
    const pos = ta ? ta.selectionStart : cursorRef.current;
    const newBody = body.slice(0, pos) + raw + body.slice(pos);
    setBody(newBody);
    const newPos = pos + raw.length;
    cursorRef.current = newPos;
    setTimeout(() => { if (ta) { ta.focus(); ta.setSelectionRange(newPos, newPos); } }, 20);
  }

  function insertField(key) {
    const ta      = taRef.current;
    const pos     = ta ? ta.selectionStart : cursorRef.current;
    const snippet = `{{${key}}}`;
    const newBody = body.slice(0,pos) + snippet + body.slice(pos);
    setBody(newBody);
    const newPos  = pos + snippet.length;
    cursorRef.current = newPos;
    setTimeout(() => { if(ta){ ta.focus(); ta.setSelectionRange(newPos,newPos); } }, 20);
  }

  async function handleSave() {
    if (!name.trim()) { setError('Numele template-ului este obligatoriu.'); return; }
    if (!body.trim()) { setError('Corpul contractului este obligatoriu.'); return; }
    setError(''); setSaving(true);
    try {
      const fields   = extractFields(body);
      const scanDocs = [];
      fields.forEach(k => { if(FIELD_REG[k]?.source==='ocr') { const d=k.split('_')[1]; if(d&&!scanDocs.includes(d)) scanDocs.push(d); } });
      const now    = new Date().toISOString();
      const userId = assignedTo === '__global__' ? null : assignedTo;
      const row    = { name:name.trim(), icon:icon||'📋', description:description.trim(), category:category||window.DEFAULT_TEMPLATE_CATEGORY||'General', active, body_template:body, fields, scan_docs:scanDocs, user_id:userId, updated_at:now };

      let savedRow;
      if (isNew) {
        row.id = generateSlug(name); row.created_at = now;
        const { data, error:err } = await window.sb.from('contract_templates').insert(row).select().single();
        if (err) throw err;
        savedRow = data;
      } else {
        const { data, error:err } = await window.sb.from('contract_templates').update(row).eq('id', template.id).select().single();
        if (err) throw err;
        savedRow = data;
      }
      setSaved(true); setTimeout(()=>setSaved(false),2500);
      onSave(savedRow);
    } catch(err) { setError(err.message||'Eroare la salvare.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!window.confirm(`Ștergi template-ul "${name}"?`)) return;
    setDeleting(true);
    try {
      const { error:err } = await window.sb.from('contract_templates').delete().eq('id', template.id);
      if (err) throw err;
      onDelete(template.id);
    } catch(err) { setError(err.message||'Eroare la ștergere.'); setDeleting(false); }
  }

  const editorContainer = (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', background:'#f0f2f5', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {/* Icon */}
        <input value={icon} onChange={e=>setIcon(e.target.value)} maxLength={2} style={{ width:40, height:36, border:'1.5px solid #e2e8f0', borderRadius:7, fontSize:20, textAlign:'center', outline:'none', flexShrink:0 }}/>
        {/* Name */}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nume template..." style={{ flex:1, minWidth:120, height:36, border:'1.5px solid #e2e8f0', borderRadius:7, padding:'0 10px', fontSize:14, fontWeight:600, outline:'none', transition:'border-color 0.15s' }}
          onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
        {/* Assigned to */}
        <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} style={{ height:36, border:'1.5px solid #e2e8f0', borderRadius:7, padding:'0 8px', fontSize:13, cursor:'pointer', outline:'none', maxWidth:200 }}>
          <option value="__global__">🌐 Global</option>
          <optgroup label="Utilizatori">
            {users.filter(u=>!u.is_admin).map(u=>(
              <option key={u.id} value={u.id}>{u.firm_name||u.email}</option>
            ))}
          </optgroup>
        </select>
        {/* Categorie toggle */}
        <button onClick={()=>setShowMeta(m=>!m)} style={{ height:36, padding:'0 10px', border:'1.5px solid #e2e8f0', borderRadius:7, background: showMeta?'#f8fafc':'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
          {showMeta ? '▲ Mai puțin' : '▼ Detalii'}
        </button>
        {/* Active */}
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <span style={{ fontSize:12, color:'#64748b', fontWeight:500 }}>Activ</span>
          <button onClick={()=>setActive(a=>!a)} style={{ width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', background: active?'#2563eb':'#cbd5e1', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
            <div style={{ position:'absolute', top:2, left: active?20:2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
          </button>
        </div>
        {/* Actions */}
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          {!isNew && (
            <button onClick={handleDelete} disabled={deleting} style={{ display:'flex', alignItems:'center', gap:4, height:36, padding:'0 12px', border:'1.5px solid #fecaca', borderRadius:7, background:'#fff', color:'#dc2626', fontWeight:600, fontSize:13, cursor:'pointer' }}>
              {deleting ? <Spinner size={13}/> : <TrashIcon size={13}/>}
            </button>
          )}
          <button onClick={onClose} style={{ height:36, padding:'0 12px', border:'1.5px solid #e2e8f0', borderRadius:7, background:'#fff', color:'#64748b', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            Anulează
          </button>
          <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:5, height:36, padding:'0 18px', border:'none', borderRadius:7, background: saving?'#93c5fd': saved?'#10b981':'#2563eb', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', transition:'background 0.2s' }}>
            {saving ? <><Spinner size={13} color="#fff"/> Salvez...</> : saved ? <><CheckIcon size={13}/> Salvat!</> : 'Salvează'}
          </button>
        </div>
      </div>

      {/* Collapsible meta */}
      {showMeta && (
        <div style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0', padding:'12px 16px', display:'flex', gap:12, flexShrink:0 }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.6, display:'block', marginBottom:4 }}>Descriere</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Scurtă descriere..."
              style={{ width:'100%', height:32, border:'1px solid #e2e8f0', borderRadius:6, padding:'0 8px', fontSize:12, outline:'none', background:'#fff' }}/>
          </div>
          <div style={{ width:180 }}>
            <label style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.6, display:'block', marginBottom:4 }}>Categorie</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{ width:'100%', height:32, border:'1px solid #e2e8f0', borderRadius:6, padding:'0 6px', fontSize:12, cursor:'pointer', outline:'none', background:'#fff' }}>
              {(window.TEMPLATE_CAT_IDS || ['Imobiliare','Rent a car','Resurse Umane','General']).map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background:'#fef2f2', borderBottom:'1px solid #fecaca', padding:'8px 16px', fontSize:13, color:'#dc2626', flexShrink:0 }}>{error}</div>
      )}

      {/* Format toolbar */}
      <FormatToolbar
        onFormat={handleFormat}
        onInsertRaw={handleInsertRaw}
        showPicker={showPicker}
        onTogglePicker={()=>setShowPicker(p=>!p)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        previewMode={previewMode}
        onTogglePreview={()=>setPreviewMode(m=>!m)}
      />

      {/* Document area + picker */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', minHeight:0 }}>
        {/* Document scroll area */}
        <div style={{ flex:1, overflowY:'auto', padding:'28px 24px', background:'#e2e5e9' }}>

          {/* Preview mode banner */}
          {previewMode && (
            <div style={{ maxWidth:794, margin:'0 auto 12px', background:'#1e40af', color:'#fff', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Previzualizare — exact cum va arăta contractul (câmpurile {{}} sunt marcate cu albastru)
            </div>
          )}

          {/* Paper — conține textarea (editare) SAU preview randat */}
          <div style={{ maxWidth:794, margin:'0 auto', background:'#fff', boxShadow:'0 4px 24px rgba(0,0,0,0.18)', borderRadius:2, position:'relative', overflow:'hidden' }}>

            {/* ── Ghiduri pagini A4 (doar în modul editare) ── */}
            {!previewMode && pageGuides.map((yPx, idx) => (
              <div key={idx} style={{
                position:'absolute', left:0, right:0,
                top: yPx,
                height:0, borderTop:'2px dashed #bfdbfe',
                pointerEvents:'none', zIndex:5,
              }}>
                <span style={{
                  position:'absolute', right:8, top:-18,
                  fontSize:10, fontWeight:700, color:'#93c5fd',
                  background:'#fff', padding:'1px 6px', borderRadius:4,
                  letterSpacing:0.4, userSelect:'none',
                }}>Pagina {idx + 2}</span>
              </div>
            ))}

            {previewMode ? (
              /* ── Preview mode: randat HTML ── */
              <div
                style={{
                  width:'100%', minHeight:1123, padding:'64px 72px',
                  fontSize:'9.5pt', lineHeight:1.55,
                  fontFamily:'"Georgia","Times New Roman",serif',
                  color:'#0f172a',
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkupHtml(body, null) || '<p style="color:#94a3b8;font-style:italic">Contractul este gol…</p>' }}
              />
            ) : (
              /* ── Edit mode: textarea ── */
              <textarea
                ref={taRef}
                value={body}
                onChange={e=>setBody(e.target.value)}
                onMouseUp={saveCursor} onKeyUp={saveCursor} onClick={saveCursor}
                placeholder={`Scrie corpul contractului.\n\nFolosește {{câmp}} pentru câmpuri dinamice — apasă "+ Câmpuri" în dreapta.\n\nEx:\n[center]**CONTRACT DE ÎNCHIRIERE AUTO**[/center]\n\nÎncheiat astăzi, {{contract_data}}, în {{contract_loc}},\n\nÎntre:\n{{firma_denumire}}, CUI {{firma_cui}}, reprezentată prin {{firma_reprezentant}}, denumit în continuare LOCATOR,\n\nȘi:\n{{client_ci_nume_complet}}, CNP {{client_ci_cnp}}, CI seria {{client_ci_serie}} nr. {{client_ci_numar}},\ncu domiciliul în {{client_ci_adresa}}, denumit în continuare LOCATAR...`}
                style={{
                  width:'100%', minHeight:1123, border:'none', outline:'none',
                  padding:'64px 72px', fontSize:13, lineHeight:1.9,
                  fontFamily:'"Georgia","Times New Roman",serif',
                  background:'transparent', resize:'none',
                  color:'#0f172a',
                }}
              />
            )}
          </div>

          {/* Detected fields bar (editare și preview) */}
          {derivedFields.length > 0 && (
            <div style={{ maxWidth:794, margin:'16px auto 0', background:'#fff', borderRadius:8, padding:'10px 14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.6, marginBottom:7 }}>
                Câmpuri detectate — {derivedFields.length}
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {derivedFields.map(key => {
                  const r  = FIELD_REG[key];
                  const src = r?.type==='image' ? 'image' : (r?.source||'manual');
                  const st = SOURCE_STYLE[src] || SOURCE_STYLE.manual;
                  return (
                    <span key={key} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 7px', fontSize:11 }}>
                      <span style={{ fontFamily:'monospace', color:'#2563eb', fontWeight:600 }}>{`{{${key}}}`}</span>
                      <Badge bg={st.bg} color={st.color} small>{st.label}</Badge>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ height:40 }}/>
        </div>

        {/* Field picker panel */}
        {showPicker && <FieldPickerPanel onInsert={insertField} />}
      </div>
    </div>
  );

  // Fullscreen wraps in fixed overlay
  if (isFullscreen) {
    return (
      <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', flexDirection:'column', background:'#e8eaed' }}>
        {editorContainer}
      </div>
    );
  }

  return editorContainer;
}

// ─── TemplateListItem ─────────────────────────────────────────────────────────
function TemplateListItem({ template, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', border:'none', textAlign:'left', background: active?'#eff6ff':'transparent', borderLeft:`3px solid ${active?'#2563eb':'transparent'}`, cursor:'pointer', transition:'all 0.1s' }}
      onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='#f8fafc'; }}
      onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}
    >
      <span style={{ fontSize:17, flexShrink:0 }}>{template.icon||'📋'}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:12, fontWeight: active?700:500, color: active?'#1e40af':'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{template.name}</p>
        <p style={{ fontSize:10, color:'#94a3b8' }}>{(template.fields||[]).length} câmpuri{!template.active?' · Inactiv':''}</p>
      </div>
    </button>
  );
}

// ─── TemplatesSection ─────────────────────────────────────────────────────────
function TemplatesSection({ templates, users, nav, onNavConsumed, onSave, onDelete }) {
  const [selected,      setSelected]      = React.useState(null);
  const [presetUserId,  setPresetUserId]  = React.useState(null);
  const [showList,      setShowList]      = React.useState(true);
  const [isFullscreen,  setIsFullscreen]  = React.useState(false);
  const [listSearch,    setListSearch]    = React.useState('');

  // Handle cross-section navigation from UsersSection
  React.useEffect(() => {
    if (!nav) return;
    if (nav.action === 'new')  { setPresetUserId(nav.userId||null); setSelected('new'); }
    if (nav.action === 'edit') { setPresetUserId(null); setSelected(nav.template); }
    onNavConsumed();
  }, [nav]);

  function openNew(userId) { setPresetUserId(userId||null); setSelected('new'); }
  function openEdit(t)      { setPresetUserId(null); setSelected(t); }

  function handleSave(savedRow) {
    onSave(savedRow);
    setSelected({ ...savedRow, bodyText:savedRow.body_template });
  }
  function handleDelete(id) { onDelete(id); setSelected(null); }

  // Group templates
  const globalTemplates = templates.filter(t=>!t.user_id);
  const byUser = {};
  templates.filter(t=>t.user_id).forEach(t => {
    if (!byUser[t.user_id]) byUser[t.user_id] = [];
    byUser[t.user_id].push(t);
  });
  // Global templates grouped by category (ordine canonică din TEMPLATE_CATEGORIES)
  const DEF_CAT = window.DEFAULT_TEMPLATE_CATEGORY || 'General';
  const globalByCategory = {};
  (window.TEMPLATE_CAT_IDS || []).forEach(c => { globalByCategory[c] = []; });
  globalTemplates.forEach(t => {
    const cat = t.category || DEF_CAT;
    if (!globalByCategory[cat]) globalByCategory[cat] = [];
    globalByCategory[cat].push(t);
  });

  const filterFn = t => !listSearch || t.name.toLowerCase().includes(listSearch.toLowerCase());

  return (
    <div style={{ flex:1, display:'flex', height:'100%', overflow:'hidden', position:'relative' }}>

      {/* Template list */}
      {showList && !isFullscreen && (
        <div style={{ width:200, flexShrink:0, background:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* List header */}
          <div style={{ padding:'10px 10px 6px', borderBottom:'1px solid #e2e8f0' }}>
            <div style={{ position:'relative', marginBottom:6 }}>
              <SearchIcon size={12} color="#94a3b8" style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)' }}/>
              <input value={listSearch} onChange={e=>setListSearch(e.target.value)} placeholder="Caută..."
                style={{ width:'100%', height:28, border:'1px solid #e2e8f0', borderRadius:7, padding:'0 6px 0 24px', fontSize:11, outline:'none' }}
                onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
            </div>
          </div>

          {/* Template groups */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {/* Global — grupate pe categorie */}
            {Object.entries(globalByCategory).map(([cat, catTemplates]) => {
              const filt = catTemplates.filter(filterFn);
              if (!filt.length) return null;
              return (
                <div key={cat}>
                  <div style={{ padding:'7px 10px 3px', background:'#f8fafc', borderBottom:'1px solid #f1f5f9' }}>
                    <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.8 }}>🌐 {window.templateCatIcon ? window.templateCatIcon(cat)+' ' : ''}{cat}</p>
                  </div>
                  {filt.map(t=>(
                    <TemplateListItem key={t.id} template={t} active={selected?.id===t.id} onClick={()=>openEdit(t)}/>
                  ))}
                </div>
              );
            })}
            {globalTemplates.length === 0 && !listSearch && (
              <p style={{ fontSize:11, color:'#cbd5e1', padding:'10px 12px', fontStyle:'italic' }}>Niciun template global</p>
            )}

            {/* Per user */}
            {Object.entries(byUser).map(([uid,uts])=>{
              const user  = users.find(u=>u.id===uid);
              const label = user?.firm_name||user?.email||uid.slice(0,8);
              const filt  = uts.filter(filterFn);
              if (!filt.length && listSearch) return null;
              return (
                <div key={uid}>
                  <div style={{ padding:'7px 10px 3px', background:'#f8fafc', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>👤 {label}</p>
                    <button onClick={()=>openNew(uid)} style={{ background:'none', border:'none', color:'#2563eb', fontSize:15, lineHeight:1, cursor:'pointer', flexShrink:0 }} title="Adaugă template">+</button>
                  </div>
                  {filt.length===0 && !listSearch && (
                    <p style={{ fontSize:11, color:'#cbd5e1', padding:'8px 12px', fontStyle:'italic' }}>Niciun template</p>
                  )}
                  {filt.map(t=><TemplateListItem key={t.id} template={t} active={selected?.id===t.id} onClick={()=>openEdit(t)}/>)}
                </div>
              );
            })}
          </div>

          {/* Add button */}
          <div style={{ padding:'8px', borderTop:'1px solid #e2e8f0' }}>
            <button onClick={()=>openNew(null)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, width:'100%', padding:'7px', borderRadius:7, border:'1.5px dashed #bfdbfe', background:'#f0f9ff', color:'#2563eb', fontWeight:700, fontSize:12, cursor:'pointer' }}>
              <PlusIcon size={12}/> Nou
            </button>
          </div>
        </div>
      )}

      {/* Toggle list button (when editor is open) */}
      {selected && !isFullscreen && (
        <button onClick={()=>setShowList(s=>!s)} title={showList?'Ascunde lista':'Arată lista'} style={{ position:'absolute', left: showList?192:0, top:'50%', transform:'translateY(-50%)', width:18, height:48, background:'#fff', border:'1px solid #e2e8f0', borderRadius: showList?'0 6px 6px 0':'0 6px 6px 0', borderLeft: showList?'none':'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:10, transition:'left 0.22s ease', boxShadow:'2px 0 6px rgba(0,0,0,0.06)' }}>
          {showList ? <ChevLeftIcon size={11} color="#94a3b8"/> : <ChevRightIcon size={11} color="#94a3b8"/>}
        </button>
      )}

      {/* Editor or empty state */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>
        {selected ? (
          <AdminTemplateEditor
            template={selected==='new'?null:selected}
            users={users}
            presetUserId={presetUserId}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={()=>setSelected(null)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={()=>setIsFullscreen(f=>!f)}
          />
        ) : (
          <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
            {/* Section header when no template selected */}
            <div style={{ padding:'24px 28px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:800 }}>Template-uri</h2>
                <p style={{ fontSize:13, color:'#64748b', marginTop:2 }}>{templates.length} total — {globalTemplates.length} globale, {templates.length-globalTemplates.length} personalizate</p>
              </div>
              <button onClick={()=>openNew(null)} style={{ display:'flex', alignItems:'center', gap:6, background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <PlusIcon size={14}/> Template nou
              </button>
            </div>
            <EmptyState icon="📋" title="Selectează un template" sub="Alege din lista din stânga sau creează unul nou." action="+ Template nou" onAction={()=>openNew(null)}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AdminApp ─────────────────────────────────────────────────────────────────
function AdminApp() {
  const [authState,     setAuthState]     = React.useState('loading');
  const [adminEmail,    setAdminEmail]    = React.useState('');
  const [section,       setSection]       = React.useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    try { return localStorage.getItem('ra_admin_sidebar') === 'collapsed'; } catch { return false; }
  });
  const [templateNav,   setTemplateNav]   = React.useState(null);
  const [users,         setUsers]         = React.useState([]);
  const [contracts,     setContracts]     = React.useState([]);
  const [templates,     setTemplates]     = React.useState([]);
  const [dataLoading,   setDataLoading]   = React.useState(false);

  function toggleSidebar() {
    setSidebarCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('ra_admin_sidebar', next ? 'collapsed' : 'expanded'); } catch {}
      return next;
    });
  }

  React.useEffect(() => {
    checkSession();
    const { data:{ subscription } } = window.sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { setAuthState('login'); setAdminEmail(''); setUsers([]); setContracts([]); setTemplates([]); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    try {
      const { data:{ session } } = await window.sb.auth.getSession();
      if (!session) { setAuthState('login'); return; }
      await handleUser(session.user);
    } catch { setAuthState('login'); }
  }

  async function handleUser(user) {
    setAdminEmail(user.email);
    const { data:profile } = await window.sb.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) { setAuthState('unauthorized'); return; }
    setAuthState('ready');
    loadAllData();
  }

  async function loadAllData() {
    setDataLoading(true);
    try {
      const { data:{ user } } = await window.sb.auth.getUser();
      if (!user) return;
      const [{ data:u },{ data:c },{ data:t }] = await Promise.all([
        window.sb.from('profiles').select('*').order('created_at',{ ascending:false }),
        window.sb.from('contracts').select('*').order('created_at',{ ascending:false }),
        window.sb.from('contract_templates').select('*').order('sort_order',{ ascending:true, nullsFirst:false }),
      ]);
      if(u) setUsers(u);
      if(c) setContracts(c);
      if(t) setTemplates(t.map(row=>({ ...row, bodyText:row.body_template })));
    } catch(err) { console.error('[Admin] loadAllData:', err); }
    finally { setDataLoading(false); }
  }

  function handleTemplateSave(savedRow) {
    const parsed = { ...savedRow, bodyText:savedRow.body_template };
    setTemplates(prev => { const idx=prev.findIndex(t=>t.id===parsed.id); if(idx>=0){const n=[...prev];n[idx]=parsed;return n;} return [...prev,parsed]; });
  }
  function handleTemplateDelete(id) { setTemplates(prev=>prev.filter(t=>t.id!==id)); }

  // Loading
  if (authState === 'loading') return (
    <div style={{ minHeight:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, background:'#f8fafc' }}>
      <span style={{ fontSize:36 }}>⚡</span><Spinner size={28}/><p style={{ color:'#64748b', fontSize:14 }}>Se verifică sesiunea...</p>
    </div>
  );
  if (authState === 'login') return <AdminLogin onLogin={u=>handleUser(u)} />;
  if (authState === 'unauthorized') return (
    <div style={{ minHeight:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, background:'#f8fafc' }}>
      <ShieldOffIcon size={48} color="#ef4444"/>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:20, fontWeight:700 }}>Acces neautorizat</p>
        <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Contul <strong>{adminEmail}</strong> nu are drepturi de admin.</p>
      </div>
      <button onClick={()=>window.sb.auth.signOut()} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontWeight:600, fontSize:14, cursor:'pointer' }}>Deconectare</button>
    </div>
  );

  const mainProps = { users, contracts, templates };

  return (
    <div style={{ display:'flex', height:'100vh', width:'100%', overflow:'hidden' }}>
      <AdminSidebar section={section} setSection={setSection} adminEmail={adminEmail}
        onLogout={()=>window.sb.auth.signOut()}
        collapsed={sidebarCollapsed} onToggle={toggleSidebar}/>

      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
        {/* Top bar */}
        <div style={{ padding:'0 24px', height:48, borderBottom:'1px solid #e2e8f0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13 }}>
            <span style={{ fontSize:16 }}>{{ overview:'📊', users:'👥', templates:'📋' }[section]}</span>
            <span style={{ fontWeight:700, color:'#0f172a' }}>{{ overview:'Overview', users:'Utilizatori', templates:'Template-uri' }[section]}</span>
          </div>
          <button onClick={loadAllData} disabled={dataLoading} style={{ display:'flex', alignItems:'center', gap:5, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'6px 12px', fontSize:12, color:'#64748b', fontWeight:500, cursor:'pointer' }}>
            {dataLoading ? <Spinner size={13}/> : <RefreshIcon size={13}/>} Reîncarcă
          </button>
        </div>

        {/* Section content */}
        <div style={{ flex:1, overflow: section==='templates'?'hidden':'auto', display:'flex', flexDirection:'column', minHeight:0 }}>
          {section==='overview'  && <OverviewSection {...mainProps}/>}
          {section==='users'     && (
            <UsersSection {...mainProps}
              onNewTemplate={u=>{ setTemplateNav({ action:'new', userId:u.id }); setSection('templates'); }}
              onEditTemplate={t=>{ setTemplateNav({ action:'edit', template:t }); setSection('templates'); }}
            />
          )}
          {section==='templates' && (
            <TemplatesSection {...mainProps}
              nav={templateNav} onNavConsumed={()=>setTemplateNav(null)}
              onSave={handleTemplateSave} onDelete={handleTemplateDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
