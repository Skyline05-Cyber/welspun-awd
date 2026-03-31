import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders    from './pages/Orders';
import Stock     from './pages/Stock';
import Employees from './pages/Employees';
import Reports   from './pages/Reports';
import Layout    from './components/Layout';

const DEFAULT_EMPLOYEES = [
  { id:'1', name:'Admin User',    email:'admin@welspun.com',    password:'admin-73608116', role:'admin',    employee_id:'WEL-ADM-001', plant:'Surat Plant', department:'Management',  phone:'', joining:'01 Jan 2024' },
  { id:'2', name:'Plant Manager', email:'manager@welspun.com',  password:'manager123',     role:'manager',  employee_id:'WEL-MGR-001', plant:'Surat Plant', department:'Operations',  phone:'', joining:'15 Mar 2024' },
  { id:'3', name:'Staff Employee',email:'employee@welspun.com', password:'employee123',    role:'employee', employee_id:'WEL-EMP-001', plant:'Surat Plant', department:'Production',  phone:'', joining:'01 Jun 2024' },
  { id:'4', name:'Report Viewer', email:'viewer@welspun.com',   password:'viewer123',      role:'viewer',   employee_id:'WEL-VWR-001', plant:'Anjar Plant', department:'Analytics',   phone:'', joining:'10 Sep 2024' },
];

export default function App() {
  // ── Restore session from localStorage on refresh ──
  const savedUser    = JSON.parse(localStorage.getItem('welspun_user') || 'null');
  const savedPage    = localStorage.getItem('welspun_page') || 'dashboard';

  const [loggedIn,  setLoggedIn]  = useState(!!savedUser);
  const [user,      setUser]      = useState(savedUser);
  const [page,      setPage]      = useState(savedPage);
  const [orders,    setOrders]    = useState([]);
  const [stock,     setStock]     = useState([]);
  const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
  const [loading,   setLoading]   = useState(false);

  // ── Save page to localStorage whenever it changes ──
  const handleSetPage = (p) => {
    setPage(p);
    localStorage.setItem('welspun_page', p);
  };

  // ── Load data from Supabase on login ──
  useEffect(() => {
    if (!loggedIn) return;
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: od }, { data: sd }] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('stock').select('*').order('created_at', { ascending: false }),
        ]);
        if (od) setOrders(od);
        if (sd) setStock(sd);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [loggedIn]);

  // ── Orders sync ──
  const setOrdersDB = async (newOrders) => {
    setOrders(newOrders);
    try {
      const deleted = orders.filter(o => !newOrders.find(n => n.id === o.id));
      for (const o of deleted) await supabase.from('orders').delete().eq('id', o.id);
      for (const o of newOrders) await supabase.from('orders').upsert(o);
    } catch (_) {}
  };

  // ── Stock sync ──
  const setStockDB = async (newStock) => {
    setStock(newStock);
    try {
      const deleted = stock.filter(s => !newStock.find(n => n.id === s.id));
      for (const s of deleted) await supabase.from('stock').delete().eq('id', s.id);
      for (const s of newStock) await supabase.from('stock').upsert(s);
    } catch (_) {}
  };

  // ── Login — save session ──
  const handleLogin = (u) => {
    setUser(u);
    setLoggedIn(true);
    localStorage.setItem('welspun_user', JSON.stringify(u));
    localStorage.setItem('welspun_page', 'dashboard');
  };

  // ── Logout — clear session ──
  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setPage('dashboard');
    setOrders([]);
    setStock([]);
    localStorage.removeItem('welspun_user');
    localStorage.removeItem('welspun_page');
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
      <div style={{ width:48, height:48, border:'4px solid var(--border)', borderTop:'4px solid var(--accent)', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
      <p style={{ color:'var(--muted)', fontFamily:'var(--font-head)', fontSize:14 }}>Loading your data…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const pages = {
    dashboard: <Dashboard  orders={orders}       stock={stock} />,
    orders:    <Orders     orders={orders}       setOrders={setOrdersDB} />,
    stock:     <Stock      stock={stock}         setStock={setStockDB} />,
    employees: <Employees  employees={employees} setEmployees={setEmployees} />,
    reports:   <Reports    orders={orders}       stock={stock} employees={employees} />,
  };

  return (
    <Layout page={page} setPage={handleSetPage} orders={orders} stock={stock} onLogout={handleLogout} user={user}>
      {pages[page] || pages.dashboard}
    </Layout>
  );
}
