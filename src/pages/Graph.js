import React, { useState } from 'react';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252','#f59e0b','#06b6d4','#9d5ff5','#5b21b6'];

const DEFAULT_NODES = ['A','B','C','D','E','F'];
const DEFAULT_EDGES = [
  ['A','B',4],['A','C',2],['B','C',5],['B','D',10],
  ['C','E',3],['D','F',11],['E','D',4],['E','F',6],
];
const NODE_POS = { A:[60,60], B:[200,40], C:[100,160], D:[320,40], E:[240,160], F:[360,150] };

function buildAdj(nodes, edges) {
  const adj = {};
  nodes.forEach(n => adj[n] = []);
  edges.forEach(([f, t, w]) => { adj[f].push({ to: t, w }); adj[t].push({ to: f, w }); });
  return adj;
}

function bfs(adj, start) {
  const visited = new Set(), queue = [start], order = [];
  const parent = { [start]: null };
  visited.add(start);
  while (queue.length) {
    const n = queue.shift(); order.push(n);
    (adj[n] || []).forEach(({ to }) => {
      if (!visited.has(to)) { visited.add(to); parent[to] = n; queue.push(to); }
    });
  }
  return { order, parent };
}

function dfs(adj, start) {
  const visited = new Set(), order = [], parent = { [start]: null };
  function go(n) { visited.add(n); order.push(n); (adj[n] || []).forEach(({ to }) => { if (!visited.has(to)) { parent[to] = n; go(to); } }); }
  go(start);
  return { order, parent };
}

function dijkstra(nodes, adj, start) {
  const dist = {}, prev = {};
  nodes.forEach(n => dist[n] = Infinity);
  dist[start] = 0;
  const unvisited = new Set(nodes);
  while (unvisited.size) {
    const u = [...unvisited].reduce((a, b) => dist[a] < dist[b] ? a : b);
    if (dist[u] === Infinity) break;
    unvisited.delete(u);
    (adj[u] || []).forEach(({ to, w }) => {
      if (dist[u] + w < dist[to]) { dist[to] = dist[u] + w; prev[to] = u; }
    });
  }
  return { dist, prev };
}

export default function Graph() {
  const [nodes]          = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [edgeForm, setEdgeForm] = useState({ from: 'A', to: 'B', weight: 3 });
  const [start, setStart] = useState('A');
  const [output, setOutput] = useState('Select a start node and click an algorithm to run.');
  const [highlighted, setHighlighted] = useState([]);

  const adj = buildAdj(nodes, edges);

  const addEdge = () => {
    if (edgeForm.from === edgeForm.to) { alert('Self-loops not supported'); return; }
    setEdges(prev => [...prev, [edgeForm.from, edgeForm.to, +edgeForm.weight]]);
  };

  const run = (algo) => {
    let out = `Algorithm: ${algo}\nStart Node: ${start}\n${'─'.repeat(35)}\n`;
    if (algo === 'BFS') {
      const { order } = bfs(adj, start);
      setHighlighted(order);
      out += `BFS Traversal Order:\n${order.join(' → ')}\n\nNodes Visited: ${order.length} / ${nodes.length}`;
    } else if (algo === 'DFS') {
      const { order } = dfs(adj, start);
      setHighlighted(order);
      out += `DFS Traversal Order:\n${order.join(' → ')}\n\nNodes Visited: ${order.length} / ${nodes.length}`;
    } else {
      const { dist, prev } = dijkstra(nodes, adj, start);
      setHighlighted(nodes.filter(n => dist[n] < Infinity));
      out += `Shortest Paths from ${start}:\n\n`;
      nodes.filter(n => n !== start).forEach(n => {
        let path = [], cur = n;
        while (cur !== undefined) { path.unshift(cur); cur = prev[cur]; }
        out += `To ${n}:  dist = ${dist[n] === Infinity ? '∞ (unreachable)' : dist[n]}  |  path: ${dist[n] === Infinity ? 'unreachable' : path.join(' → ')}\n`;
      });
    }
    setOutput(out);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Graph Algorithms</h1><p>Welspun AWD · BFS · DFS · Dijkstra Shortest Path</p></div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-title">Configuration</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
          {[['from','From',nodes],['to','To',nodes]].map(([k, lbl, opts]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label">{lbl} Node</label>
              <select className="inp" value={edgeForm[k]} onChange={e => setEdgeForm(f => ({ ...f, [k]: e.target.value }))}>
                {opts.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Weight</label>
            <input className="inp" style={{ width: 70 }} type="number" min={1} value={edgeForm.weight}
              onChange={e => setEdgeForm(f => ({ ...f, weight: e.target.value }))} />
          </div>
          <button className="btn btn-ghost" onClick={addEdge}>+ Add Edge</button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Start Node</label>
            <select className="inp" value={start} onChange={e => setStart(e.target.value)}>
              {nodes.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => run('BFS')}>▶ Run BFS</button>
          <button className="btn btn-primary" onClick={() => run('DFS')}>▶ Run DFS</button>
          <button className="btn btn-primary" onClick={() => run('Dijkstra')}>▶ Run Dijkstra</button>
          <button className="btn btn-ghost" onClick={() => { setHighlighted([]); setOutput('Cleared.'); }}>Clear</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Graph SVG */}
        <div className="card">
          <div className="section-title">Graph Visualization</div>
          <svg width="100%" viewBox="0 0 420 220" style={{ background: 'var(--bg3)', borderRadius: 8 }}>
            <defs>
              <marker id="gArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#8b7aaa" strokeWidth="1.5" />
              </marker>
            </defs>
            {edges.map(([f, t, w], i) => {
              const [x1, y1] = NODE_POS[f] || [0, 0];
              const [x2, y2] = NODE_POS[t] || [0, 0];
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#gArr)" />
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" fill="#8b7aaa" fontSize={10} fontFamily="system-ui">{w}</text>
                </g>
              );
            })}
            {nodes.map((n, i) => {
              const [x, y] = NODE_POS[n] || [i * 60, 80];
              const isHighlighted = highlighted.includes(n);
              const isStart = n === start;
              return (
                <g key={n}>
                  <circle cx={x} cy={y} r={22}
                    fill={isHighlighted ? COLORS[highlighted.indexOf(n) % COLORS.length] : 'var(--bg3)'}
                    stroke={isStart ? '#fff' : 'var(--border)'}
                    strokeWidth={isStart ? 3 : 1} />
                  <text x={x} y={y + 5} textAnchor="middle"
                    fill={isHighlighted ? '#fff' : 'var(--text)'}
                    fontSize={13} fontWeight={700} fontFamily="system-ui">{n}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
            Nodes: {nodes.length} · Edges: {edges.length} · Highlighted = traversal order
          </div>
        </div>

        {/* Edge List */}
        <div className="card">
          <div className="section-title">Edge List (Weighted)</div>
          <table className="tbl">
            <thead><tr><th>From</th><th>To</th><th>Weight</th></tr></thead>
            <tbody>
              {edges.map(([f, t, w], i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: COLORS[nodes.indexOf(f) % COLORS.length] }}>{f}</td>
                  <td style={{ fontWeight: 700, color: COLORS[nodes.indexOf(t) % COLORS.length] }}>{t}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Output */}
      <div className="card">
        <div className="section-title">Algorithm Output</div>
        <div style={{ background: '#1e1432', color: '#c4b5fd', fontFamily: "'Courier New', monospace", fontSize: 12, borderRadius: 8, padding: 14, whiteSpace: 'pre-wrap', minHeight: 80, maxHeight: 240, overflowY: 'auto' }}>
          {output}
        </div>
      </div>

      {/* Complexity */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="section-title">Time &amp; Space Complexity</div>
        <table className="tbl">
          <thead><tr><th>Algorithm</th><th>Time Complexity</th><th>Space Complexity</th><th>Use Case</th></tr></thead>
          <tbody>
            {[
              ['BFS','O(V + E)','O(V)','Shortest path (unweighted), level-order traversal'],
              ['DFS','O(V + E)','O(V)','Cycle detection, topological sort, connected components'],
              ['Dijkstra','O((V + E) log V)','O(V)','Shortest path in weighted graphs (non-negative weights)'],
            ].map(([a, t, s, u]) => (
              <tr key={a}>
                <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{a}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--green)' }}>{t}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--blue)' }}>{s}</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
