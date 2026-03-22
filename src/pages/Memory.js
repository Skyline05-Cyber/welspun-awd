import React, { useState } from 'react';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252','#f59e0b','#06b6d4','#9d5ff5','#5b21b6','#ec4899'];

const DEFAULT_SEGS = [
  { name: 'OS Kernel', base: '0x0000', limit: 32, perm: 'R-X' },
  { name: 'Code',      base: '0x8000', limit: 16, perm: 'R-X' },
  { name: 'Data',      base: '0xC000', limit: 8,  perm: 'RW-' },
  { name: 'Stack',     base: '0xE000', limit: 4,  perm: 'RW-' },
];

export default function Memory() {
  const [tab, setTab] = useState('paging');

  // Paging
  const [totalFrames, setTotalFrames] = useState(16);
  const [allocations, setAllocations] = useState([]);
  const [procName, setProcName] = useState('P1');
  const [pagesNeeded, setPagesNeeded] = useState(3);

  // Segmentation
  const [segments, setSegments] = useState(DEFAULT_SEGS);
  const [segForm, setSegForm] = useState({ name: 'Heap', base: '0xF000', limit: 8, perm: 'RW-' });

  const usedFrames = allocations.reduce((a, p) => a + p.pages, 0);

  const allocate = () => {
    if (usedFrames + pagesNeeded > totalFrames) { alert('Not enough free frames!'); return; }
    setAllocations(prev => [...prev, { proc: procName, pages: pagesNeeded, color: COLORS[prev.length % COLORS.length] }]);
  };

  const frameArr = Array(totalFrames).fill(null);
  let fi = 0;
  for (const a of allocations) {
    for (let i = 0; i < a.pages; i++) {
      if (fi < totalFrames) frameArr[fi++] = { proc: a.proc, color: a.color };
    }
  }

  const addSegment = () => {
    setSegments(prev => [...prev, { ...segForm, limit: +segForm.limit }]);
    setSegForm({ name: '', base: '0x0000', limit: 4, perm: 'RW-' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Memory Management</h1><p>Welspun AWD · Paging &amp; Segmentation</p></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--border)' }}>
        {['paging', 'segmentation'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', fontSize: 12, fontWeight: 600, background: 'transparent', border: 'none',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === t ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', marginBottom: -1,
          }}>{t === 'paging' ? 'Paging' : 'Segmentation'}</button>
        ))}
      </div>

      {tab === 'paging' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Config */}
            <div className="card">
              <div className="section-title">Configuration</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">Total Frames</label>
                  <input className="inp" style={{ width: 80 }} type="number" min={4} max={32} value={totalFrames}
                    onChange={e => { setTotalFrames(+e.target.value); setAllocations([]); }} />
                </div>
              </div>
              <div className="section-title">Allocate Memory</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">Process</label>
                  <input className="inp" style={{ width: 70 }} value={procName} onChange={e => setProcName(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">Pages Needed</label>
                  <input className="inp" style={{ width: 70 }} type="number" min={1} max={8} value={pagesNeeded}
                    onChange={e => setPagesNeeded(+e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={allocate}>Allocate</button>
                <button className="btn btn-ghost" onClick={() => setAllocations([])}>Clear</button>
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                Free: {totalFrames - usedFrames} / {totalFrames} frames
              </div>
            </div>

            {/* Page Table */}
            <div className="card">
              <div className="section-title">Page Table</div>
              {allocations.length ? (
                <table className="tbl">
                  <thead><tr><th>Process</th><th>Page</th><th>Frame</th><th>Valid</th></tr></thead>
                  <tbody>
                    {(() => {
                      let f = 0;
                      return allocations.flatMap(a =>
                        Array.from({ length: a.pages }, (_, i) => (
                          <tr key={`${a.proc}-${i}`}>
                            <td style={{ color: a.color, fontWeight: 700 }}>{a.proc}</td>
                            <td>{i}</td>
                            <td>{f++}</td>
                            <td><span className="badge green">✓ Valid</span></td>
                          </tr>
                        ))
                      );
                    })()}
                  </tbody>
                </table>
              ) : <p style={{ color: 'var(--muted)', fontSize: 12 }}>No allocations yet</p>}
            </div>
          </div>

          {/* Frame Map */}
          <div className="card">
            <div className="section-title">Physical Memory – Frame Map</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(totalFrames, 8)}, 1fr)`, gap: 4, marginBottom: 10 }}>
              {frameArr.map((f, i) => (
                <div key={i} title={`Frame ${i}${f ? ': ' + f.proc : ' (free)'}`} style={{
                  height: 40, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', fontSize: 9, fontWeight: 700, cursor: 'default',
                  background: f ? f.color : 'var(--bg3)', color: f ? '#fff' : 'var(--muted)',
                  border: '1px solid var(--border)', transition: 'all .2s',
                }}>
                  <span>{i}</span>
                  {f && <span style={{ opacity: .8 }}>{f.proc}</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 11, color: 'var(--muted)' }}>
              {allocations.map(a => (
                <span key={a.proc}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: a.color, marginRight: 4 }} />{a.proc} ({a.pages} pages)</span>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'segmentation' && (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-title">Segment Table</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[['name','Name','text'],['base','Base','text'],['limit','Limit (KB)','number']].map(([k, lbl, type]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">{lbl}</label>
                  <input className="inp" style={{ width: 100 }} type={type} value={segForm[k]}
                    onChange={e => setSegForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label">Permission</label>
                <select className="inp" value={segForm.perm} onChange={e => setSegForm(f => ({ ...f, perm: e.target.value }))}>
                  {['R-X','RW-','RWX','R--'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={addSegment}>+ Add</button>
              <button className="btn btn-ghost" onClick={() => setSegments(DEFAULT_SEGS)}>Reset</button>
            </div>
            <table className="tbl">
              <thead><tr><th>#</th><th>Segment</th><th>Base</th><th>Limit</th><th>Permission</th><th>Logical Top</th></tr></thead>
              <tbody>
                {segments.map((s, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--muted)' }}>{i}</td>
                    <td style={{ fontWeight: 700, color: COLORS[i % COLORS.length] }}>{s.name}</td>
                    <td style={{ fontFamily: 'monospace' }}>{s.base}</td>
                    <td>{s.limit} KB</td>
                    <td><span className="badge blue">{s.perm}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--muted)' }}>{s.base}+{s.limit}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="section-title">Memory Map</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {segments.map((s, i) => (
                <div key={i} style={{
                  height: Math.max(32, s.limit * 2), background: COLORS[i % COLORS.length],
                  borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px',
                  color: '#fff', fontSize: 12, fontWeight: 700, gap: 10,
                }}>
                  <span>{s.name}</span>
                  <span style={{ opacity: .7, fontSize: 11 }}>{s.base} · {s.limit}KB · {s.perm}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
