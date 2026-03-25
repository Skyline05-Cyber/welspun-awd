import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

// ── Main Pages ──
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Orders     from './pages/Orders';
import Stock      from './pages/Stock';
import Reports    from './pages/Reports';
import Employees  from './pages/Employees';

// ── Layout ──
import Layout     from './components/Layout';


export default function App() {
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page,        setPage]        = useState('dashboard');
  const [orders,      setOrders]      = useState([]);
  const [stock,       setStock]       = useState([]);
  const [loading,     setLoading]     = useState(false);

  // ── Load data from Supabase after login ──
  useEffect(() => {
    if (!loggedIn) return;
    const loadData = async () => {
      setLoading(true);
      const { data: ordersData } = await supabase.from('orders').select('*');
      const { data: stockData  } = await supabase.from('stock').select('*');
      if (ordersData) setOrders(ordersData);
      if (stockData)  setStock(stockData);
      setLoading(false);
    };
    loadData();
  }, [loggedIn]);

  const handleLogin = (user) => {
    setLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setPage('dashboard');
    setOrders([]);
    setStock([]);
  };

  // ── Show login if not authenticated ──
  if (!loggedIn) return <Login onLogin={handleLogin} />;

  // ── Show loader while fetching data ──
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 48, height: 48,
        border: '4px solid var(--border)',
        borderTop: '4px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-head)' }}>
        Loading data...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Page map ──
  const pages = {
    // Main
    dashboard:  <Dashboard orders={orders} stock={stock} />,
    orders:     <Orders    orders={orders} setOrders={setOrders} />,
    stock:      <Stock     stock={stock}   setStock={setStock} />,
    reports:    <Reports   orders={orders} stock={stock} />,
    employees:  <Employees />,
    
  };

  return (
    <Layout
      page={page}
      setPage={setPage}
      orders={orders}
      stock={stock}
      onLogout={handleLogout}
      user={currentUser}
    >
      {pages[page] || pages.dashboard}
    </Layout>
  );
}
