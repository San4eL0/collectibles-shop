import { useEffect, useState } from 'react';
import { fetchApi } from '../services/api';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

const STATUSES = {
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    fetchApi('/carts?limit=20')
      .then((data) => setOrders(data.carts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginBottom: '24px' }}>УПРАВЛЕНИЕ ЗАКАЗАМИ // OPS</h1>
      {error && <Alert type="error" message={error} />}

      <div className="cp-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>ID заказа</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Позиций</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Сумма</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{o.id}</td>
                <td style={{ padding: '12px' }}>{o.products?.length || 0}</td>
                <td style={{ padding: '12px', color: 'var(--cyan)' }}>{Math.round(o.total || 0).toLocaleString('ru-RU')} ₽</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={statuses[o.id] || 'processing'}
                    onChange={(e) => setStatuses((s) => ({ ...s, [o.id]: e.target.value }))}
                    style={{ padding: '8px' }}
                  >
                    {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}