// web/screens.jsx — Dashboard, Contracte, Active, Echipă, Setări

const {
  WHomeIcon, WFileIcon, WPackageIcon, WArchiveIcon, WUsersIcon, WSettingsIcon,
  WPlusIcon, WSearchIcon, WDownloadIcon, WMailIcon, WCheckIcon, WKeyIcon,
  WShieldIcon, WBuildingIcon, WEditIcon, WTrashIcon, WSpinnerIcon, WCopyIcon,
  WAvatar, WStatusBadge, WRoleBadge, StatCard, WBtn, WGhostBtn, WSectionHeader, WInput,
} = window;

// ─── Dashboard ────────────────────────────────────────────────────────────────
function WebDashboard({ profile, contracts, navigate }) {
  const used  = profile.contracts_used;
  const limit = profile.contracts_limit;
  const pct   = Math.min(Math.round((used / limit) * 100), 100);
  const recent = contracts.slice(0, 7);

  // Simple monthly breakdown (last 6 months mock)
  const monthlyData = [
    { month: 'Dec', count: 28 }, { month: 'Ian', count: 34 },
    { month: 'Feb', count: 29 }, { month: 'Mar', count: 41 },
    { month: 'Apr', count: 38 }, { month: 'Mai', count: 47 },
  ];
  const maxCount = Math.max(...monthlyData.map(m => m.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard icon="📄" label="Contracte luna aceasta" value={used} sub={`din ${limit} disponibile`} color="#2563eb" />
        <StatCard icon="⚡" label="Active (în curs)" value={contracts.filter(c=>['draft','generated'].includes(c.status)).length} sub="draft + generate" color="#f59e0b" />
        <StatCard icon="✅" label="Finalizate" value={contracts.filter(c=>c.status==='signed').length} sub="semnate luna aceasta" color="#10b981" />
        <StatCard icon="👥" label="Utilizatori activi" value={4} sub="din 10 locuri" color="#7c3aed" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* Left: Activity chart + recent contracts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Activity chart */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <WSectionHeader title="Activitate lunară" action={
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Ultimele 6 luni</span>
            } />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 100 }}>
              {monthlyData.map(m => (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{m.count}</span>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: m.month === 'Mai' ? '#2563eb' : '#dbeafe', height: `${Math.round((m.count / maxCount) * 72)}px`, transition: 'height 0.3s ease' }} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent contracts */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <WSectionHeader title="Contracte recente" action={
              <button onClick={() => navigate('contracts')} style={{ fontSize: 13, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Vezi toate →
              </button>
            } />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Persoană', 'Tip contract', 'Data', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <WAvatar name={c.parties?.[0]?.name ?? '—'} size={28} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{c.parties?.[0]?.name ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#64748b' }}>{c.template_name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#64748b' }}>{new Date(c.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' })}</td>
                    <td style={{ padding: '10px 12px' }}><WStatusBadge status={c.status} /></td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <ActionBtn icon={<WDownloadIcon size={14} />} title="Descarcă" />
                        <ActionBtn icon={<WMailIcon size={14} />} title="Email" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Usage + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Usage */}
          <div style={{ background: 'linear-gradient(135deg, #2563eb, #10b981)', borderRadius: 12, padding: '20px', color: '#fff' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>Plan {profile.plan}</p>
            <p style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{used}<span style={{ fontSize: 16, opacity: 0.7, fontWeight: 400 }}> / {limit}</span></p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>contracte luna aceasta</p>
            <div style={{ marginTop: 12, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#fff', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, opacity: 0.7 }}>
              <span>Resetare 1 iunie</span>
              <span>{100 - pct}% rămas</span>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' }}>
            <WSectionHeader title="Acțiuni rapide" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '📄', label: 'Contract nou', sub: 'Scanează CI + generează', color: '#2563eb', onClick: () => {} },
                { icon: '📊', label: 'Raport lunar', sub: 'Export CSV / PDF', color: '#7c3aed', onClick: () => {} },
                { icon: '👥', label: 'Invită utilizator', sub: 'Adaugă în echipă', color: '#10b981', onClick: () => navigate('team') },
              ].map(a => (
                <button key={a.label} onClick={a.onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + '60'; e.currentTarget.style.background = a.color + '08'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{a.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contract types breakdown */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' }}>
            <WSectionHeader title="Tipuri contracte" />
            {[
              { label: 'Închiriere Auto', pct: 78, color: '#2563eb' },
              { label: 'Prestări Servicii', pct: 14, color: '#7c3aed' },
              { label: 'Altele', pct: 8, color: '#94a3b8' },
            ].map(t => (
              <div key={t.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{t.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{t.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${t.pct}%`, background: t.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contracts table ──────────────────────────────────────────────────────────
function WebContracts({ contracts }) {
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [selected, setSelected] = React.useState(null);

  const filtered = contracts.filter(c => {
    const name = c.parties?.[0]?.name ?? '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || c.template_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
          <WSearchIcon size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută după nume, tip contract..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#fff', outline: 'none', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#fff', outline: 'none', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
          <option value="all">Toate statusurile</option>
          <option value="draft">Ciornă</option>
          <option value="generated">Generat</option>
          <option value="signed">Semnat</option>
          <option value="expired">Expirat</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <WBtn><WPlusIcon size={14} /> Contract nou</WBtn>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              {['Persoană', 'Tip contract', 'Vehicul / Activ', 'Data creării', 'Status', 'Acțiuni'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Niciun contract găsit.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.1s' }}
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <WAvatar name={c.parties?.[0]?.name ?? '—'} size={30} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{c.parties?.[0]?.name ?? '—'}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>{c.parties?.[0]?.cnp ?? 'CNP —'}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155', fontWeight: 500 }}>{c.template_name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>—</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{new Date(c.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td style={{ padding: '12px 16px' }}><WStatusBadge status={c.status} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <ActionBtn icon={<WDownloadIcon size={14} />} title="Descarcă PDF" />
                    <ActionBtn icon={<WMailIcon size={14} />} title="Trimite email" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{filtered.length} contracte</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['‹', '1', '2', '›'].map(p => (
              <button key={p} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: p === '1' ? '#2563eb' : '#fff', color: p === '1' ? '#fff' : '#475569', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Team management ──────────────────────────────────────────────────────────
function WebTeam({ team, profile }) {
  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('operator');
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleInvite() {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false); setSent(true);
    setTimeout(() => { setSent(false); setShowInvite(false); setInviteEmail(''); }, 2000);
  }

  const usedSlots = team.length;
  const totalSlots = 10;

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Echipă</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{usedSlots} / {totalSlots} locuri utilizate</p>
        </div>
        <WBtn onClick={() => setShowInvite(true)}><span>+</span> Invită utilizator</WBtn>
      </div>

      {/* Slots bar */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Utilizatori activi</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>{usedSlots} / {totalSlots}</span>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${(usedSlots/totalSlots)*100}%`, background: '#7c3aed', borderRadius: 99 }} />
        </div>
      </div>

      {/* Team table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              {['Utilizator', 'Email', 'Rol', 'Contracte', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <WAvatar name={m.name} size={32} from={m.role === 'admin' ? '#7c3aed' : m.role === 'manager' ? '#2563eb' : '#64748b'} to={m.role === 'admin' ? '#4c1d95' : '#1d4ed8'} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{m.email}</td>
                <td style={{ padding: '12px 16px' }}><WRoleBadge role={m.role} /></td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155', fontWeight: 500 }}>{m.contracts_count}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: m.status === 'active' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.status === 'active' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                    {m.status === 'active' ? 'Activ' : 'Invitat'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {m.role !== 'admin' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <ActionBtn icon={<WEditIcon size={14} />} title="Editează rol" />
                      <ActionBtn icon={<WTrashIcon size={14} />} title="Elimină" danger />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="fade-in" style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Invitație trimisă!</h3>
                <p style={{ fontSize: 14, color: '#64748b' }}>{inviteEmail}</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>Invită utilizator</h3>
                  <button onClick={() => setShowInvite(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="coleg@firma.ro" type="email"
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rol</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', fontSize: 14, fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}>
                      <option value="operator">Operator — creează și gestionează contracte</option>
                      <option value="manager">Manager — + acces rapoarte și echipă</option>
                      <option value="admin">Admin — acces complet</option>
                    </select>
                  </div>
                  <WBtn onClick={handleInvite} disabled={!inviteEmail.includes('@') || sending} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    {sending ? <><WSpinnerIcon size={16} /> Se trimite...</> : 'Trimite invitația →'}
                  </WBtn>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function WebSettings({ profile, plan }) {
  const [apiCopied, setApiCopied] = React.useState(false);
  const mockApiKey = 'ra_live_k9x2mP4nQvR8sT7wY1zA3bC6dE0fG5hI';

  function copyApi() {
    setApiCopied(true);
    setTimeout(() => setApiCopied(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      {/* Company info */}
      <SettingsSection title="Date firmă" icon="🏢">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Denumire firmă', value: profile.firm_name },
            { label: 'CUI', value: profile.firm_cui },
            { label: 'Nr. Reg. Comerțului', value: profile.firm_reg },
            { label: 'Reprezentant legal', value: profile.legal_rep },
            { label: 'Adresă sediu', value: profile.firm_address },
            { label: 'Email', value: profile.email },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', marginBottom: 5 }}>{f.label}</label>
              <input defaultValue={f.value} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', fontSize: 14, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <WBtn>Salvează modificările</WBtn>
        </div>
      </SettingsSection>

      {/* Plan & billing */}
      <SettingsSection title="Plan și facturare" icon="💳">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>Plan {profile.plan} <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: 20, padding: '2px 10px', fontSize: 12, marginLeft: 6 }}>Activ</span></p>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{profile.contracts_used} / {profile.contracts_limit} contracte luna aceasta · Resetare 1 iunie</p>
          </div>
          <WBtn bg="#7c3aed">Upgrade plan</WBtn>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>Următoarea factură: <strong style={{ color: '#334155' }}>499 RON</strong> pe 1 iunie 2026.</p>
      </SettingsSection>

      {/* API access (Business/Enterprise) */}
      {['business', 'enterprise'].includes(profile.plan) && (
        <SettingsSection title="API Access" icon="🔑" badge="Business">
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Folosește API key-ul pentru a integra RapidAct în sistemele tale.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, color: '#334155', letterSpacing: 0.5 }}>
              {mockApiKey}
            </div>
            <WBtn onClick={copyApi} bg={apiCopied ? '#10b981' : '#0f172a'}>
              {apiCopied ? <><WCheckIcon size={14} /> Copiat!</> : <><WCopyIcon size={14} /> Copiază</>}
            </WBtn>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <WBtn bg="#ef4444" style={{ fontSize: 12, padding: '6px 12px' }}>Regenerează key</WBtn>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2563eb', textDecoration: 'none', padding: '6px 12px' }}>📖 Documentație API →</a>
          </div>
        </SettingsSection>
      )}

      {/* Branding (Enterprise) */}
      {profile.plan === 'enterprise' && (
        <SettingsSection title="Custom Design / Branding" icon="🎨" badge="Enterprise">
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Personalizează aspectul contractelor generate cu logo-ul și culorile firmei.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: '2px dashed #e2e8f0', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
              <p style={{ fontSize: 14, color: '#64748b' }}>📤 Încarcă logo firmă (PNG, SVG — max 2 MB)</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', marginBottom: 6 }}>Culoare primară brand</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#2563eb', '#7c3aed', '#059669', '#dc2626', '#0f172a'].map(c => (
                  <div key={c} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer', border: c === '#2563eb' ? '3px solid #0f172a' : '3px solid transparent' }} />
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>
      )}

      {/* Security */}
      <SettingsSection title="Securitate" icon="🔒">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Schimbă parola', sub: 'Ultima schimbare: acum 3 luni', btn: 'Schimbă' },
            { label: 'Autentificare 2FA', sub: 'Dezactivată', btn: 'Activează', btnColor: '#10b981' },
            { label: 'Sesiuni active', sub: '2 dispozitive conectate', btn: 'Gestionează' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>{s.sub}</p>
              </div>
              <WBtn bg={s.btnColor || '#475569'} style={{ fontSize: 12, padding: '6px 14px' }}>{s.btn}</WBtn>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ActionBtn({ icon, title, danger=false }) {
  return (
    <button title={title} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: danger ? '#ef4444' : '#64748b', transition: 'all 0.1s' }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? '#fef2f2' : '#f8fafc'; e.currentTarget.style.borderColor = danger ? '#fca5a5' : '#cbd5e1'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
      {icon}
    </button>
  );
}

function SettingsSection({ title, icon, badge, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontWeight: 700, fontSize: 14 }}>{title}</h3>
        {badge && <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{badge}</span>}
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  );
}

Object.assign(window, { WebDashboard, WebContracts, WebTeam, WebSettings });
