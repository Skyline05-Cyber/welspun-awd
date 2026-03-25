import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252'];
const STATUS_COLOR = { 'In Transit':'blue','Dispatched':'green','Processing':'amber','Completed':'green','On Hold':'red' };

const emptyBox = { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', gap:8 };
const emptyIcon = { fontSize:36 };
const emptyText = { fontFamily:'var(--font-head)', fontWeight:700, color:'var(--text2)', fontSize:15 };
const emptyHint = { color:'var(--muted)', fontSize:12 };

export default function Dashboard({ orders=[], stock=[] }) {
  const totalQty      = orders.reduce((s,o)=>s+(Number(o.qty)||0),0);
  const activeOrders  = orders.filter(o=>o.status!=='Completed').length;
  const pendingDispatch = orders.filter(o=>o.status==='In Transit'||o.status==='Processing').length;

  const catMap = {};
  orders.forEach(o=>{ if(o.category) catMap[o.category]=(catMap[o.category]||0)+1; });
  const categoryData = Object.entries(catMap).map(([name,value])=>({name,value}));
  const recentOrders = [...orders].reverse().slice(0,5);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Dashboard Overview</h1><p>Welspun Pvt. Ltd. · AWD · Live Summary</p></div>
      </div>

      <div className="stat-grid">
        <div className="stat-card c1">
          <div className="label">Total Quantity (Orders)</div>
          <div className="value">{totalQty>0?totalQty.toLocaleString():'—'}</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>units across all orders</div>
        </div>
        <div className="stat-card c2">
          <div className="label">Active Orders</div>
          <div className="value">{activeOrders>0?activeOrders:'—'}</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>not yet completed</div>
        </div>
        <div className="stat-card c3">
          <div className="label">Stock Items</div>
          <div className="value">{stock.length>0?stock.length:'—'}</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>SKUs in inventory</div>
        </div>
        <div className="stat-card c4">
          <div className="label">Pending Dispatch</div>
          <div className="value">{pendingDispatch>0?pendingDispatch:'—'}</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>in transit or processing</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="section-title">Order Category Mix</div>
          {categoryData.length>0?(
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:'var(--text)',fontSize:11}}>{v}</span>}/>
                <Tooltip contentStyle={{background:'#fff',border:'1px solid #d8d0e8',borderRadius:10,fontSize:12,boxShadow:'0 4px 24px rgba(124,58,237,.14)'}}/>
              </PieChart>
            </ResponsiveContainer>
          ):(
            <div style={emptyBox}>
              <span style={emptyIcon}>🥧</span>
              <p style={emptyText}>No categories yet</p>
              <p style={emptyHint}>Add orders with a category to see the chart</p>
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-title">Stock Status</div>
          {stock.length>0?(
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                {label:'OK',color:'#22c77a',bg:'#dcfce7',count:stock.filter(s=>s.status==='OK').length},
                {label:'Low',color:'#d97706',bg:'#fef3c7',count:stock.filter(s=>s.status==='Low').length},
                {label:'Critical',color:'#dc2626',bg:'#fee2e2',count:stock.filter(s=>s.status==='Critical').length},
              ].map(s=>(
                <div key={s.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:s.bg,borderRadius:8}}>
                  <span style={{fontWeight:600,color:s.color,fontSize:13}}>{s.label}</span>
                  <span style={{fontWeight:800,fontFamily:'var(--font-head)',fontSize:18,color:s.color}}>{s.count}</span>
                </div>
              ))}
            </div>
          ):(
            <div style={emptyBox}>
              <span style={emptyIcon}>📦</span>
              <p style={emptyText}>No stock items yet</p>
              <p style={emptyHint}>Go to Stock page to add items</p>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div className="section-title" style={{margin:0}}>Recent Orders</div>
        </div>
        {recentOrders.length>0?(
          <table className="tbl">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Fabric</th><th>Quantity</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recentOrders.map(r=>(
                <tr key={r.id}>
                  <td style={{color:'var(--accent)',fontWeight:600}}>{r.id}</td>
                  <td>{r.customer}</td>
                  <td style={{color:'var(--muted)'}}>{r.fabric}</td>
                  <td>{Number(r.qty).toLocaleString()} pcs</td>
                  <td><span className={`badge ${STATUS_COLOR[r.status]||'amber'}`}>{r.status}</span></td>
                  <td style={{color:'var(--muted)'}}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ):(
          <div style={emptyBox}>
            <span style={emptyIcon}>📋</span>
            <p style={emptyText}>No orders yet</p>
            <p style={emptyHint}>Go to the Orders page to add your first order</p>
          </div>
        )}
      </div>
    </div>
  );
}
