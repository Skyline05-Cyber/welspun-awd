import React, { useState } from 'react';

const ROLE_CONFIG = {
  admin:    { badge:'ADMIN', bg:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', icon:'👑', cls:'green' },
  manager:  { badge:'MGR',   bg:'linear-gradient(135deg,#0ea5e9,#0369a1)', color:'#fff', icon:'🏢', cls:'blue'  },
  employee: { badge:'EMP',   bg:'linear-gradient(135deg,#22c77a,#15803d)', color:'#fff', icon:'👤', cls:'green' },
  viewer:   { badge:'VIEW',  bg:'linear-gradient(135deg,#f59e0b,#b45309)', color:'#fff', icon:'👁️', cls:'amber' },
};

const ROLES       = ['employee','manager','admin','viewer'];
const PLANTS      = ['Surat Plant','Anjar Plant','Vapi Plant','Mumbai Office'];
const DEPARTMENTS = ['Production','Operations','Management','Analytics','Quality','Logistics','HR','Finance'];

function genEmpId(employees) {
  const max = employees.length
    ? Math.max(...employees.map(e => parseInt((e.employee_id||'WEL-000').split('-').pop()) || 0))
    : 0;
  return `WEL-${String(max + 1).padStart(3,'0')}`;
}

export default function Employees({ employees, setEmployees }) {
  const [search,  setSearch]  = useState('');
  const [roleF,   setRoleF]   = useState('All');
  const [modal,   setModal]   = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [viewEmp, setViewEmp] = useState(null);

  // form fields
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [role,       setRole]       = useState('employee');
  const [plant,      setPlant]      = useState('Surat Plant');
  const [department, setDepartment] = useState('Production');
  const [phone,      setPhone]      = useState('');
  const [joining,    setJoining]    = useState('');

  const filtered = employees.filter(e =>
    (roleF === 'All' || e.role === roleF) &&
    ((e.name||'').toLowerCase().includes(search.toLowerCase()) ||
     (e.email||'').toLowerCase().includes(search.toLowerCase()) ||
     (e.employee_id||'').toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditId(null);
    setName(''); setEmail(''); setPassword(''); setRole('employee');
    setPlant('Surat Plant'); setDepartment('Production'); setPhone('');
    setJoining(new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}));
    setModal(true);
  };

  const openEdit = (e) => {
    setEditId(e.id);
    setName(e.name||''); setEmail(e.email||''); setPassword(e.password||'');
    setRole(e.role||'employee'); setPlant(e.plant||'Surat Plant');
    setDepartment(e.department||'Production'); setPhone(e.phone||'');
    setJoining(e.joining||'');
    setModal(true);
  };

  const save = () => {
    if (!name.trim())  { alert('Name is required.'); return; }
    if (!email.trim()) { alert('Email is required.'); return; }
    if (!editId && !password.trim()) { alert('Password is required for new employee.'); return; }
    const rec = {
      name, email, password, role, plant, department, phone, joining,
      employee_id: editId ? employees.find(e=>e.id===editId)?.employee_id : genEmpId(employees),
    };
    if (editId) {
      setEmployees(employees.map(e => e.id === editId ? { ...rec, id: editId } : e));
    } else {
      setEmployees([...employees, { ...rec, id: Date.now().toString() }]);
    }
    setModal(false);
  };

  const deleteEmp = (id) => {
    if (window.confirm('Delete this employee?')) setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>Welspun Pvt. Ltd. · Manage staff accounts and access roles</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom:20 }}>
        {[
          { cls:'c1', label:'Total Staff',  val:employees.length,                                    sub:'active accounts'    },
          { cls:'c2', label:'Admins',       val:employees.filter(e=>e.role==='admin').length,        sub:'full access'        },
          { cls:'c3', label:'Managers',     val:employees.filter(e=>e.role==='manager').length,      sub:'plant managers'     },
          { cls:'c4', label:'Employees',    val:employees.filter(e=>e.role==='employee').length,     sub:'staff members'      },
        ].map(k => (
          <div className={`stat-card ${k.cls}`} key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.val > 0 ? k.val : '—'}</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input className="inp" style={{ maxWidth:280 }} placeholder="Search by name, email or ID…"
          value={search} onChange={e => setSearch(e.target.value)} />
        {['All','admin','manager','employee','viewer'].map(r => (
          <button key={r} className="btn" onClick={() => setRoleF(r)} style={{
            padding:'6px 14px', fontSize:12,
            background: roleF===r ? 'var(--accent)' : 'var(--bg3)',
            color: roleF===r ? '#fff' : 'var(--muted)',
            border:'1px solid var(--border)', fontWeight: roleF===r ? 700 : 400,
            textTransform:'capitalize',
          }}>{r}</button>
        ))}
      </div>

      {/* Employee Cards Grid */}
      {employees.length === 0 ? (
        <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'72px 20px', gap:10 }}>
          <span style={{ fontSize:48 }}>👥</span>
          <p style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:17, color:'var(--text2)' }}>No employees yet</p>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Click "+ Add Employee" to add your first staff member</p>
          <button className="btn btn-primary" style={{ marginTop:8 }} onClick={openAdd}>+ Add First Employee</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 20px', gap:8 }}>
          <span style={{ fontSize:36 }}>🔍</span>
          <p style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--text2)' }}>No matching employees</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
          {filtered.map(e => {
            const cfg      = ROLE_CONFIG[e.role] || ROLE_CONFIG.employee;
            const initials = e.name ? e.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'NA';
            return (
              <div key={e.id} className="card" style={{ padding:0, overflow:'hidden', cursor:'pointer' }} onClick={() => setViewEmp(e)}>
                {/* Card top bar */}
                <div style={{ height:6, background:cfg.bg }}/>
                <div style={{ padding:'20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                    <div style={{ width:52, height:52, borderRadius:'50%', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#fff', fontFamily:'var(--font-head)', flexShrink:0 }}>
                      {initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.name}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.email}</div>
                    </div>
                    <div style={{ background:cfg.bg, padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:800, color:'#fff', letterSpacing:1, flexShrink:0 }}>
                      {cfg.icon} {cfg.badge}
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                    {[
                      { label:'Employee ID', val: e.employee_id || '—' },
                      { label:'Department',  val: e.department  || '—' },
                      { label:'Plant',       val: e.plant       || '—' },
                      { label:'Joined',      val: e.joining     || '—' },
                    ].map(d => (
                      <div key={d.label} style={{ background:'var(--bg3)', borderRadius:6, padding:'7px 10px' }}>
                        <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:.5, textTransform:'uppercase', marginBottom:2 }}>{d.label}</div>
                        <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{d.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:8 }} onClick={ev => ev.stopPropagation()}>
                    <button className="btn btn-ghost" style={{ flex:1, padding:'7px', fontSize:12 }} onClick={() => openEdit(e)}>✏️ Edit</button>
                    <button className="btn" style={{ flex:1, padding:'7px', fontSize:12, background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:8 }} onClick={() => deleteEmp(e.id)}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Badge Modal */}
      {viewEmp && (() => {
        const cfg      = ROLE_CONFIG[viewEmp.role] || ROLE_CONFIG.employee;
        const initials = viewEmp.name ? viewEmp.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'NA';
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(30,20,50,.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}
            onClick={() => setViewEmp(null)}>
            <div style={{ width:360 }} onClick={e => e.stopPropagation()}>
              {/* Badge Card */}
              <div style={{ background:'linear-gradient(135deg,#1a0f35,#2d1b69)', borderRadius:16, padding:'32px 28px', border:'1px solid rgba(255,255,255,.15)', boxShadow:`0 8px 40px ${cfg.color}33`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:`${cfg.bg.includes('7c3aed')?'#7c3aed':cfg.bg.includes('0ea5e9')?'#0ea5e9':cfg.bg.includes('22c77a')?'#22c77a':'#f59e0b'}22` }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:'#fff', fontSize:15 }}>WELSPUN PVT. LTD.</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', letterSpacing:1.5 }}>AWD TEXTILE</div>
                  </div>
                  <div style={{ background:cfg.bg, padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:800, color:'#fff', letterSpacing:1.5 }}>{cfg.badge}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", border:'3px solid rgba(255,255,255,.2)' }}>{initials}</div>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#fff', fontSize:18 }}>{viewEmp.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>{viewEmp.email}</div>
                    <div style={{ fontSize:11, color:'#a78bfa', fontWeight:700, marginTop:4 }}>{cfg.icon} {cfg.badge} — {(viewEmp.role||'').toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[
                    { label:'Employee ID', val: viewEmp.employee_id || '—' },
                    { label:'Plant',       val: viewEmp.plant       || '—' },
                    { label:'Department',  val: viewEmp.department  || '—' },
                    { label:'Phone',       val: viewEmp.phone       || '—' },
                    { label:'Joined',      val: viewEmp.joining     || '—' },
                  ].map(d => (
                    <div key={d.label} style={{ background:'rgba(255,255,255,.07)', borderRadius:8, padding:'8px 12px' }}>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>{d.label}</div>
                      <div style={{ fontSize:12, color:'#fff', fontWeight:600 }}>{d.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:20, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.1)', display:'flex', justifyContent:'space-between' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.3)' }}>WELSPUN AWD · SURAT · v2.1</div>
                  <div style={{ width:36, height:10, background:'rgba(255,255,255,.15)', borderRadius:2 }}/>
                </div>
              </div>
              <button className="btn btn-ghost" style={{ width:'100%', marginTop:12, padding:'11px', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.05)' }} onClick={() => setViewEmp(null)}>Close</button>
            </div>
          </div>
        );
      })()}

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(30,20,50,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}
          onClick={() => setModal(false)}>
          <div className="card" style={{ width:540, padding:36, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-head)', fontSize:20, marginBottom:24, color:'var(--accent)' }}>
              {editId ? '✏️ Edit Employee' : '+ New Employee'}
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 20px' }}>
              <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                <label className="form-label">Full Name</label>
                <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="e.g. rahul@welspun.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={editId?'Leave blank to keep':'Set password'} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="inp" value={role} onChange={e=>setRole(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r} style={{ textTransform:'capitalize' }}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="inp" value={department} onChange={e=>setDepartment(e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Plant</label>
                <select className="inp" value={plant} onChange={e=>setPlant(e.target.value)}>
                  {PLANTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="inp" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input className="inp" value={joining} onChange={e=>setJoining(e.target.value)} placeholder="e.g. 01 Jan 2025" />
              </div>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button className="btn btn-primary" style={{ flex:1, padding:'12px' }} onClick={save}>
                {editId ? 'Save Changes' : 'Add Employee'}
              </button>
              <button className="btn btn-ghost" style={{ flex:1, padding:'12px' }} onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}