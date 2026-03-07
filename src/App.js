import React, { useState } from 'react';
import './App.css';

import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders    from './pages/Orders';
import Stock     from './pages/Stock';
import Reports   from './pages/Reports';
import Layout    from './components/Layout';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page,     setPage]     = useState('dashboard');
  const [orders,   setOrders]   = useState([]);
  const [stock,    setStock]    = useState([]);

  const handleLogout = () => {
    setLoggedIn(false);
    setPage('dashboard');
  };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const pages = {
    dashboard: <Dashboard orders={orders} stock={stock} />,
    orders:    <Orders    orders={orders} setOrders={setOrders} />,
    stock:     <Stock     stock={stock}   setStock={setStock} />,
    reports:   <Reports   orders={orders} stock={stock} />,
  };

  return (
    <Layout
      page={page}
      setPage={setPage}
      orders={orders}
      stock={stock}
      onLogout={handleLogout}
    >
      {pages[page] || pages.dashboard}
    </Layout>
  );
}
