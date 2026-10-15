import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '20' });
  const [syncingId, setSyncingId] = useState(null);
  const API = 'http://localhost:5000/api';

  useEffect(() => {
    axios.get(API + '/products').then(r => setProducts(r.data)).catch(()=>{});
  }, []);

  const addProduct = async () => {
    if(!form.name || !form.sku) return alert('Enter name & SKU');
    const res = await axios.post(API + '/products', form);
    setProducts([...products, res.data]);
    setForm({ name: '', sku: '', price: '', stock: '20' });
  };

  const sync = async (id) => {
    setSyncingId(id);
    try{
      const res = await axios.post(API + '/sync/' + id);
      const r = await axios.get(API + '/products'); setProducts(r.data);
      setTimeout(()=>alert('✅ REAL SYNC SUCCESS! Woo ID: ' + res.data.wooId), 300);
    }catch(e){ alert('Sync failed'); }
    setSyncingId(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        *{font-family:'Plus Jakarta Sans',sans-serif; margin:0; box-sizing:border-box}
        body{background:#f5f7ff}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}50%{box-shadow:0 0 0 12px rgba(34,197,94,0)}}
        .glass{backdrop-filter:blur(20px); background:rgba(255,255,255,0.85); border:1px solid rgba(255,255,255,0.6)}
        .card{transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)}
        .card:hover{transform:translateY(-4px) scale(1.01); box-shadow:0 20px 40px -10px rgba(79,70,229,0.25)!important}
        .input{transition:all 0.3s; outline:none}
        .input:focus{border-color:#6366f1!important; box-shadow:0 0 0 4px rgba(99,102,241,0.15)!important; transform:translateY(-1px)}
        .btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7); background-size:200% 200%; animation:shimmer 3s infinite linear; transition:all 0.3s}
        .btn-primary:hover{transform:translateY(-2px); box-shadow:0 10px 20px -5px rgba(99,102,241,0.5); filter:brightness(1.1)}
        .btn-sync{background:linear-gradient(135deg,#22c55e,#16a34a); transition:all 0.3s; position:relative; overflow:hidden}
        .btn-sync::before{content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); transition:0.5s}
        .btn-sync:hover::before{left:100%}
        .btn-sync:hover{transform:scale(1.05); box-shadow:0 8px 16px -4px rgba(34,197,94,0.5)}
        .badge-live{animation:pulse 2s infinite}
        .product-row{transition:all 0.3s}
        .product-row:hover{background:#eef2ff!important; transform:translateX(4px)}
      `}</style>

      <div style={{minHeight:'100vh', background:'radial-gradient(1200px 600px at 20% -10%,#a5b4fc 0%,transparent 60%), radial-gradient(1000px 500px at 90% 0%,#f0abfc 0%,transparent 60%), linear-gradient(180deg,#f8faff 0%,#eef2ff 100%)'}}>
        
        {/* HEADER */}
        <div className="glass" style={{position:'sticky', top:0, zIndex:10, padding:'14px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:20, boxShadow:'0 8px 16px -4px rgba(99,102,241,0.5)', animation:'float 3s ease-in-out infinite'}}>⚡</div>
            <div>
              <div style={{fontWeight:800, fontSize:22, letterSpacing:-0.5, color:'#0f172a'}}>SyncKart</div>
              <div style={{fontSize:11, color:'#64748b', fontWeight:600, letterSpacing:1, textTransform:'uppercase'}}>PIM • WooCommerce Sync</div>
            </div>
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <div className="badge-live" style={{display:'flex', alignItems:'center', gap:6, background:'#dcfce7', color:'#166534', padding:'8px 14px', borderRadius:100, fontSize:12, fontWeight:700}}>
              <span style={{width:8, height:8, background:'#22c55e', borderRadius:'50%'}}></span> Live: adventurousballs.s2...
            </div>
            <div style={{width:36, height:36, borderRadius:100, background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'grid', placeItems:'center', color:'white', fontWeight:700}}>G</div>
          </div>
        </div>

        <div style={{maxWidth:1100, margin:'28px auto', padding:'0 24px', display:'grid', gap:20}}>
          
          {/* STATS */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14}}>
            {[
              {l:'Total Products', v:products.length, c:'#6366f1', i:'📦'},
              {l:'Synced', v:products.filter(p=>p.syncStatus==='synced').length, c:'#22c55e', i:'✅'},
              {l:'Pending', v:products.filter(p=>p.syncStatus!=='synced').length, c:'#f59e0b', i:'⏳'},
              {l:'Store', v:'Live', c:'#ec4899', i:'🛒'},
            ].map(s=>(
              <div key={s.l} className="card glass" style={{padding:'18px 20px', borderRadius:16, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.05)'}}>
                <div><div style={{fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:0.8}}>{s.l}</div><div style={{fontSize:26, fontWeight:800, color:'#0f172a', marginTop:4}}>{s.v}</div></div>
                <div style={{width:44, height:44, borderRadius:12, background:s.c+'18', color:s.c, display:'grid', placeItems:'center', fontSize:20}}>{s.i}</div>
              </div>
            ))}
          </div>

          {/* ADD FORM */}
          <div className="card glass" style={{borderRadius:20, padding:26, boxShadow:'0 8px 30px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
              <div><h2 style={{fontSize:20, fontWeight:800, color:'#0f172a', letterSpacing:-0.3}}>Product Catalog Management</h2><p style={{fontSize:13, color:'#64748b', marginTop:4}}>Create products with full attribute handling • Auto-sync to WooCommerce</p></div>
              <div style={{background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', padding:'8px 12px', borderRadius:10, fontSize:11, fontWeight:700, color:'#6366f1'}}>ATTRIBUTES • SKU • PRICE • STOCK</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 0.7fr auto', gap:10}}>
              <input className="input" placeholder='Product Name e.g. Cricket Ball Pro' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{padding:'14px 16px', borderRadius:12, border:'2px solid #e2e8f0', color:'#0f172a', fontWeight:600}}/>
              <input className="input" placeholder='SKU e.g. CB-100' value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} style={{padding:'14px 16px', borderRadius:12, border:'2px solid #e2e8f0', color:'#0f172a', fontWeight:600, fontFamily:'monospace'}}/>
              <input className="input" placeholder='Price ₹' value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{padding:'14px 16px', borderRadius:12, border:'2px solid #e2e8f0', color:'#0f172a', fontWeight:600}}/>
              <input className="input" placeholder='Stock' value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} style={{padding:'14px 16px', borderRadius:12, border:'2px solid #e2e8f0', color:'#0f172a', fontWeight:600}}/>
              <button onClick={addProduct} className="btn-primary" style={{padding:'14px 22px', color:'white', border:'none', borderRadius:12, fontWeight:800, cursor:'pointer', letterSpacing:0.3}}>+ Add to PIM</button>
            </div>
          </div>

          {/* LIST */}
          <div className="glass" style={{borderRadius:20, padding:22, boxShadow:'0 8px 30px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
              <h3 style={{fontSize:16, fontWeight:800, color:'#0f172a'}}>Products ({products.length}) • Real-time WooCommerce Sync</h3>
              <div style={{fontSize:11, padding:'6px 10px', borderRadius:100, background:'#0f172a', color:'white', fontWeight:700}}>REST API v3 • Live</div>
            </div>
            <div style={{display:'grid', gap:10}}>
              {products.length===0 && <div style={{padding:40, textAlign:'center', color:'#94a3b8'}}>No products yet. Add one above 👆</div>}
              {products.map(p=>(
                <div key={p.id} className="product-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 18px', background:'white', borderRadius:14, border:'1px solid #f1f5f9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:14}}>
                    <div style={{width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', display:'grid', placeItems:'center', fontSize:20}}>🏏</div>
                    <div>
                      <div style={{display:'flex', alignItems:'center', gap:8}}><b style={{color:'#0f172a', fontSize:15}}>{p.name}</b><span style={{fontFamily:'monospace', background:'#e0e7ff', color:'#4338ca', padding:'3px 8px', borderRadius:6, fontSize:11, fontWeight:700}}>{p.sku}</span></div>
                      <div style={{fontSize:12, color:'#64748b', marginTop:2}}>₹{p.price} • {p.stock} in stock • ID: {p.id.slice(0,6)}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <span style={{padding:'6px 12px', borderRadius:100, fontSize:11, fontWeight:800, letterSpacing:0.5, background:p.syncStatus==='synced'?'#dcfce7':'#fef9c3', color:p.syncStatus==='synced'?'#166534':'#854d0e', border:'1px solid '+(p.syncStatus==='synced'?'#bbf7d0':'#fde68a')}}>{p.syncStatus==='synced'?'● SYNCED':'○ PENDING'}</span>
                    <button disabled={syncingId===p.id} onClick={()=>sync(p.id)} className="btn-sync" style={{background:p.syncStatus==='synced'?'#e2e8f0':'', color:p.syncStatus==='synced'?'#64748b':'white', border:'none', padding:'10px 16px', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer', minWidth:110}}>
                      {syncingId===p.id?'⏳ Syncing...':p.syncStatus==='synced'?'✓ Synced':'🚀 Sync to Woo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{textAlign:'center', padding:'20px 0 10px', color:'#94a3b8', fontSize:12, fontWeight:600}}>Built for Kilowott Hackathon • Flask + React + WooCommerce REST API • Live Store: adventurousballs.s2-tastewp.com</div>
        </div>
      </div>
    </>
  );
}