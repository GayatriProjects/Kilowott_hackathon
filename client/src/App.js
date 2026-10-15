import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '10' });
  const API = 'http://localhost:5000/api';

  useEffect(() => { axios.get(API + '/products').then(r => setProducts(r.data)).catch(()=>{}); }, []);

  const addProduct = async () => {
    if(!form.name || !form.sku) return alert('Enter name and sku');
    const res = await axios.post(API + '/products', form);
    setProducts([...products, res.data]);
    setForm({ name: '', sku: '', price: '', stock: '10' });
  };

  const sync = async (id) => {
    try{
      await axios.post(API + '/sync/' + id);
      alert('SYNCED to WooCommerce! Check WooCommerce > Products');
      const r = await axios.get(API + '/products');
      setProducts(r.data);
    }catch(e){ alert('Sync failed - check server terminal'); }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <h1>SyncKart - PIM System - Gayatri Gawas</h1>
      <p><b>Live Store:</b> adventurousballs.s2-tastewp.com - Connected to WooCommerce</p>
      <div style={{ border: '2px solid blue', padding: 15, marginBottom: 20, background: '#f0f8ff' }}>
        <h3>1. Product Catalog Management</h3>
        <input placeholder='Product Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{padding:8, margin:5}} />
        <input placeholder='SKU' value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} style={{padding:8, margin:5}} />
        <input placeholder='Price' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{padding:8, margin:5}} />
        <input placeholder='Stock' value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={{padding:8, margin:5}} />
        <button onClick={addProduct} style={{padding:'8px 15px', background:'blue', color:'white', border:'none', cursor:'pointer'}}>Add to PIM</button>
      </div>
      <h3>2. Attribute Handling + 3. Data Synchronization</h3>
      <table border='1' cellPadding='10' style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead style={{background:'#eee'}}><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {products.length === 0 ? <tr><td colSpan='6' style={{textAlign:'center'}}>No products yet. Add one above.</td></tr> : products.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.sku}</td><td>{p.price}</td><td>{p.stock}</td><td>{p.syncStatus}</td><td><button onClick={() => sync(p.id)} style={{background:'green', color:'white', padding:'5px 10px', border:'none', cursor:'pointer'}}>Sync to Woo</button></td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
