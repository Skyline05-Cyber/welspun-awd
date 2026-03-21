import React, { useState } from 'react';
import './App.css';

// Existing pages
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders    from './pages/Orders';
import Stock     from './pages/Stock';
import Reports   from './pages/Reports';
import Layout    from './components/Layout';

// OS + DS Module pages
import Scheduling from './pages/Scheduling';
import Memory     from './pages/Memory';
import Deadlock   from './pages/Deadlock';
import FileSystem from './pages/FileSystem';
import StackQueue from './pages/StackQueue';
import LinkedList from './pages/LinkedList';
import Graph      from './pages/Graph';

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
    // ── Main App ──
    dashboard:  <Dashboard orders={orders} stock={stock} />,
    orders:     <Orders    orders={orders} setOrders={setOrders} />,
    stock:      <Stock     stock={stock}   setStock={setStock} />,
    reports:    <Reports   orders={orders} stock={stock} />,
    // ── OS Concepts ──
    scheduling: <Scheduling />,
    memory:     <Memory />,
    deadlock:   <Deadlock />,
    filesystem: <FileSystem />,
    // ── Data Structures ──
    stackqueue: <StackQueue />,
    linkedlist: <LinkedList />,
    graph:      <Graph />,
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
