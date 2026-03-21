import React, { useState } from 'react';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252','#f59e0b','#06b6d4','#9d5ff5','#5b21b6'];

export default function LinkedList() {
  const [nodes, setNodes] = useState([]);
  const [val, setVal]     = useState('');
  const [pos, setPos]     = useState(0);
  const [log, setLog]     = useState('$ _');

  const out = (msg) => setLog(msg);
  const listStr = (n) => n.length ? n.join(' → ') + ' → NULL' : 'NULL';

  const insert = () => {
    if (!val.trim()) return;
    const p = Math.max(0, Math.min(+pos, nodes.length));
    const n = [...nodes]; n.splice(p, 0, val.trim());
    setNodes(n); out(`Inserted "${val}" at index ${p}\n${listStr(n)}`); setVal('');
  };
  const append  = () => { if (!val.trim()) return; const n = [...nodes, val.trim()]; setNodes(n); out(`Appended "${val}"\n${listStr(n)}`); setVal(''); };
  const prepend = () => { if (!val.trim()) return; const n = [val.trim(), ...nodes]; setNodes(n); out(`Prepended "${val}"\n${listStr(n)}`); setVal(''); };
  const del     = () => { if (+pos >= nodes.length) { out('Error: Index out of range'); return; } const n = [...nodes]; const v = n.splice(+pos, 1)[0]; setNodes(n); out(`Deleted "${v}" at index ${pos}\n${listStr(n)}`); };
  const search  = () => { const i = nodes.indexOf(val.trim()); out(i >= 0 ? `Found "${val}" at index ${i}` : `"${val}" not found in list`); };
  const reverse = () => { const n = [...nodes].reverse(); setNodes(n); out(`List reversed\n${listStr(n)}`); };
  const clear   = () => { setNodes([]); out('List cleared'); };
  const load    = () => { const n = ['ORD-001','ORD-002','ORD-003','ORD-004','ORD-005']; setNodes(n); out(`Sample Welspun orders loaded\n${listStr(n)}`); };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Linked List</h1><p>Welspun AWD · Singly Linked List with full operations</p></div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-title">Operations</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Value</label>
            <input className="inp" style={{ width: 110 }} placeholder="e.g. ORD-006"
              value={val} onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && append()} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Position (0-based)</label>
            <input className="inp" style={{ width: 90 }} type="number" min={0} value={pos}
              onChange={e => setPos(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={insert}>Insert at Pos</button>
          <button className="btn btn-ghost" onClick={append}>Append</button>
          <button className="btn btn-ghost" onClick={prepend}>Prepend</button>
          <button className="btn" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={del}>Delete at Pos</button>
          <button className="btn btn-ghost" onClick={search}>Search</button>
          <button className="btn btn-ghost" onClick={reverse}>Reverse</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}>Load Sample Data</button>
          <button className="btn btn-ghost" onClick={clear}>Clear</button>
        </div>
      </div>

      {/* Visualization */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-title">List Visualization · Size: {nodes.length}</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, minHeight: 70 }}>
          {nodes.length === 0 ? (
            <span style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic' }}>Empty list → NULL</span>
          ) : (
            <>
              {nodes.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    background: COLORS[i % COLORS.length], borderRadius: 8, width: 64, height: 52,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>
                    <span style={{ fontSize: 9, opacity: .7 }}>idx:{i}</span>
                    <span style={{ fontSize: 12 }}>{v}</span>
                    <span style={{ fontSize: 8, opacity: .6 }}>next→</span>
                  </div>
                  {i < nodes.length - 1
                    ? <span style={{ color: 'var(--purple-lt)', fontSize: 18, padding: '0 2px' }}>→</span>
                    : <span style={{ color: 'var(--muted)', fontSize: 12, padding: '0 6px', fontStyle: 'italic' }}>→ NULL</span>
                  }
                </div>
              ))}
            </>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
          Head → {nodes.length ? nodes[0] : 'NULL'}
          {nodes.length > 1 && ` · Tail → ${nodes[nodes.length - 1]}`}
        </div>
      </div>

      {/* Log */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-title">Operation Log</div>
        <div style={{ background: '#1e1432', color: '#c4b5fd', fontFamily: "'Courier New', monospace", fontSize: 12, borderRadius: 8, padding: 14, whiteSpace: 'pre-wrap', minHeight: 60 }}>
          {log}
        </div>
      </div>

      {/* Complexity Table */}
      <div className="card">
        <div className="section-title">Time Complexity</div>
        <table className="tbl">
          <thead><tr><th>Operation</th><th>Best Case</th><th>Average</th><th>Worst Case</th></tr></thead>
          <tbody>
            {[
              ['Access by index','O(1)','O(n)','O(n)'],
              ['Search','O(1)','O(n)','O(n)'],
              ['Insert at head (prepend)','O(1)','O(1)','O(1)'],
              ['Insert at tail (append)','O(n)','O(n)','O(n)'],
              ['Insert at position','O(1)','O(n)','O(n)'],
              ['Delete at head','O(1)','O(1)','O(1)'],
              ['Delete at position','O(1)','O(n)','O(n)'],
            ].map(([op, b, a, w]) => (
              <tr key={op}>
                <td style={{ fontWeight: 600 }}>{op}</td>
                <td style={{ color: 'var(--green)', fontFamily: 'monospace' }}>{b}</td>
                <td style={{ color: 'var(--blue)', fontFamily: 'monospace' }}>{a}</td>
                <td style={{ color: 'var(--red)', fontFamily: 'monospace' }}>{w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
