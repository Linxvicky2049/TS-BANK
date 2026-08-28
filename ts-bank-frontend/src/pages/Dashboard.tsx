import {useEffect,useState} from 'react'; 
import {Link} from 'react-router-dom'; 
import {ArrowUpRight,ShieldCheck,CreditCard} from 'lucide-react'; 
import {account,balance} from '../services/banking'; 
import {useAuth} from '../context/AuthContext'; 
import Status from '../components/Status';
const money=new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}); 
export default function Dashboard(){const{user}=useAuth();
const[a,setA]=useState<any>(),[b,setB]=useState<any>(),[err,setErr]=useState('');
useEffect(()=>{Promise.all([account(),balance()]).then(([x,y])=>{setA(x);setB(y)}).catch(()=>setErr('Could not load account data.'))},[]);return <div className="page"><div className="pagehead"><div><small>OVERVIEW</small><h2>Good to see you, {user?.fullName?.split(' ')[0]||'Customer'}.</h2><p>Your banking workspace is ready.</p></div><Link className="primary" to="/transfer"><ArrowUpRight size={17}/>Send money</Link></div><Status text={err}/><div className="stats"><article className="featured"><small>AVAILABLE BALANCE</small><strong>{b?money.format(b.balance):'₦ —'}</strong><span>{a?.accountNumber||'No account yet'}</span></article><article><CreditCard/><small>ACCOUNT</small><strong>{a?.accountNumber||'Not created'}</strong></article><article><ShieldCheck/><small>VERIFICATION</small><strong>{user?.isVerified?'Verified':'Pending'}</strong></article></div><div className="card"><small>QUICK ACTIONS</small><div className="actions"><Link to="/name-enquiry"><strong>Name enquiry</strong><span>Verify a recipient</span></Link><Link to="/transfer"><strong>Transfer</strong><span>Send funds</span></Link><Link to="/transactions"><strong>Transactions</strong><span>View your history</span></Link></div></div></div>}
