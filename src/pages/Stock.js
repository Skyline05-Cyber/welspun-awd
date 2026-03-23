import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SS = { OK:'green', Low:'amber', Critical:'red' };
const CATS = ['All','Towels','Bed Linen','Yarn','Accessories','Floor Covering','Bathrobes','Other'];
const UNITS = ['metres','kg','pieces','sets','rolls','boxes'];
const STATUS_OPTS = ['OK','Low','Critical'];
const CAT_OPTS = ['Towels','Bed Linen','Yarn','Accessories','Floor Covering','Bathrobes','Other'];

export default function Stock({ stock, setStock }) {
  const [cat,    setCat]    = useState('All');
  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState(false);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  function emptyForm() {
    return { name:'', category:'Towels', qty:'', unit:'metres', location:'', reorder:'', value:'', status:'OK' };
  }

  function genSku() {
    const max = stock.length ? Math.max(...stock.map(s => parseInt(s.id.split('-')[1]) || 0)) : 0;
    return `FAB-${String(max + 1).padStart(3, '0')}`;
  }

  const items = stock.filter(s =>
    (cat === 'All' || s.category === cat) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditId(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ ...s }); setModal(true); };

  // ── Save to Supabase ──
  const save = async () => {
    if (!form.name.trim()) { alert('Fabric / Material name is required.'); return; }
    if (!form.qty)         { alert('Quantity is required.'); return; }

    setSaving(true);

    if (editId) {
      const { error } = await supabase
        .from('stock')
        .update({ ...form })
        .eq('id', editId);

      if (error) { alert('Error saving: ' + error.message); setSaving(false); return; }
      setStock(stock.map(s => s.id === editId ? { ...form, id: editId } : s));

    } else {
      const newItem = { ...form, id: genSku() };
      const { error } = await supabase
        .from('stock')
        .insert([newItem]);

      if (error) { alert('Error saving: ' + error.message); setSaving(false); return; }
      setStock([...stock, newItem]);
    }

    setSaving(false);
    setModal(false);
  };

  // ── Delete from Supabase ──
  const deleteItem = async (id) => {
    if (!window.confirm('Delete this stock item?')) return;

    const { error } = await supabase
      .from('stock')
      .delete()
      .eq('id', id);

    if (error) { alert('Error deleting: ' + error.message); return; }
    setStock(stock.filter(s => s.id !== id));
  };

  const Field = ({ field, label, type = 'text', options = null, placeholder = '' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {options ? (
        <select className="inp" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input className="inp" type={type} placeholder={placeholder}
          value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Stock Inventory</h1>
          <p>Welspun Pvt. Ltd. · Manage fabric &amp; material stock levels</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Stock</button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[
          { cls:'c1', label:'Total SKUs',    val: stock.length,                                  sub:'active fabric variants'    },
          { cls:'c2', label:'Healthy Stock', val: stock.filter(s=>s.status==='OK').length,       sub:'above reorder level'       },
          { cls:'c3', label:'Low Stock',     val: stock.filter(s=>s.status==='Low').length,      sub:'need replenishment'        },
          { cls:'c4', label:'Critical',      val: stock.filter(s=>s.status==='Critical').length, sub:'immediate action required' },
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
        <input className="inp" style={{ maxWidth: 260 }}
          placeholder="Search fabric or material…"
          value={search} onChange={e => setSearch(e.target.value)} />
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
                <th>SKU</th><th>Fabric / Material</th><th>Category</th>
                <th>Stock Qty</th><th>Reorder Pt.</th><th>Fill Level</th>
                <th>Location</th><th>Value</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => {
                const pct = s.reorder ? Math.min(100, Math.round((Number(s.qty) / (Number(s.reorder) * 3)) * 100)) : 0;
                const bc  = s.status==='Critical' ? 'var(--red)' : s.status==='Low' ? '#d97706' : 'var(--green)';
                return (
                  <tr key={s.id}>
                    <td style={{ color:'var(--muted)', fontFamily:'monospace', fontSize:12 }}>{s.id}</td>
                    <td style={{ fontWeight:500 }}>{s.name}</td>
                    <td style={{ fontSize:12 }}>{s.category}</td>
                    <td style={{ fontWeight:600 }}>{Number(s.qty).toLocaleString()} <span style={{ fontSize:11, color:'var(--muted)', fontWeight:400 }}>{s.unit}</span></td>
                    <td style={{ color:'var(--muted)', fontSize:12 }}>{s.reorder || '—'}</td>
                    <td style={{ width:130 }}>
                      <div style={{ fontSize:11, color:bc, marginBottom:3 }}>{pct}%</div>
                      <div className="prog-bar"><div className="prog-fill" style={{ width:`${pct}%`, background:bc }} /></div>
                    </td>
                    <td style={{ fontSize:12, color:'var(--muted)' }}>{s.location || '—'}</td>
                    <td style={{ fontWeight:500 }}>{s.value || '—'}</td>
                    <td><span className={`badge ${SS[s.status] || 'amber'}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost" style={{ padding:'4px 12px', fontSize:11 }}
                          onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button className="btn" style={{ padding:'4px 12px', fontSize:11, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:8 }}
                          onClick={() => deleteItem(s.id)}>🗑 Delete</button>
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
        <div style={{ position:'fixed', inset:0, background:'rgba(30,20,50,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}
          onClick={() => setModal(false)}>
          <div className="card" style={{ width:520, padding:36, maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-head)', fontSize:20, marginBottom:24, color:'var(--accent)' }}>
              {editId ? '✏️ Edit Stock Item' : '+ New Stock Item'}
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
              <div style={{ gridColumn:'1 / -1' }}>
                <Field field="name" label="Fabric / Material Name" placeholder="e.g. Terry Cloth 450 GSM" />
              </div>
              <Field field="category" label="Category"        options={CAT_OPTS} />
              <Field field="unit"     label="Unit"            options={UNITS} />
              <Field field="qty"      label="Quantity"        type="number" placeholder="e.g. 5000" />
              <Field field="reorder"  label="Reorder Point"   type="number" placeholder="e.g. 1000" />
              <Field field="location" label="Warehouse"       placeholder="e.g. WH-A1" />
              <Field field="value"    label="Value (₹)"       placeholder="e.g. ₹5,00,000" />
              <Field field="status"   label="Status"          options={STATUS_OPTS} />
            </div>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn btn-primary" style={{ flex:1, padding:'11px', opacity: saving ? 0.7 : 1 }}
                onClick={save} disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Stock Item'}
              </button>
              <button className="btn btn-ghost" style={{ flex:1, padding:'11px' }} onClick={() => setModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
