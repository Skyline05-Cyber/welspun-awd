import React, { useState } from 'react';

const SS = { OK:'green', Low:'amber', Critical:'red' };
const CATS = ['All','Towels','Bed Linen','Yarn','Accessories','Floor Covering','Bathrobes','Other'];
const CAT_OPTS  = ['Towels','Bed Linen','Yarn','Accessories','Floor Covering','Bathrobes','Other'];
const UNIT_OPTS = ['metres','kg','pieces','sets','rolls','boxes'];
const STAT_OPTS = ['OK','Low','Critical'];

function genSku(stock) {
  const max = stock.length
    ? Math.max(...stock.map(s => parseInt(s.id.replace('FAB-','')) || 0))
    : 0;
  return `FAB-${String(max + 1).padStart(3,'0')}`;
}

export default function Stock({ stock, setStock }) {
  const [cat,    setCat]    = useState('All');
  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState(false);
  const [editId, setEditId] = useState(null);

  // flat state — fixes cursor jumping bug
  const [name,     setName]     = useState('');
  const [category, setCategory] = useState('Towels');
  const [qty,      setQty]      = useState('');
  const [unit,     setUnit]     = useState('metres');
  const [location, setLocation] = useState('');
  const [reorder,  setReorder]  = useState('');
  const [value,    setValue]    = useState('');
  const [status,   setStatus]   = useState('OK');

  const items = stock.filter(s =>
    (cat === 'All' || s.category === cat) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setName(''); setCategory('Towels'); setQty(''); setUnit('metres');
    setLocation(''); setReorder(''); setValue(''); setStatus('OK');
    setModal(true);
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setName(s.name||''); setCategory(s.category||'Towels'); setQty(s.qty||'');
    setUnit(s.unit||'metres'); setLocation(s.location||''); setReorder(s.reorder||'');
    setValue(s.value||''); setStatus(s.status||'OK');
    setModal(true);
  };

  const save = () => {
    if (!name.trim()) { alert('Fabric / Material name is required.'); return; }
    if (!qty)         { alert('Quantity is required.'); return; }
    const rec = { name, category, qty, unit, location, reorder, value, status };
    if (editId) {
      setStock(stock.map(s => s.id === editId ? { ...rec, id: editId } : s));
    } else {
      setStock([...stock, { ...rec, id: genSku(stock) }]);
    }
    setModal(false);
  };

  const deleteItem = (id) => {
    if (window.confirm('Delete this stock item?')) setStock(stock.filter(s => s.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Stock Inventory</h1>
          <p>Welspun Pvt. Ltd. · Manage fabric & material stock levels</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Stock</button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom:20 }}>
        {[
          { cls:'c1', label:'Total SKUs',    val:stock.length,                                  sub:'active fabric variants'    },
          { cls:'c2', label:'Healthy Stock', val:stock.filter(s=>s.status==='OK').length,       sub:'above reorder level'       },
          { cls:'c3', label:'Low Stock',     val:stock.filter(s=>s.status==='Low').length,      sub:'need replenishment'        },
          { cls:'c4', label:'Critical',      val:stock.filter(s=>s.status==='Critical').length, sub:'immediate action required' },
        ].map(k => (
          <div className={`stat-card ${k.cls}`} key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.val > 0 ? k.val : '—'}</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          className="inp" style={{ maxWidth:260 }}
          placeholder="Search fabric or material…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        {CATS.map(c => (
          <button key={c} className="btn" onClick={() => setCat(c)} style={{
            padding:'6px 14px', fontSize:12,
            background: cat===c ? 'var(--accent)' : 'var(--bg3)',
            color: cat===c ? '#fff' : 'var(--muted)',
            border: '1px solid var(--border)',
            fontWeight: cat===c ? 700 : 400,
          }}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {stock.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'72px 20px', gap:10 }}>
            <span style={{ fontSize:48 }}>🏭</span>
            <p style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:17, color:'var(--text2)' }}>No stock items yet</p>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Click the button below to add your first stock item</p>
            <button className="btn btn-primary" style={{ marginTop:8 }} onClick={openAdd}>+ Add First Item</button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 20px', gap:8 }}>
            <span style={{ fontSize:36 }}>🔍</span>
            <p style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--text2)' }}>No matching items</p>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Try changing the category or search term</p>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>SKU</th><th>Fabric / Material</th><th>Category</th><th>Stock Qty</th>
                <th>Reorder Pt.</th><th>Fill Level</th><th>Location</th><th>Value</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => {
                const pct = s.reorder ? Math.min(100, Math.round((Number(s.qty)/(Number(s.reorder)*3))*100)) : 0;
                const bc  = s.status==='Critical' ? 'var(--red)' : s.status==='Low' ? '#d97706' : 'var(--green)';
                return (
                  <tr key={s.id}>
                    <td style={{ color:'var(--muted)', fontFamily:'monospace', fontSize:12 }}>{s.id}</td>
                    <td style={{ fontWeight:500 }}>{s.name}</td>
                    <td style={{ fontSize:12 }}>{s.category}</td>
                    <td style={{ fontWeight:600 }}>{Number(s.qty).toLocaleString()} <span style={{ fontSize:11, color:'var(--muted)', fontWeight:400 }}>{s.unit}</span></td>
                    <td style={{ color:'var(--muted)', fontSize:12 }}>{s.reorder||'—'}</td>
                    <td style={{ width:130 }}>
                      <div style={{ fontSize:11, color:bc, marginBottom:3 }}>{pct}%</div>
                      <div className="prog-bar"><div className="prog-fill" style={{ width:`${pct}%`, background:bc }}/></div>
                    </td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{s.location||'—'}</td>
                    <td style={{ fontWeight:500 }}>{s.value||'—'}</td>
                    <td><span className={`badge ${SS[s.status]||'amber'}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost" style={{ padding:'4px 12px', fontSize:11 }} onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button className="btn" style={{ padding:'4px 12px', fontSize:11, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:8 }} onClick={() => deleteItem(s.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(30,20,50,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }} onClick={() => setModal(false)}>
          <div className="card" style={{ width:540, padding:36, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-head)', fontSize:20, marginBottom:24, color:'var(--accent)' }}>
              {editId ? '✏️ Edit Stock Item' : '+ New Stock Item'}
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 20px' }}>
              <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                <label className="form-label">Fabric / Material Name</label>
                <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Terry Cloth 450 GSM" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="inp" value={category} onChange={e => setCategory(e.target.value)}>
                  {CAT_OPTS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="inp" value={unit} onChange={e => setUnit(e.target.value)}>
                  {UNIT_OPTS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="inp" type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div className="form-group">
                <label className="form-label">Reorder Point</label>
                <input className="inp" type="number" value={reorder} onChange={e => setReorder(e.target.value)} placeholder="e.g. 1000" />
              </div>
              <div className="form-group">
                <label className="form-label">Warehouse Location</label>
                <input className="inp" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. WH-A1" />
              </div>
              <div className="form-group">
                <label className="form-label">Value (₹)</label>
                <input className="inp" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. ₹5,00,000" />
              </div>
              <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                <label className="form-label">Status</label>
                <select className="inp" value={status} onChange={e => setStatus(e.target.value)}>
                  {STAT_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn btn-primary" style={{ flex:1, padding:'12px' }} onClick={save}>
                {editId ? 'Save Changes' : 'Add Stock Item'}
              </button>
              <button className="btn btn-ghost" style={{ flex:1, padding:'12px' }} onClick={() => setModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}