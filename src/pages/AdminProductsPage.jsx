import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { fetchApi } from '../services/api';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconClose } from '../components/icons.jsx';

const CATEGORIES = [
  { id: 'vinyl', name: 'Виниловые пластинки' },
  { id: 'figures', name: 'Коллекционные фигурки' },
  { id: 'coins', name: 'Монеты и нумизматика' },
  { id: 'medals', name: 'Медали и ордена' },
];

const emptyForm = { title: '', category: 'figures', era: 'modern', price: '', rating: '4.5', stock: '1', thumbnail: '', description: '', };

export default function AdminProductsPage() {
  const { user } = useAuth();
  const { showToast } = useUI();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'create' } | { mode: 'edit', product }
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchApi('/products?limit=200')
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '',
      category: p.category || 'figures',
      era: p.era || 'modern',
      price: p.price != null ? String(p.price) : '',
      rating: p.rating != null ? String(p.rating) : '4.5',
      stock: p.stock != null ? String(p.stock) : '1',
      thumbnail: p.thumbnail || '',
      description: p.description || '',
    });
    setModal({ mode: 'edit', product: p });
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('Укажите название товара', 'error'); return; }
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) { showToast('Укажите корректную цену', 'error'); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      era: form.era,
      price,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 4.5)),
      stock: Math.max(0, Number(form.stock) || 1),
      thumbnail: form.thumbnail.trim(),
      description: form.description.trim(),
    };

    try {
      if (modal.mode === 'create') {
        await fetchApi('/products', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Товар добавлен в базу');
      } else {
        const res = await fetchApi(`/products/${modal.product.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res?.error === 'not_custom') { showToast('Базовые товары редактировать нельзя', 'error'); setModal(null); setSaving(false); return; }
        showToast('Товар обновлён');
      }
      setModal(null);
      load();
    } catch (e) {
      showToast('Ошибка сохранения', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetchApi(`/products/${id}`, { method: 'DELETE' });
    if (res?.custom) {
      showToast('Товар удалён');
      load();
    } else {
      showToast('Базовые товары удалять нельзя', 'error');
    }
  };

  if (loading) return <div className="container"><Loader /></div>;

  const inputStyle = (borderColor = 'var(--border)') => ({ padding: '10px 12px', border: `1px solid ${borderColor}`, width: '100%' });

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginBottom: '24px' }}>УПРАВЛЕНИЕ БАЗОЙ // ADMIN</h1>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Создатель:</span>
        <strong style={{ color: 'var(--cyan)' }}>{user?.firstName} {user?.lastName}</strong>
        <span style={{ color: 'var(--text-muted)' }}>•</span>
        <span style={{ color: 'var(--text-muted)' }}>Ваши товары сохраняются в этом браузере (localStorage) и видны только вам.</span>
      </div>

      {error && <Alert type="error" message={error} />}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
        <input
          type="search"
          placeholder="Поиск по названию или ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 240px', padding: '12px' }}
        />
        <button className="btn btn-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <IconPuls width={16} height={16} /> Добавить товар
        </button>
      </div>

      <div className="cp-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '820px' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>ID</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Название</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Категория</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Цена</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Остаток</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Тип</th>
              <th style={{ padding: '12px', color: 'var(--cyan)' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.id}{p.custom ? '*' : ''}</td>
                <td style={{ padding: '12px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{CATEGORIES.find(c => c.id === p.category)?.name || p.category}</td>
                <td style={{ padding: '12px', color: 'var(--cyan)' }}>{Math.round(p.price).toLocaleString('ru-RU')} ₽</td>
                <td style={{ padding: '12px', color: p.stock > 0 ? 'var(--success)' : 'var(--error)' }}>{p.stock}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', border: '1px solid', color: p.custom ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {p.custom ? 'СВОЙ' : 'БАЗА'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => p.custom ? openEdit(p) : showToast('Базовые товары редактировать нельзя', 'error')}
                      style={{ color: 'var(--cyan)', fontWeight: 600, display: 'inline-flex', gap: 4, alignItems: 'center' }}
                    ><IconEdit width={14} height={14} /> Ред.</button>
                    <button
                      onClick={() => window.confirm('Удалить этот товар?') && handleDelete(p.id)}
                      style={{ color: 'var(--error)', fontWeight: 600, display: 'inline-flex', gap: 4, alignItems: 'center' }}
                    ><IconTrash width={14} height={14} /> Удал.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>* — ваши товары (хранится в localStorage этого браузера).</p>

      {/* Модальное окно формы */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,3,10,0.8)', display: 'grid', placeItems: 'center', padding: '16px', zIndex: 1000 }} onClick={() => setModal(null)}>
          <div className="cp-card" style={{ padding: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 className="section-title" style={{ margin: 0 }}>{modal.mode === 'create' ? 'НОВЫЙ ТОВАР' : 'РЕДАКТИРОВАНИЕ ТОВАРА'}</h3>
              <button onClick={() => setModal(null)} style={{ color: 'var(--text-muted)' }}><IconClose width={20} height={20} /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
              Все поля помеченные * обязательны. Товар сохранится в вашем браузере.
            </p>

            <div style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Название *</span>
                <input style={inputStyle()} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Например: Фигурка R2-D2 1/6" />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Категория *</span>
                  <select style={inputStyle()} value={form.category} onChange={(e) => update('category', e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Эпоха</span>
                  <select style={inputStyle()} value={form.era} onChange={(e) => update('era', e.target.value)}>
                    <option value="modern">Современные</option>
                    <option value="vintage">Раритетные</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Цена, ₽ *</span>
                  <input type="number" min="0" style={inputStyle()} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="4500" />
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Рейтинг</span>
                  <input type="number" step="0.1" min="1" max="5" style={inputStyle()} value={form.rating} onChange={(e) => update('rating', e.target.value)} />
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Остаток</span>
                  <input type="number" min="0" style={inputStyle()} value={form.stock} onChange={(e) => update('stock', e.target.value)} />
                </label>
              </div>

              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ссылка на фото (URL)</span>
                <input type="url" style={inputStyle()} value={form.thumbnail} onChange={(e) => update('thumbnail', e.target.value)} placeholder="https://... (можно оставить пустым)" />
              </label>

              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Описание</span>
                <textarea rows={4} style={inputStyle()} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Краткое описание товара..." />
              </label>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn btn-outline" onClick={() => setModal(null)}>Отмена</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <IconCheck width={16} height={16} /> {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}