import {useState,type FormEvent} from 'react';
 import {Link,useNavigate} from 'react-router-dom'; 
 import Field from '../components/Field'; 
 import Status from '../components/Status'; 
 import {useAuth} from '../context/AuthContext';
export default function Login(){const {login}=useAuth();
const nav=useNavigate();
const[e,setE]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[loading,setLoading]=useState(false);async function go(x:FormEvent){x.preventDefault();
    setLoading(true);setErr('');try{await login(e,p);nav('/dashboard')}catch(z){setErr(z instanceof Error?z.message:'Login failed')}finally{setLoading(false)}}return <div className="auth"><div className="authbox"><div className="logo"><b>TS</b><div><strong>TS BANK</strong><small>Digital Banking</small></div></div><span className="eyebrow">WELCOME BACK</span><h2>Banking without the clutter.</h2><p>Manage your account, verify recipients and move funds from one secure workspace.</p><form onSubmit={go}><Field label="Email address" type="email" value={e} onChange={x=>setE(x.target.value)} required/><Field label="Password" type="password" value={p} onChange={x=>setP(x.target.value)} required/><Status text={err}/><button className="primary full" disabled={loading}>{loading?'Signing in...':'Sign in'}</button></form><small className="foot">New customer? <Link to="/register">Create an account</Link></small></div><div className="authvisual"><div><span>TS BANK</span><strong>YOUR MONEY.<br/>UNDER YOUR CONTROL.</strong></div></div></div>}
