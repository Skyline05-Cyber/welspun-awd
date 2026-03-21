import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ page, setPage, children, orders = [], stock = [], onLogout }) {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // ── Global search across orders + stock ──
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowResults(false); return; }

    const orderHits = orders
      .filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.fabric.toLowerCase().includes(q) ||
        (o.status || '').toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(o => ({ type: 'order', icon: '📋', label: o.id, sub: `${o.customer} · ${o.fabric}`, page: 'orders' }));

    const stockHits = stock
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(s => ({ type: 'stock', icon: '🏭', label: s.name, sub: `${s.id} · ${s.category}`, page: 'stock' }));

    const pageHits = [
      { id: 'dashboard', label: 'Dashboard',  icon: '▦' },
      { id: 'orders',    label: 'Orders',     icon: '📋' },
      { id: 'stock',     label: 'Stock',      icon: '🏭' },
      { id: 'reports',   label: 'Reports',    icon: '📊' },
    ]
      .filter(p => p.label.toLowerCase().includes(q))
      .map(p => ({ type: 'page', icon: p.icon, label: `Go to ${p.label}`, sub: 'Page', page: p.id }));

    const all = [...orderHits, ...stockHits, ...pageHits];
    setResults(all);
    setShowResults(all.length > 0);
  }, [query, orders, stock]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goTo = (p) => {
    setPage(p);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* ── Topbar ── */}
        <div className="topbar">

          {/* Search */}
          <div ref={searchRef} style={{ position:'relative', flex:1, maxWidth:380 }}>
            <div className="topbar-search" style={{ cursor:'text' }}>
              <span style={{ color:'var(--muted)' }}>🔍</span>
              <input
                style={{
                  background:'transparent', border:'none', outline:'none',
                  color:'var(--text)', fontFamily:'var(--font-body)', fontSize:13,
                  width:'100%',
                }}
                placeholder="Search orders, fabric, suppliers…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
              />
              {query && (
                <span
                  style={{ cursor:'pointer', color:'var(--muted)', fontSize:16, lineHeight:1 }}
                  onClick={() => { setQuery(''); setShowResults(false); }}
                >×</span>
              )}
            </div>

            {/* Search Dropdown */}
            {showResults && (
              <div style={{
                position:'absolute', top:'calc(100% + 8px)', left:0, right:0,
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:10, boxShadow:'0 8px 32px rgba(124,58,237,.15)',
                zIndex:999, overflow:'hidden',
              }}>
                {results.length === 0 ? (
                  <div style={{ padding:'14px 16px', color:'var(--muted)', fontSize:13 }}>No results found</div>
                ) : (
                  results.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => goTo(r.page)}
                      style={{
                        display:'flex', alignItems:'center', gap:12,
                        padding:'10px 16px', cursor:'pointer',
                        borderBottom: i < results.length-1 ? '1px solid var(--border)' : 'none',
                        transition:'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:16 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>{r.label}</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>{r.sub}</div>
                      </div>
                      <span style={{ marginLeft:'auto', fontSize:10, color:'var(--accent)', fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{r.type}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="topbar-right">
            {/* Notification bell */}
            <div style={{ position:'relative', cursor:'pointer', fontSize:18 }}>
              🔔
              <span className="notif-dot" />
            </div>

            {/* Profile / Logout dropdown */}
            <div ref={profileRef} style={{ position:'relative' }}>
              <div
                className="avatar"
                style={{ cursor:'pointer' }}
                onClick={() => setShowProfile(!showProfile)}
                title="Account"
              >WA</div>

              {showProfile && (
                <div style={{
                  position:'absolute', top:'calc(100% + 10px)', right:0,
                  background:'var(--bg2)', border:'1px solid var(--border)',
                  borderRadius:12, boxShadow:'0 8px 32px rgba(124,58,237,.15)',
                  width:220, zIndex:999, overflow:'hidden',
                }}>
                  {/* User info */}
                  <div style={{ padding:'16px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ width:38, height:38, fontSize:14 }}>WA</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>Admin User</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>admin@welspun.com</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon:'▦',  label:'Dashboard', action: () => { setPage('dashboard'); setShowProfile(false); } },
                    { icon:'⚙️', label:'Settings',  action: () => setShowProfile(false) },
                  ].map((item, i) => (
                    <div
                      key={i}
                      onClick={item.action}
                      style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'10px 16px', cursor:'pointer',
                        fontSize:13, color:'var(--text)',
                        transition:'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}

                  {/* Logout */}
                  <div style={{ borderTop:'1px solid var(--border)' }}>
                    <div
                      onClick={() => { setShowProfile(false); onLogout(); }}
                      style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'12px 16px', cursor:'pointer',
                        fontSize:13, color:'#dc2626', fontWeight:600,
                        transition:'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span>🚪</span> Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main style={{ flex:1, overflow:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
