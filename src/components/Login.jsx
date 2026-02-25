import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@company.com' && password === 'admin123') {
        localStorage.setItem('token', 'company-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Dhruv Ariwala' }));
        setIsAuth(true);
        navigate('/dashboard');
      } else {
        alert('Email: admin@company.com\nPassword: admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo"><h1>🏢 Company Dashboard</h1></div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="helper-text">Demo: admin@company.com / admin123</div>
      </form>
    </div>
  );
};

export default Login;
