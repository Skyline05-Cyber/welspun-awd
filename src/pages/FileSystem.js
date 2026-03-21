import React, { useState } from 'react';

const INITIAL_TREE = {
  name: '/', type: 'dir', children: [
    { name: 'home', type: 'dir', children: [
      { name: 'welspun', type: 'dir', children: [
        { name: 'orders.csv',  type: 'file', size: '12 KB',  inode: 101, perm: 'rw-r--r--' },
        { name: 'stock.json', type: 'file', size: '8 KB',   inode: 102, perm: 'rw-r--r--' },
        { name: 'reports', type: 'dir', children: [
          { name: 'q1_2026.pdf', type: 'file', size: '2.1 MB', inode: 103, perm: 'rw-------' },
        ]},
      ]},
    ]},
    { name: 'etc', type: 'dir', children: [
      { name: 'config.yaml', type: 'file', size: '1 KB', inode: 201, perm: 'rw-r--r--' },
    ]},
    { name: 'var', type: 'dir', children: [
      { name: 'logs', type: 'dir', children: [
        { name: 'app.log', type: 'file', size: '4.5 MB', inode: 301, perm: 'rw-r-----' },
      ]},
    ]},
  ],
};

function collectFiles(node, files = []) {
  if (node.type === 'file') files.push(node);
  (node.children || []).forEach(c => collectFiles(c, files));
  return files;
}

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const indent = depth * 18;
  if (node.type === 'dir') {
    return (
      <div>
        <div style={{ paddingLeft: indent, display: 'flex', alignItems: 'center', gap: 6, padding: `3px 0 3px ${indent}px`, cursor: 'pointer' }}
          onClick={() => setOpen(o => !o)}>
          <span style={{ fontSize: 13 }}>{open ? '📂' : '📁'}</span>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 13 }}>{node.name}/</span>
        </div>
        {open && (node.children || []).map((c, i) => <TreeNode key={i} node={c} depth={depth + 1} />)}
      </div>
    );
  }
  return (
    <div style={{ paddingLeft: indent, display: 'flex', alignItems: 'center', gap: 6, padding: `3px 0 3px ${indent}px` }}>
      <span style={{ fontSize: 13 }}>📄</span>
      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{node.name}</span>
      <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>{node.size} · inode:{node.inode}</span>
    </div>
  );
}

export default function FileSystem() {
  const [tree, setTree] = useState(INITIAL_TREE);
  const [nextInode, setNextInode] = useState(400);
  const [form, setForm] = useState({ name: 'newfile.txt', type: 'file', size: '1 KB', perm: 'rw-r--r--' });
  const [output, setOutput] = useState('$ _');

  const allFiles = collectFiles(tree);

  const createEntry = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, inode: nextInode, children: form.type === 'dir' ? [] : undefined };
    setTree(t => ({ ...t, children: [...t.children, entry] }));
    setNextInode(n => n + 1);
    setOutput(`Created ${form.type}: /${form.name}\nInode: ${nextInode} · Permissions: ${form.perm}`);
  };

  const runCmd = (cmd) => {
    let out = `$ ${cmd}\n`;
    if (cmd.startsWith('ls')) {
      out += tree.children.map(c =>
        `${c.perm || 'drwxr-xr-x'}  1 welspun welspun  ${c.size || '4096'}  Mar 2026  ${c.name}${c.type === 'dir' ? '/' : ''}`
      ).join('\n');
    } else if (cmd.startsWith('df')) {
      out += `Filesystem      Size  Used Avail Use%  Mounted on\n/dev/sda1       100G   18G   82G  18%   /\ntmpfs           3.9G  256M  3.6G   7%   /tmp`;
    } else if (cmd.includes('find')) {
      out += allFiles.filter(f => f.name.endsWith('.csv') || f.name.endsWith('.json')).map(f => '/' + f.name).join('\n') || 'No results';
    } else if (cmd.includes('stat')) {
      const f = allFiles[0];
      out += `File: /home/welspun/${f.name}\nSize: 12288\t\tBlocks: 24\tIO Block: 4096\nInode: ${f.inode}\tLinks: 1\nAccess: ${f.perm}\nModify: 2026-03-21 09:14:22`;
    } else if (cmd.startsWith('du')) {
      out += allFiles.map(f => `${f.size}\t/${f.name}`).join('\n');
    }
    setOutput(out);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>File System Simulation</h1><p>Welspun AWD · Directory tree, inodes &amp; file operations</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Tree */}
        <div className="card">
          <div className="section-title">Directory Tree</div>
          <div style={{ fontFamily: "'Courier New', monospace", lineHeight: 1.8, background: 'var(--bg3)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <TreeNode node={tree} />
          </div>
          <div className="section-title">Create New Entry</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 120 }}>
              <label className="form-label">Name</label>
              <input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label">Type</label>
              <select className="inp" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="file">File</option>
                <option value="dir">Directory</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label">Size</label>
              <input className="inp" style={{ width: 70 }} value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={createEntry}>+ Create</button>
          </div>
        </div>

        {/* Inode Table */}
        <div className="card">
          <div className="section-title">Inode Table</div>
          <table className="tbl">
            <thead><tr><th>Inode</th><th>File Name</th><th>Size</th><th>Permissions</th><th>Type</th></tr></thead>
            <tbody>
              {allFiles.map(f => (
                <tr key={f.inode}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{f.inode}</td>
                  <td style={{ fontWeight: 600 }}>{f.name}</td>
                  <td>{f.size}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{f.perm}</td>
                  <td><span className="badge blue">REG</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shell Operations */}
      <div className="card">
        <div className="section-title">Shell Operations</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {[
            ['ls -la /',        'ls -la /'],
            ['df -h',           'df -h'],
            ['find / -name *.csv', 'find *.csv'],
            ['stat orders.csv', 'stat /home/welspun/orders.csv'],
            ['du -sh *',        'du -sh *'],
          ].map(([label, cmd]) => (
            <button key={label} className="btn btn-ghost" style={{ fontSize: 11, fontFamily: 'monospace' }}
              onClick={() => runCmd(cmd)}>{label}</button>
          ))}
        </div>
        <div style={{
          background: '#1e1432', color: '#c4b5fd', fontFamily: "'Courier New', monospace",
          fontSize: 12, borderRadius: 8, padding: 14, minHeight: 80, whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto',
        }}>
          {output}
        </div>
      </div>
    </div>
  );
}
