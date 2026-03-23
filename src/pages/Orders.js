import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SC         = { 'In Transit':'blue','Dispatched':'green','Processing':'amber','Completed':'green','On Hold':'red' };
const STATUSES   = ['All','In Transit','Dispatched','Processing','Completed','On Hold'];
const CATEGORIES = ['Terry Towels','Bed Linen','Yarn','Bathrobes','Floor Covering','Accessories','Other'];
const STATUSES2  = ['Processing','In Transit','Dispatched','Completed','On Hold'];

// ── Field component OUTSIDE Orders to prevent re-mount on every keystroke ──
function Field({ field, label, type, options, form, setForm }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {options ? (
        <select
          className="inp"
          value={form[field]}
          onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className="inp"
          type={type || 'text'}
          value={form[field]}
          onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        />
      )}
    </div>
  );
}

function emptyForm() {
  return {
    customer: '', fabric: '', qty: '', category: 'Terry Towels',
    plant: '', value: '', status: 'Processing',
    date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
  };
}

function genId(orders) {
  const max = orders.length ? Math.max(...orders.map(o => parseInt(o.id.split('-')[1]) || 0)) : 1000;
  return `ORD-${max + 1}`;
}

export default function Orders({ orders, setOrders }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState(false);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) ||
     o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setEditId(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (o) => { setEditId(o.id); setForm({ ...o }); setModal(true); };

  const save = async () => {
    if (!form.customer.trim()) { alert('Customer name is required.'); return; }
    if (!form.fabric.trim())   { alert('Fabric type is required.');   return; }
    if (!form.qty)             { alert('Quantity is required.');       return; }

    setSaving(true);

    if (editId) {
      const { error } = await supabase.from('orders').update({ ...form }).eq('id', editId);
      if (error) { alert('Error: ' + error.message); setSaving(false); return; }
      setOrders(orders.map(o => o.id === editId ? { ...form, id: editId } : o));
    } else {
      const newOrder = { ...form, id: genId(orders) };
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) { alert('Error: ' + error.message); setSaving(false); return; }
      setOrders(prev => [...prev, newOrder]);
    }

    setSaving(false);
    setModal(false);
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Order Management</h1>
          <p>Welspun Pvt. Ltd. · Add and manage textile export orders</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Order</button>
      </div>

      {/* Summary Pills */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          { label:'Total Orders', val: orders.length,                                     c:'var(--accent)' },
          { label:'In Transit',   val: orders.filter(o=>o.status==='In Transit').length,  c:'var(--blue)'   },
          { label:'Processing',   val: orders.filter(o=>o.status==='Processing').length,  c:'var(--accent)' },
          { label:'Completed',    val: orders.filter(o=>o.status==='Completed').length,   c:'var(--green)'  },
          { label:'On Hold',      val: orders.filter(o=>o.status==='On Hold').length,     c:'var(--red)'    },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:'12px 20px', display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:22, fontWeight:800, fontFamily:'var(--font-head)', color:s.c }}>{s.val}</span>
            <span style={{ color:'var(--muted)', fontSize:12 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input className="inp" style={{ maxWidth:260 }}
          placeholder="Search by order ID or customer…"
          value={search}
          onChange={e => setSearch(e.target.value)} />
        {STATUSES.map(s => (
          <button key={s} className="btn" onClick={() => setFilter(s)} style={{
            padding:'6px 14px', fontSize:12,
            background: filter===s ? 'var(--accent)' : 'var(--bg3)',
            color:      filter===s ? '#fff' : 'var(--muted)',
            border:     '1px solid var(--border)',
            fontWeight: filter===s ? 700 : 400,
          }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'72px 20px', gap:10 }}>
            <span style={{ fontSize:48 }}>📦</span>
            <p style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:17, color:'var(--text2)' }}>No orders yet</p>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Click the button below to add your first order</p>
            <button className="btn btn-primary" style={{ marginTop:8 }} onClick={openAdd}>+ Add First Order</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 20px', gap:8 }}>
            <span style={{ fontSize:36 }}>🔍</span>
            <p style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--text2)' }}>No matching orders</p>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Try changing the filter or search term</p>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Fabric Type</th><th>Category</th>
                <th>Qty (pcs)</th><th>Value</th><th>Plant</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ color:'var(--accent)', fontWeight:700, fontFamily:'var(--font-head)' }}>{o.id}</td>
                  <td style={{ fontWeight:500 }}>{o.customer}</td>
                  <td style={{ color:'var(--muted)' }}>{o.fabric}</td>
                  <td style={{ fontSize:12 }}>{o.category || '—'}</td>
                  <td style={{ fontWeight:600 }}>{Number(o.qty).toLocaleString()}</td>
                  <td>{o.value || '—'}</td>
                  <td style={{ fontSize:12, color:'var(--muted)' }}>{o.plant || '—'}</td>
                  <td><span className={`badge ${SC[o.status] || 'amber'}`}>{o.status}</span></td>
                  <td style={{ color:'var(--muted)', fontSize:12 }}>{o.date}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost" style={{ padding:'4px 12px', fontSize:11 }}
                        onClick={() => openEdit(o)}>✏️ Edit</button>
                      <button className="btn" style={{ padding:'4px 12px', fontSize:11, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:8 }}
                        onClick={() => deleteOrder(o.id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
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
              {editId ? '✏️ Edit Order' : '+ New Order'}
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
              <Field field="customer" label="Customer Name"   form={form} setForm={setForm} />
              <Field field="fabric"   label="Fabric Type"     form={form} setForm={setForm} />
              <Field field="qty"      label="Quantity (pcs)"  form={form} setForm={setForm} type="number" />
              <Field field="category" label="Category"        form={form} setForm={setForm} options={CATEGORIES} />
              <Field field="plant"    label="Plant Location"  form={form} setForm={setForm} />
              <Field field="value"    label="Order Value (₹)" form={form} setForm={setForm} />
              <Field field="status"   label="Status"          form={form} setForm={setForm} options={STATUSES2} />
              <Field field="date"     label="Order Date"      form={form} setForm={setForm} />
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn btn-primary" style={{ flex:1, padding:'11px', opacity: saving ? 0.7 : 1 }}
                onClick={save} disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Order'}
              </button>
              <button className="btn btn-ghost" style={{ flex:1, padding:'11px' }}
                onClick={() => setModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
