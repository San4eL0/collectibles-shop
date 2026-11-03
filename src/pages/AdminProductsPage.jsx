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
      <h1 className="section-title" style={{ marginBottom: '24px' }}>УПРАВЛЕНИЕ БАЗОЙ // ADMIN</h1>
      {error && <Alert type="error" message={error} />}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Сканировать базу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 240px', padding: '12px' }}
        />
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>+ ДОБАВИТЬ ТОВАР</button>
      </div>

      <div className="cp-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>ID</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Название</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Категория</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Цена</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Остаток</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.id}</td>
                <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.category}</td>
                <td style={{ padding: '12px', color: 'var(--cyan)' }}>{Math.round(p.price).toLocaleString('ru-RU')} ₽</td>
                <td style={{ padding: '12px', color: p.stock > 0 ? 'var(--success)' : 'var(--error)' }}>{p.stock}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setModal({ mode: 'edit', product: p })} style={{ color: 'var(--cyan)', fontWeight: 600 }}>РЕД.</button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--error)', fontWeight: 600 }}>УДАЛИТЬ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,3,10,0.8)', display: 'grid', placeItems: 'center', padding: '16px', zIndex: 1000 }} onClick={() => setModal(null)}>
          <div className="cp-card" style={{ padding: '24px', width: '100%', maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="section-title" style={{ marginBottom: '16px' }}>{modal.mode === 'create' ? 'НОВЫЙ ТОВАР' : 'РЕДАКТИРОВАНИЕ'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              В учебном проекте данные не сохраняются на сервере DummyJSON. Форма предназначена для демонстрации интерфейса.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>ОТМЕНА</button>
              <button className="btn btn-primary" onClick={() => setModal(null)}>СОХРАНИТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}