import React from 'react';

const MAIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'orders',    label: 'Orders',    icon: '📋' },
  { id: 'stock',     label: 'Stock',     icon: '🏭' },
  { id: 'reports',   label: 'Reports',   icon: '📊' },
];

const OS_NAV = [
  { id: 'scheduling', label: 'Process Scheduling', icon: '⏱' },
  { id: 'memory',     label: 'Memory Management',  icon: '🧠' },
  { id: 'deadlock',   label: 'Deadlock Detection', icon: '🔒' },
  { id: 'filesystem', label: 'File System',        icon: '📁' },
];

const DS_NAV = [
  { id: 'stackqueue', label: 'Stack & Queue',     icon: '📦' },
  { id: 'linkedlist', label: 'Linked List',       icon: '🔗' },
  { id: 'graph',      label: 'Graph Algorithms',  icon: '🕸' },
];

function NavSection({ title }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,.45)',
      textTransform: 'uppercase', padding: '10px 10px 4px',
      fontFamily: 'var(--font-head)', marginTop: 4,
    }}>{title}</div>
  );
}

function NavButton({ item, active, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '9px 12px', background: active ? 'rgba(255,255,255,.18)' : 'transparent',
        border: 'none', borderRadius: 8, marginBottom: 2,
        borderLeft: active ? '3px solid #ffffff' : '3px solid transparent',
        color: active ? '#ffffff' : 'rgba(255,255,255,.65)',
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left',
        boxShadow: active ? '0 2px 8px rgba(0,0,0,.15)' : 'none',
      }}
    >
      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
    </button>
  );
}

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)',
      background: 'linear-gradient(180deg, #3b1a8a 0%, #5b21b6 50%, #7c3aed 100%)',
      borderRight: '1px solid #6d28d9', display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      boxShadow: '2px 0 16px rgba(91,33,182,.25)',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
          WELSPUN PVT. LTD.
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', marginTop: 2, fontFamily: 'var(--font-head)' }}>
          AWD Textile · OS &amp; DS
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 12px', overflowY: 'auto' }}>
        <NavSection title="Main App" />
        {MAIN_NAV.map(item => <NavButton key={item.id} item={item} active={page === item.id} onClick={setPage} />)}

        <NavSection title="OS Concepts" />
        {OS_NAV.map(item => <NavButton key={item.id} item={item} active={page === item.id} onClick={setPage} />)}

        <NavSection title="Data Structures" />
        {DS_NAV.map(item => <NavButton key={item.id} item={item} active={page === item.id} onClick={setPage} />)}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,.15)', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: 'rgba(255,255,255,.2)', color: '#fff' }}>WA</div>
          <div>
            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 12 }}>Admin User</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>AWD v2.2 · Surat Plant</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
