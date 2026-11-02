import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchApi } from '../services/api';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchApi(`/carts/user/${user.id}`)
      .then((data) => setOrders(data.carts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>История заказов</h1>
      
      {error && <Alert type="error" message={error} />}
      
      {!error && orders.length === 0 && (
        <Alert 
          type="info" 
          message="У вас пока нет заказов." 
          action={<Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>} 
        />
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {orders.map((order) => (
          <div key={order.id} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <strong style={{ fontSize: '1.1rem' }}>Заказ #{order.id}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {order.products?.length || 0} позиций · {Math.round((order.total || 0) * 90)} ₽
              </span>
            </div>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {(order.products || []).map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>{p.title} × {p.quantity}</span>
                  <span>{Math.round((p.price || 0) * p.quantity * 90)} ₽</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
              Статус: <strong style={{ color: 'var(--primary)' }}>В обработке</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}