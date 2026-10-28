import { useEffect, useState } from 'react';
import { fetchApi } from '../services/api';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchApi('/products?limit=50')
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    if (!window.confirm('Вы уверены, что хотите снять товар с продажи?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Управление товарами</h1>
      {error && <Alert type="error" message={error} />}
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 240px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
        />
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>+ Добавить товар</button>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#f0f0f5', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Название</th>
              <th style={{ padding: '12px' }}>Категория</th>
              <th style={{ padding: '12px' }}>Цена</th>
              <th style={{ padding: '12px' }}>Остаток</th>
              <th style={{ padding: '12px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>{p.id}</td>
                <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                <td style={{ padding: '12px' }}>{p.category}</td>
                <td style={{ padding: '12px' }}>{Math.round(p.price * 90)} ₽</td>
                <td style={{ padding: '12px' }}>{p.stock}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModal({ mode: 'edit', product: p })} style={{ color: 'var(--primary)', fontWeight: 600 }}>Ред.</button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--error)', fontWeight: 600 }}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', padding: '16px', zIndex: 1000 }} onClick={() => setModal(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>{modal.mode === 'create' ? 'Новый товар' : 'Редактирование товара'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              В учебном проекте данные не сохраняются на сервере DummyJSON. Форма предназначена для демонстрации интерфейса.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Отмена</button>
              <button className="btn btn-primary" onClick={() => setModal(null)}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}