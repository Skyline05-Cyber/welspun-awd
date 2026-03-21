import React, { useState } from 'react';

const INIT_ALLOC   = [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]];
const INIT_MAX     = [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]];
const PROCS        = ['P0','P1','P2','P3','P4'];
const RESOURCES    = ['R1','R2','R3'];

function bankersAlgo(alloc, maxNeed, available) {
  const need = maxNeed.map((m, i) => m.map((v, j) => v - alloc[i][j]));
  const work = [...available];
  const finish = Array(PROCS.length).fill(false);
  const safeSeq = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < PROCS.length; i++) {
      if (!finish[i] && need[i].every((n, j) => n <= work[j])) {
        need[i].forEach((_, j) => { work[j] += alloc[i][j]; });
        finish[i] = true;
        safeSeq.push(PROCS[i]);
        changed = true;
      }
    }
  }
  return { safe: finish.every(Boolean), safeSeq, need, finish };
}

export default function Deadlock() {
  const [tab, setTab] = useState('rag');

  // RAG
  const [edges, setEdges] = useState([]);
  const [ragForm, setRagForm] = useState({ proc: 'P1', rel: 'req', res: 'R1' });
  const [dlStatus, setDlStatus] = useState(null);

  // Banker's
  const [available, setAvailable] = useState([3, 2, 2]);
  const [bankResult, setBankResult] = useState(null);

  const addEdge = () => setEdges(prev => [...prev, { ...ragForm }]);
  const removeEdge = (i) => setEdges(prev => prev.filter((_, idx) => idx !== i));

  const detectDeadlock = () => {
    const reqs  = edges.filter(e => e.rel === 'req');
    const holds = edges.filter(e => e.rel === 'hold');
    const cycles = [];
    reqs.forEach(r => {
      const holder = holds.find(h => h.res === r.res);
      if (holder) {
        const holderReq = reqs.find(q => q.proc === holder.proc && holds.find(h2 => h2.res === q.res && h2.proc === r.proc));
        if (holderReq) cycles.push(`${r.proc} → ${r.res} ← ${holder.proc}`);
      }
    });
    setDlStatus(cycles.length ? { deadlock: true, msg: `Cycle detected: ${cycles[0]}` } : { deadlock: false, msg: 'No deadlock – system is safe' });
  };

  const runBankers = () => {
    const res = bankersAlgo(INIT_ALLOC, INIT_MAX, available);
    setBankResult(res);
  };

  // RAG SVG positions
  const procPos = { P1:[60,50], P2:[60,120], P3:[60,190], P4:[60,260] };
  const resPos  = { R1:[240,80], R2:[240,165], R3:[240,250] };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Deadlock Detection &amp; Avoidance</h1><p>Welspun AWD · RAG &amp; Banker's Algorithm</p></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--border)' }}>
        {[['rag','Resource Allocation Graph'],['banker',"Banker's Algorithm"]].map(([t, lbl]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', fontSize: 12, fontWeight: 600, background: 'transparent', border: 'none',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === t ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', marginBottom: -1,
          }}>{lbl}</button>
        ))}
      </div>

      {tab === 'rag' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Controls */}
          <div className="card">
            <div className="section-title">Add Edge</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[['proc','Process',['P1','P2','P3','P4']],['rel','Relation',null],['res','Resource',['R1','R2','R3']]].map(([k, lbl, opts]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">{lbl}</label>
                  {k === 'rel' ? (
                    <select className="inp" value={ragForm.rel} onChange={e => setRagForm(f => ({ ...f, rel: e.target.value }))}>
                      <option value="req">Requests →</option>
                      <option value="hold">Holds ←</option>
                    </select>
                  ) : (
                    <select className="inp" value={ragForm[k]} onChange={e => setRagForm(f => ({ ...f, [k]: e.target.value }))}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              ))}
              <button className="btn btn-primary" onClick={addEdge}>Add</button>
            </div>

            <div className="section-title">Edge List</div>
            {edges.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 12 }}>No edges yet</p>}
            {edges.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{e.proc}</span>
                <span style={{ color: 'var(--muted)' }}>{e.rel === 'req' ? 'requests →' : 'holds ←'}</span>
                <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{e.res}</span>
                <button onClick={() => removeEdge(i)} style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>✕</button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn btn-primary" onClick={detectDeadlock}>🔍 Detect Deadlock</button>
              <button className="btn btn-ghost" onClick={() => { setEdges([]); setDlStatus(null); }}>Reset</button>
            </div>

            {dlStatus && (
              <div style={{
                marginTop: 12, padding: 12, borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: dlStatus.deadlock ? '#fee2e2' : '#dcfce7',
                color: dlStatus.deadlock ? '#dc2626' : '#16a34a',
                border: `1px solid ${dlStatus.deadlock ? '#fca5a5' : '#86efac'}`,
              }}>
                {dlStatus.deadlock ? '⚠ DEADLOCK DETECTED' : '✓ No Deadlock'}<br />
                <span style={{ fontWeight: 400 }}>{dlStatus.msg}</span>
              </div>
            )}
          </div>

          {/* RAG Visualization */}
          <div className="card">
            <div className="section-title">RAG Visualization</div>
            <svg width="100%" viewBox="0 0 320 320" style={{ background: 'var(--bg3)', borderRadius: 8 }}>
              <defs>
                <marker id="ragArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#888" strokeWidth="1.5" />
                </marker>
              </defs>
              {/* Process nodes */}
              {Object.entries(procPos).map(([p, [x, y]]) => (
                <g key={p}>
                  <circle cx={x} cy={y} r={22} fill="#7c3aed" opacity={.9} />
                  <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700} fontFamily="system-ui">{p}</text>
                </g>
              ))}
              {/* Resource nodes */}
              {Object.entries(resPos).map(([r, [x, y]]) => (
                <g key={r}>
                  <rect x={x - 22} y={y - 18} width={44} height={36} rx={6} fill="#4a9eff" opacity={.9} />
                  <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700} fontFamily="system-ui">{r}</text>
                </g>
              ))}
              {/* Edges */}
              {edges.map((e, i) => {
                const [px, py] = procPos[e.proc] || [0, 0];
                const [rx, ry] = resPos[e.res] || [0, 0];
                const x1 = e.rel === 'req' ? px + 22 : rx - 22;
                const y1 = e.rel === 'req' ? py : ry;
                const x2 = e.rel === 'req' ? rx - 22 : px + 22;
                const y2 = e.rel === 'req' ? ry : py;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={e.rel === 'req' ? '#e05252' : '#22c77a'} strokeWidth={1.5} markerEnd="url(#ragArr)" opacity={.9} />;
              })}
              <text x={60} y={300} textAnchor="middle" fill="#8b7aaa" fontSize={10} fontFamily="system-ui">Processes</text>
              <text x={240} y={300} textAnchor="middle" fill="#8b7aaa" fontSize={10} fontFamily="system-ui">Resources</text>
            </svg>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
              <span><span style={{ color: '#e05252', fontWeight: 700 }}>—</span> Requests</span>
              <span><span style={{ color: '#22c77a', fontWeight: 700 }}>—</span> Holds</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'banker' && (
        <div className="card">
          <div className="section-title">Banker's Algorithm – Safe State Detection</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
            The Banker's Algorithm determines if the system is in a safe state by checking if all processes can complete using available resources.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[['Allocation Matrix', INIT_ALLOC], ["Max Need Matrix", INIT_MAX]].map(([lbl, data]) => (
              <div key={lbl}>
                <div className="section-title">{lbl}</div>
                <table className="tbl">
                  <thead><tr><th>Process</th>{RESOURCES.map(r => <th key={r}>{r}</th>)}</tr></thead>
                  <tbody>{PROCS.map((p, i) => (
                    <tr key={p}><td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p}</td>
                      {data[i].map((v, j) => <td key={j}>{v}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 14, flexWrap: 'wrap' }}>
            {RESOURCES.map((r, i) => (
              <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label">Available {r}</label>
                <input className="inp" style={{ width: 70 }} type="number" min={0} value={available[i]}
                  onChange={e => setAvailable(prev => prev.map((v, j) => j === i ? +e.target.value : v))} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={runBankers}>▶ Run Algorithm</button>
          </div>

          {bankResult && (
            <>
              <div style={{
                padding: 14, borderRadius: 8, marginBottom: 14,
                background: bankResult.safe ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${bankResult.safe ? '#86efac' : '#fca5a5'}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: bankResult.safe ? '#16a34a' : '#dc2626', marginBottom: 4 }}>
                  {bankResult.safe ? '✓ SAFE STATE' : '✕ UNSAFE STATE – Deadlock Risk'}
                </div>
                {bankResult.safe
                  ? <div style={{ fontSize: 12, color: '#15803d' }}>Safe Sequence: <strong>{bankResult.safeSeq.join(' → ')}</strong></div>
                  : <div style={{ fontSize: 12, color: '#b91c1c' }}>System cannot grant all requests safely.</div>
                }
              </div>
              <table className="tbl">
                <thead><tr><th>Process</th><th>Need</th><th>Allocation</th><th>Status</th></tr></thead>
                <tbody>{PROCS.map((p, i) => (
                  <tr key={p}>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p}</td>
                    <td style={{ fontFamily: 'monospace' }}>[{bankResult.need[i].join(', ')}]</td>
                    <td style={{ fontFamily: 'monospace' }}>[{INIT_ALLOC[i].join(', ')}]</td>
                    <td><span className={`badge ${bankResult.finish[i] ? 'green' : 'red'}`}>{bankResult.finish[i] ? 'Complete' : 'Blocked'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
