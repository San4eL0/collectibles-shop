import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

const CATEGORIES = [
  { id: 'vinyl', name: 'Виниловые пластинки', icon: '💿', api: 'fragrances' },
  { id: 'figures', name: 'Коллекционные фигурки', icon: '🗿', api: 'laptops' },
  { id: 'coins', name: 'Монеты и нумизматика', icon: '🪙', api: 'mens-watches' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/products?limit=8&sortBy=rating&order=desc')
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      {/* Баннер */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary), #9a7ee8)',
        color: '#fff', padding: '48px 24px', borderRadius: '16px', marginBottom: '40px',
        display: 'grid', gap: '16px'
      }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', lineHeight: 1.2 }}>
          Редкие сокровища для настоящих коллекционеров
        </h1>
        <p style={{ maxWidth: '560px', opacity: 0.9 }}>
          Виниловые пластинки, эксклюзивные фигурки, нумизматика и другие коллекционные товары с проверенной историей.
        </p>
        <div>
          <Link to="/catalog" className="btn" style={{ background: '#fff', color: 'var(--primary)' }}>
            Перейти в каталог →
          </Link>
        </div>
      </section>

      {/* Категории */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Категории</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog/${cat.id}`}
              style={{
                background: 'var(--surface)', borderRadius: '12px', padding: '20px 16px',
                textAlign: 'center', boxShadow: 'var(--shadow)', display: 'grid', gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Популярные товары */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Популярное</h2>
          <Link to="/catalog" style={{ color: 'var(--primary)', fontWeight: 600 }}>Все товары →</Link>
        </div>
        {loading && <Loader />}
        {error && <Alert type="error" message={error} />}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}