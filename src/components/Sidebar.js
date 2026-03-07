import React from 'react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',   icon: '▦' },
  { id: 'orders',    label: 'Orders',      icon: '📋' },
  { id: 'stock',     label: 'Stock',       icon: '🏭' },
  { id: 'reports',   label: 'Reports',     icon: '📊' },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minWidth: 'var(--sidebar-w)',
      background: 'linear-gradient(180deg, #3b1a8a 0%, #5b21b6 50%, #7c3aed 100%)',
      borderRight: '1px solid #6d28d9',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      height: '100vh',
      overflow: 'hidden',
      boxShadow: '2px 0 16px rgba(91,33,182,.25)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 22px 18px',
        borderBottom: '1px solid rgba(255,255,255,.15)',
      }}>
        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: 20,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: -0.5,
        }}>WELSPUN PVT. LTD.</div>
        <div style={{
          fontSize: 10,
          letterSpacing: 2.5,
          color: 'rgba(255,255,255,.6)',
          textTransform: 'uppercase',
          marginTop: 2,
          fontFamily: 'var(--font-head)',
        }}>AWD Textile</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px' }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', padding: '0 10px', marginBottom: 8, fontFamily: 'var(--font-head)' }}>
          Main Menu
        </div>
        {NAV.map(({ id, label, icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 12px',
                background: active ? 'rgba(255,255,255,.18)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: active ? '#ffffff' : 'rgba(255,255,255,.65)',
                fontFamily: 'var(--font-body)',
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.18s',
                textAlign: 'left',
                marginBottom: 2,
                borderLeft: active ? '3px solid #ffffff' : '3px solid transparent',
                boxShadow: active ? '0 2px 8px rgba(0,0,0,.15)' : 'none',
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,.15)',
        fontSize: 12,
        color: 'rgba(255,255,255,.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, background: 'rgba(255,255,255,.25)', color: '#fff' }}>WA</div>
          <div>
            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>Admin User</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>Surat Plant</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
