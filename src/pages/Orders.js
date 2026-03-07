import React, { useState } from 'react';

const SC = { 'In Transit':'blue','Dispatched':'green','Processing':'amber','Completed':'green','On Hold':'red' };
const STATUSES = ['All','In Transit','Dispatched','Processing','Completed','On Hold'];
const CATEGORIES = ['Terry Towels','Bed Linen','Yarn','Bathrobes','Floor Covering','Accessories','Other'];

export default function Orders({ orders, setOrders }) {
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm());

  function emptyForm() {
    return {
      customer: '', fabric: '', qty: '', category: 'Terry Towels',
      plant: '', value: '', status: 'Processing',
      date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    };
  }

  function genId() {
    const max = orders.length ? Math.max(...orders.map(o => parseInt(o.id.split('-')[1]) || 0)) : 1000;
    return `ORD-${max + 1}`;
  }

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) ||
     o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setModal(true);
  };

  const openEdit = (o) => {
    setEditId(o.id);
    setForm({ ...o });
    setModal(true);
  };

  const save = () => {
    if (!form.customer.trim()) { alert('Customer name is required.'); return; }
    if (!form.fabric.trim())   { alert('Fabric type is required.'); return; }
    if (!form.qty)             { alert('Quantity is required.'); return; }

    if (editId) {
      setOrders(orders.map(o => o.id === editId ? { ...form, id: editId } : o));
    } else {
      setOrders([...orders, { ...form, id: genId() }]);
    }
    setModal(false);
  };

  const deleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const Field = ({ field, label, type = 'text', options = null }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {options ? (
        <select className="inp" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className="inp" type={type}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
        />
      )}
    </div>
  );

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
          { label:'Total Orders',  val: orders.length,                                          c:'var(--accent)'  },
          { label:'In Transit',    val: orders.filter(o=>o.status==='In Transit').length,        c:'var(--blue)'    },
          { label:'Processing',    val: orders.filter(o=>o.status==='Processing').length,        c:'var(--accent)'  },
          { label:'Completed',     val: orders.filter(o=>o.status==='Completed').length,         c:'var(--green)'   },
          { label:'On Hold',       val: orders.filter(o=>o.status==='On Hold').length,           c:'var(--red)'     },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:'12px 20px', display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:22, fontWeight:800, fontFamily:'var(--font-head)', color:s.c }}>{s.val}</span>
            <span style={{ color:'var(--muted)', fontSize:12 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          className="inp" style={{ maxWidth:260 }}
          placeholder="Search by order ID or customer…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        {STATUSES.map(s => (
          <button key={s} className="btn" onClick={() => setFilter(s)} style={{
            padding:'6px 14px', fontSize:12,
            background: filter===s ? 'var(--accent)' : 'var(--bg3)',
            color: filter===s ? '#fff' : 'var(--muted)',
            border: '1px solid var(--border)',
            fontWeight: filter===s ? 700 : 400,
          }}>{s}</button>
        ))}
      </div>

      {/* Table / Empty State */}
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
                      <button
                        className="btn btn-ghost"
                        style={{ padding:'4px 12px', fontSize:11 }}
                        onClick={() => openEdit(o)}
                      >✏️ Edit</button>
                      <button
                        className="btn"
                        style={{ padding:'4px 12px', fontSize:11, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:8 }}
                        onClick={() => deleteOrder(o.id)}
                      >🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(30,20,50,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}
          onClick={() => setModal(false)}
        >
          <div
            className="card"
            style={{ width:520, padding:36, maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontFamily:'var(--font-head)', fontSize:20, marginBottom:24, color:'var(--accent)' }}>
              {editId ? '✏️ Edit Order' : '+ New Order'}
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
              <Field field="customer" label="Customer Name" />
              <Field field="fabric"   label="Fabric Type" />
              <Field field="qty"      label="Quantity (pcs)" type="number" />
              <Field field="category" label="Category" options={CATEGORIES} />
              <Field field="plant"    label="Plant Location" />
              <Field field="value"    label="Order Value (₹)" />
              <Field field="status"   label="Status" options={['Processing','In Transit','Dispatched','Completed','On Hold']} />
              <Field field="date"     label="Order Date" />
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn btn-primary" style={{ flex:1, padding:'11px' }} onClick={save}>
                {editId ? 'Save Changes' : 'Create Order'}
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
