import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';

const ROLE_CONFIG = {
  admin:    { badge:'ADMIN', bg:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', icon:'👑' },
  manager:  { badge:'MGR',   bg:'linear-gradient(135deg,#0ea5e9,#0369a1)', color:'#fff', icon:'🏢' },
  employee: { badge:'EMP',   bg:'linear-gradient(135deg,#22c77a,#15803d)', color:'#fff', icon:'👤' },
  viewer:   { badge:'VIEW',  bg:'linear-gradient(135deg,#f59e0b,#b45309)', color:'#fff', icon:'👁️' },
};

export default function Layout({ page, setPage, children, orders=[], stock=[], onLogout, user={} }) {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef  = useRef(null);
  const profileRef = useRef(null);

  const role = user?.role || 'admin';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.employee;
  const initials = user?.name
    ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
    : 'WA';

  // ── Global search ──
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowResults(false); return; }

    const orderHits = orders
      .filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.fabric.toLowerCase().includes(q) ||
        (o.status||'').toLowerCase().includes(q)
      ).slice(0,4)
      .map(o => ({ icon:'📋', label:o.id, sub:`${o.customer} · ${o.fabric}`, page:'orders' }));

    const stockHits = stock
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.category||'').toLowerCase().includes(q)
      ).slice(0,4)
      .map(s => ({ icon:'🏭', label:s.name, sub:`${s.id} · ${s.category}`, page:'stock' }));

    const pageHits = [
      { id:'dashboard', label:'Dashboard', icon:'▦' },
      { id:'orders',    label:'Orders',    icon:'📋' },
      { id:'stock',     label:'Stock',     icon:'🏭' },
      { id:'reports',   label:'Reports',   icon:'📊' },
    ].filter(p=>p.label.toLowerCase().includes(q))
     .map(p=>({ icon:p.icon, label:`Go to ${p.label}`, sub:'Page', page:p.id }));

    const all = [...orderHits, ...stockHits, ...pageHits];
    setResults(all);
    setShowResults(all.length > 0);
  }, [query, orders, stock]);

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setShowResults(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const goTo = (p) => { setPage(p); setQuery(''); setShowResults(false); };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Topbar */}
        <div className="topbar">

          {/* Search */}
          <div ref={searchRef} style={{ position:'relative', flex:1, maxWidth:380 }}>
            <div className="topbar-search" style={{ cursor:'text' }}>
              <span style={{ color:'var(--muted)' }}>🔍</span>
              <input
                style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontFamily:'var(--font-body)', fontSize:13, width:'100%' }}
                placeholder="Search orders, fabric, suppliers…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length>0 && setShowResults(true)}
              />
              {query && (
                <span style={{ cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1 }}
                  onClick={() => { setQuery(''); setShowResults(false); }}>×</span>
              )}
            </div>

            {showResults && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 32px rgba(124,58,237,.15)', zIndex:999, overflow:'hidden' }}>
                {results.map((r,i) => (
                  <div key={i} onClick={() => goTo(r.page)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', cursor:'pointer', borderBottom:i<results.length-1?'1px solid var(--border)':'none' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <span style={{ fontSize:16 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>{r.label}</div>
                      <div style={{ fontSize:11, color:'var(--muted)' }}>{r.sub}</div>
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:10, color:'var(--accent)', fontWeight:700, textTransform:'uppercase' }}>{r.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="topbar-right">
            <div style={{ position:'relative', cursor:'pointer', fontSize:18 }}>🔔<span className="notif-dot"/></div>

            {/* Profile dropdown */}
            <div ref={profileRef} style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => setShowProfile(!showProfile)}>
                {/* Role badge pill */}
                <div style={{ background:config.bg, padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:800, color:config.color, letterSpacing:1, fontFamily:"'Syne',sans-serif" }}>
                  {config.icon} {config.badge}
                </div>
                {/* Avatar */}
                <div className="avatar" title="Account">{initials}</div>
              </div>

              {showProfile && (
                <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, boxShadow:'0 8px 32px rgba(124,58,237,.15)', width:240, zIndex:999, overflow:'hidden' }}>

                  {/* User info + badge */}
                  <div style={{ padding:'16px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <div className="avatar" style={{ width:42, height:42, fontSize:15 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{user?.name||'Admin User'}</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>{user?.email||'admin@welspun.com'}</div>
                      </div>
                    </div>
                    {/* Badge display */}
                    <div style={{ background:config.bg, borderRadius:8, padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:18 }}>{config.icon}</span>
                      <div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', letterSpacing:.5 }}>ACCESS LEVEL</div>
                        <div style={{ fontSize:13, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", letterSpacing:1 }}>{config.badge} — {role.toUpperCase()}</div>
                      </div>
                    </div>
                    {/* Extra info */}
                    <div style={{ marginTop:10, display:'flex', gap:8 }}>
                      {[
                        { label:'Plant',  val: user?.plant||'Surat' },
                        { label:'Dept',   val: user?.department||'AWD' },
                      ].map(d => (
                        <div key={d.label} style={{ flex:1, background:'var(--bg3)', borderRadius:6, padding:'6px 10px' }}>
                          <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:.5, textTransform:'uppercase' }}>{d.label}</div>
                          <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{d.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Menu */}
                  {[
                    { icon:'▦',  label:'Dashboard', action:()=>{ setPage('dashboard'); setShowProfile(false); } },
                    { icon:'⚙️', label:'Settings',  action:()=>setShowProfile(false) },
                  ].map((item,i) => (
                    <div key={i} onClick={item.action}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', cursor:'pointer', fontSize:13, color:'var(--text)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                    >
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}

                  {/* Logout */}
                  <div style={{ borderTop:'1px solid var(--border)' }}>
                    <div onClick={() => { setShowProfile(false); onLogout(); }}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', cursor:'pointer', fontSize:13, color:'#dc2626', fontWeight:600 }}
                      onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                    >
                      <span>🚪</span> Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main style={{ flex:1, overflow:'auto' }}>{children}</main>
      </div>
    </div>
  );
}
