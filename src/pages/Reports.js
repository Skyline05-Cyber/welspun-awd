import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

export default function Reports({ orders=[], stock=[] }) {
  // Group orders by month
  const monthMap = {};
  orders.forEach(o => {
    const d = o.date || '';
    const parts = d.split(' ');
    const mon = parts[1] || 'Unknown';
    if (!monthMap[mon]) monthMap[mon] = { month: mon, orders: 0, qty: 0 };
    monthMap[mon].orders += 1;
    monthMap[mon].qty += Number(o.qty) || 0;
  });
  const monthlyData = Object.values(monthMap);

  // Status breakdown
  const statusMap = {};
  orders.forEach(o => { statusMap[o.status] = (statusMap[o.status]||0)+1; });

  // Top customers
  const custMap = {};
  orders.forEach(o => {
    if (!custMap[o.customer]) custMap[o.customer] = { name: o.customer, orders: 0, qty: 0 };
    custMap[o.customer].orders += 1;
    custMap[o.customer].qty += Number(o.qty) || 0;
  });
  const topCustomers = Object.values(custMap).sort((a,b)=>b.qty-a.qty).slice(0,5);

  const totalQty      = orders.reduce((s,o)=>s+(Number(o.qty)||0),0);
  const completedPct  = orders.length ? Math.round((orders.filter(o=>o.status==='Completed').length/orders.length)*100) : 0;
  const lowStock      = stock.filter(s=>s.status==='Low'||s.status==='Critical').length;

  const emptyBox = {display:'flex',flexDirection:'column',alignItems:'center',padding:'40px 20px',gap:8};

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Reports & Analytics</h1><p>Welspun Pvt. Ltd. · Live Analytics</p></div>
      </div>

      {/* KPIs */}
      <div className="stat-grid" style={{marginBottom:20}}>
        <div className="stat-card c1"><div className="label">Total Orders</div><div className="value">{orders.length||'—'}</div></div>
        <div className="stat-card c2"><div className="label">Total Quantity</div><div className="value">{totalQty>0?totalQty.toLocaleString():'—'}</div></div>
        <div className="stat-card c3"><div className="label">Completion Rate</div><div className="value">{orders.length?completedPct+'%':'—'}</div></div>
        <div className="stat-card c4"><div className="label">Low / Critical Stock</div><div className="value">{lowStock>0?lowStock:'—'}</div></div>
      </div>

      {/* Charts */}
      <div className="charts-row" style={{marginBottom:16}}>
        <div className="card">
          <div className="section-title">Orders by Month</div>
          {monthlyData.length>0?(
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={monthlyData} margin={{top:5,right:10,bottom:0,left:0}} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e0f5"/>
                <XAxis dataKey="month" tick={{fill:'#8b7aaa',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#8b7aaa',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#fff',border:'1px solid #d8d0e8',borderRadius:10,fontSize:12,boxShadow:'0 4px 24px rgba(124,58,237,.14)'}} labelStyle={{color:'#7c3aed',fontWeight:700}} cursor={{fill:'rgba(124,58,237,.06)'}}/>
                <Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:'var(--text)',fontSize:11}}>{v}</span>}/>
                <Bar dataKey="orders" name="Orders" fill="#7c3aed" radius={[4,4,0,0]}/>
                <Bar dataKey="qty" name="Quantity" fill="#4a9eff" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ):(
            <div style={emptyBox}>
              <span style={{fontSize:36}}>📊</span>
              <p style={{fontFamily:'var(--font-head)',fontWeight:700,color:'var(--text2)'}}>No data yet</p>
              <p style={{color:'var(--muted)',fontSize:12}}>Add orders to see the chart</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title">Order Status Breakdown</div>
          {orders.length>0?(
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
              {Object.entries(statusMap).map(([status,count])=>{
                const pct=Math.round((count/orders.length)*100);
                const colors={'Completed':'#22c77a','Dispatched':'#22c77a','In Transit':'#4a9eff','Processing':'#7c3aed','On Hold':'#e05252'};
                const bc=colors[status]||'#8b7aaa';
                return (
                  <div key={status}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                      <span style={{color:'var(--muted)'}}>{status}</span>
                      <span style={{fontWeight:700,color:bc}}>{count} ({pct}%)</span>
                    </div>
                    <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`,background:bc}}/></div>
                  </div>
                );
              })}
            </div>
          ):(
            <div style={emptyBox}>
              <span style={{fontSize:36}}>📈</span>
              <p style={{fontFamily:'var(--font-head)',fontWeight:700,color:'var(--text2)'}}>No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Customers */}
      <div className="card">
        <div className="section-title">Top Customers by Quantity</div>
        {topCustomers.length>0?(
          <table className="tbl">
            <thead><tr><th>#</th><th>Customer</th><th>Orders</th><th>Total Quantity</th></tr></thead>
            <tbody>
              {topCustomers.map((c,i)=>(
                <tr key={c.name}>
                  <td style={{color:'var(--muted)',fontSize:12}}>{String(i+1).padStart(2,'0')}</td>
                  <td style={{fontWeight:500}}>{c.name}</td>
                  <td>{c.orders}</td>
                  <td style={{fontWeight:700,fontFamily:'var(--font-head)',color:'var(--accent)'}}>{c.qty.toLocaleString()} pcs</td>
                </tr>
              ))}
            </tbody>
          </table>
        ):(
          <div style={emptyBox}>
            <span style={{fontSize:36}}>👥</span>
            <p style={{fontFamily:'var(--font-head)',fontWeight:700,color:'var(--text2)'}}>No customers yet</p>
            <p style={{color:'var(--muted)',fontSize:12}}>Add orders to see top customers</p>
          </div>
        )}
      </div>
    </div>
  );
}
