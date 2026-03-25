import React, { useState } from 'react';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252','#f59e0b','#06b6d4','#9d5ff5','#5b21b6'];

const DEFAULT_PROCESSES = [
  { id: 'P1', arrival: 0, burst: 6, priority: 2 },
  { id: 'P2', arrival: 2, burst: 4, priority: 1 },
  { id: 'P3', arrival: 4, burst: 2, priority: 3 },
  { id: 'P4', arrival: 6, burst: 3, priority: 2 },
];

function fcfs(procs) {
  const p = [...procs].sort((a, b) => a.arrival - b.arrival);
  const seg = [], stats = [];
  let t = 0;
  for (const proc of p) {
    if (t < proc.arrival) t = proc.arrival;
    seg.push({ id: proc.id, start: t, end: t + proc.burst, color: COLORS[p.indexOf(proc) % COLORS.length] });
    stats.push({ id: proc.id, wait: t - proc.arrival, turn: t - proc.arrival + proc.burst });
    t += proc.burst;
  }
  return { seg, stats };
}

function sjf(procs) {
  const p = [...procs].sort((a, b) => a.arrival - b.arrival);
  const done = [], stats = [];
  let t = 0;
  while (done.length < p.length) {
    const avail = p.filter(x => x.arrival <= t && !done.includes(x.id)).sort((a, b) => a.burst - b.burst);
    if (!avail.length) { t++; continue; }
    const proc = avail[0];
    done.push(proc.id);
    stats.push({ id: proc.id, wait: t - proc.arrival, turn: t - proc.arrival + proc.burst, start: t, end: t + proc.burst, color: COLORS[p.indexOf(proc) % COLORS.length] });
    t += proc.burst;
  }
  return { seg: stats.map(s => ({ id: s.id, start: s.start, end: s.end, color: s.color })), stats };
}

function roundRobin(procs, q) {
  const p = [...procs].sort((a, b) => a.arrival - b.arrival).map(x => ({ ...x, rem: x.burst }));
  const seg = [], finishMap = {};
  let t = 0, queue = [], i = 0;
  while (true) {
    while (i < p.length && p[i].arrival <= t) queue.push(p[i++]);
    if (!queue.length) { if (i < p.length) { t = p[i].arrival; continue; } break; }
    const proc = queue.shift();
    const run = Math.min(q, proc.rem);
    seg.push({ id: proc.id, start: t, end: t + run, color: COLORS[p.indexOf(proc) % COLORS.length] });
    t += run; proc.rem -= run;
    while (i < p.length && p[i].arrival <= t) queue.push(p[i++]);
    if (proc.rem > 0) queue.push(proc);
    else finishMap[proc.id] = t;
  }
  const stats = p.map(proc => ({ id: proc.id, wait: finishMap[proc.id] - proc.arrival - proc.burst, turn: finishMap[proc.id] - proc.arrival }));
  return { seg, stats };
}

export default function Scheduling() {
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [algo, setAlgo] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [form, setForm] = useState({ id: '', arrival: 0, burst: 1, priority: 1 });
  const [result, setResult] = useState(null);

  const addProcess = () => {
    if (!form.id.trim()) return;
    setProcesses(prev => [...prev, { ...form, arrival: +form.arrival, burst: +form.burst, priority: +form.priority }]);
    setForm({ id: '', arrival: 0, burst: 1, priority: 1 });
  };

  const removeProcess = (id) => setProcesses(prev => prev.filter(p => p.id !== id));

  const runSimulation = () => {
    if (!processes.length) return;
    if (algo === 'FCFS') setResult(fcfs(processes));
    else if (algo === 'SJF') setResult(sjf(processes));
    else setResult(roundRobin(processes, quantum));
  };

  const maxT = result ? Math.max(...result.seg.map(s => s.end)) : 1;
  const avgWait = result ? (result.stats.reduce((a, s) => a + s.wait, 0) / result.stats.length).toFixed(1) : null;
  const avgTurn = result ? (result.stats.reduce((a, s) => a + s.turn, 0) / result.stats.length).toFixed(1) : null;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Process Scheduling</h1><p>Welspun AWD · FCFS · SJF · Round Robin</p></div>
        <button className="btn btn-primary" onClick={runSimulation}>▶ Run Simulation</button>
      </div>

      {/* Process Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">Process Table</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[['id','Process ID','text'],['arrival','Arrival','number'],['burst','Burst','number'],['priority','Priority','number']].map(([k, lbl, type]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label">{lbl}</label>
              <input className="inp" style={{ width: 90 }} type={type} value={form[k]}
                onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={addProcess}>+ Add</button>
          <button className="btn btn-ghost" onClick={() => setProcesses(DEFAULT_PROCESSES)}>Reset</button>
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Arrival</th><th>Burst</th><th>Priority</th><th>Action</th></tr></thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.id}>
                <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.id}</td>
                <td>{p.arrival}</td><td>{p.burst}</td><td>{p.priority}</td>
                <td>
                  <button className="btn" style={{ padding: '4px 10px', fontSize: 11, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6 }}
                    onClick={() => removeProcess(p.id)}>✕ Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Algorithm Settings */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">Algorithm</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Algorithm</label>
            <select className="inp" value={algo} onChange={e => setAlgo(e.target.value)}>
              <option value="FCFS">FCFS – First Come First Serve</option>
              <option value="SJF">SJF – Shortest Job First</option>
              <option value="RR">Round Robin</option>
            </select>
          </div>
          {algo === 'RR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label">Time Quantum</label>
              <input className="inp" style={{ width: 80 }} type="number" min={1} value={quantum}
                onChange={e => setQuantum(+e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">Gantt Chart</div>
            <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', background: 'var(--bg3)' }}>
              {result.seg.map((s, i) => (
                <div key={i} title={`${s.id}: ${s.start}→${s.end}`}
                  style={{ width: `${((s.end - s.start) / maxT * 100).toFixed(1)}%`, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, minWidth: 24 }}>
                  {s.id}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              {result.seg.map((s, i) => (
                <span key={i} style={{ width: `${((s.end - s.start) / maxT * 100).toFixed(1)}%`, minWidth: 24, textAlign: 'center' }}>{s.start}</span>
              ))}
              <span>{maxT}</span>
            </div>
          </div>

          <div className="card">
            <div className="section-title">Results</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['Avg Wait Time', avgWait + ' units'], ['Avg Turnaround', avgTurn + ' units']].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)' }}>{l}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--text)', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <table className="tbl">
              <thead><tr><th>Process</th><th>Wait Time</th><th>Turnaround Time</th></tr></thead>
              <tbody>
                {result.stats.map(s => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{s.id}</td>
                    <td>{s.wait} units</td>
                    <td>{s.turn} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
