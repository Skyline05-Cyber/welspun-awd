import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'           // ← CHANGE THIS LINE
import DashboardContent from './components/DashboardContent.jsx'  // ← CHANGE THIS LINE
import './App.css'

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) setIsAuth(true);
  }, []);

  const ProtectedRoute = ({ children }) => isAuth ? children : <Navigate to="/login" />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardContent setIsAuth={setIsAuth} />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
