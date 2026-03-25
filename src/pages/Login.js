import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [step,     setStep]     = useState(1);
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleContinue = () => {
    if (!email || !email.includes('@')) {
      setErr('Enter a valid email address.');
      return;
    }
    setErr('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 700);
  };

  const handleLogin = async () => {
    if (!password || password.length < 4) {
      setErr('Password must be at least 4 characters.');
      return;
    }
    setErr('');
    setLoading(true);

    // Local fallback users
    const validUsers = [
      { email: 'admin@welspun.com',    password: 'admin-73608116', role: 'admin',    name: 'Admin User',     plant: 'Surat' },
      { email: 'manager@welspun.com',  password: 'manager123',     role: 'manager',  name: 'Plant Manager',  plant: 'Surat' },
      { email: 'viewer@welspun.com',   password: 'viewer123',      role: 'viewer',   name: 'Report Viewer',  plant: 'Surat' },
      { email: 'employee@welspun.com', password: 'employee123',    role: 'employee', name: 'Staff Employee', plant: 'Surat' },
    ];

    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password)
        .maybeSingle();

      if (!error && data) {
        setLoading(false);
        onLogin({ email: data.email, name: data.name || 'Admin User', role: data.role || 'admin', plant: data.plant || 'Surat' });
        return;
      }
    } catch (e) {
      // Supabase failed, fall through to local
    }

    // Fallback to local validation
    const user = validUsers.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );
    setLoading(false);
    if (user) {
      onLogin(user);
    } else {
      setErr('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.dotsRing}>
        {[...Array(40)].map((_, i) => {
          const angle = (i / 40) * 360;
          const rad   = (angle * Math.PI) / 180;
          const x     = 50 + 90 * Math.cos(rad);
          const y     = 50 + 90 * Math.sin(rad);
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              width: i % 3 === 0 ? 7 : 5, height: i % 3 === 0 ? 7 : 5,
              borderRadius: '50%', background: `hsl(${Math.round(i*9)},80%,65%)`,
              transform: 'translate(-50%,-50%)', opacity: 0.85,
            }} />
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <span style={styles.logoW}>W</span>
          </div>
        </div>

        <h1 style={styles.title}>
          {step === 1 ? 'Sign in with Welspun Account' : 'Enter Password'}
        </h1>
        <p style={styles.sub}>
          {step === 2 ? email : 'Welspun Pvt. Ltd. · AWD Textile Management'}
        </p>

        {step === 1 ? (
          <div style={styles.inputWrap}>
            <input style={styles.input} type="email" placeholder="Email or Employee ID"
              value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleContinue()} autoFocus />
          </div>
        ) : (
          <div style={styles.inputWrap}>
            <input style={styles.input} type="password" placeholder="Password"
              value={password} onChange={e => { setPassword(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus />
          </div>
        )}

        {err && <p style={styles.err}>{err}</p>}

        {step === 1 && (
          <p style={styles.hint}>
            Your account information is used to allow you to sign in securely and access AWD data.
          </p>
        )}

        <div style={styles.btnRow}>
          {step === 2 && (
            <button style={styles.backBtn} onClick={() => { setStep(1); setErr(''); setPassword(''); }}>
              ← Back
            </button>
          )}
          <button style={{ ...styles.continueBtn, opacity: loading ? 0.7 : 1 }}
            onClick={step === 1 ? handleContinue : handleLogin} disabled={loading}>
            {loading ? '...' : step === 1 ? 'Continue' : 'Sign In'}
          </button>
        </div>

        {step === 1 && (
          <div style={styles.divider}>
            <span style={styles.divLine} /><span style={styles.divText}>or</span><span style={styles.divLine} />
          </div>
        )}
        {step === 1 && <button style={styles.altBtn}>🏢 &nbsp;Sign in with Employee Badge</button>}

        <p style={styles.footer}>Welspun Pvt. Ltd. · AWD v2.2 · Surat Plant</p>
      </div>
    </div>
  );
}

const styles = {
  bg:          { minHeight:'100vh', background:'linear-gradient(135deg,#0f0a1e 0%,#1a0f35 50%,#0f0a1e 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden' },
  dotsRing:    { position:'absolute', width:260, height:260, top:'50%', left:'50%', transform:'translate(-50%,-56%)', pointerEvents:'none' },
  card:        { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'48px 44px 36px', width:440, display:'flex', flexDirection:'column', alignItems:'center', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', boxShadow:'0 8px 48px rgba(0,0,0,.5)', position:'relative', zIndex:1 },
  logoWrap:    { marginBottom:22, position:'relative' },
  logoCircle:  { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 24px rgba(124,58,237,.5)' },
  logoW:       { color:'#fff', fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, lineHeight:1 },
  title:       { fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:'#ffffff', textAlign:'center', marginBottom:6, letterSpacing:-0.3 },
  sub:         { fontSize:13, color:'rgba(255,255,255,.5)', textAlign:'center', marginBottom:28 },
  inputWrap:   { width:'100%', marginBottom:8 },
  input:       { width:'100%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.18)', borderRadius:10, color:'#ffffff', fontFamily:"'DM Sans',sans-serif", fontSize:15, padding:'13px 16px', outline:'none', boxSizing:'border-box', transition:'border-color .2s' },
  err:         { color:'#f87171', fontSize:12, marginBottom:8, textAlign:'center' },
  hint:        { fontSize:12, color:'rgba(255,255,255,.38)', textAlign:'center', lineHeight:1.6, marginTop:8, marginBottom:20, padding:'0 8px' },
  btnRow:      { display:'flex', gap:10, width:'100%', marginTop:16 },
  continueBtn: { flex:1, padding:'13px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#ffffff', fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, border:'none', borderRadius:10, cursor:'pointer', transition:'all .2s', boxShadow:'0 4px 16px rgba(124,58,237,.4)', letterSpacing:.2 },
  backBtn:     { padding:'13px 18px', background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', fontFamily:"'DM Sans',sans-serif", fontSize:14, border:'1px solid rgba(255,255,255,.15)', borderRadius:10, cursor:'pointer' },
  divider:     { display:'flex', alignItems:'center', gap:10, width:'100%', margin:'20px 0' },
  divLine:     { flex:1, height:1, background:'rgba(255,255,255,.12)', display:'block' },
  divText:     { fontSize:12, color:'rgba(255,255,255,.35)' },
  altBtn:      { width:'100%', padding:'12px', background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.7)', fontFamily:"'DM Sans',sans-serif", fontSize:14, border:'1px solid rgba(255,255,255,.14)', borderRadius:10, cursor:'pointer', marginBottom:8 },
  footer:      { marginTop:24, fontSize:11, color:'rgba(255,255,255,.25)', textAlign:'center' },
};