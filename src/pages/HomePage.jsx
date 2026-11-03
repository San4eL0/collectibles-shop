import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import ProductCard from '../components/ProductCard.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

const CATEGORIES = [
  { id: 'games', name: 'Лимитированные игры', code: 'GMS', apx: 'Игровая полка', href: '/games' },
  { id: 'vinyl', name: 'Виниловые пластинки', code: 'AU', apx: '∀udioTrf', href: '/catalog/vinyl' },
  { id: 'figures', name: 'Коллекционные фигурки', code: 'FIG', apx: 'Джunk Tech', href: '/catalog/figures' },
  { id: 'coins', name: 'Монеты и нумизматика', code: 'NNM', apx: 'Едди-отдел', href: '/catalog/coins' },
  { id: 'medals', name: 'Медали и ордена', code: 'MDL', apx: 'Орденск. База', href: '/catalog/medals' },
];

const GLYPHS = ['◈', '◉', '▲', '◎', '◆'];

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
      {/* Слайдер */}
      <HeroSlider />

      {/* Категории */}
      <section style={{ marginBottom: '40px' }}>
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>КАТЕГОРИИ // 데이터</h2>
        <div className="divider" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="cp-card"
              style={{
                padding: '20px 16px', textAlign: 'center', display: 'grid', gap: '8px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <span style={{ fontSize: '1.8rem', color: 'var(--cyan)', textShadow: '0 0 16px var(--cyan)' }}>{GLYPHS[i % GLYPHS.length]}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                TREE:{cat.code} // {cat.apx}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Популярные товары */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>ПОПУЛЯРНОЕ // FAV</h2>
          <Link to="/catalog" className="btn btn-outline" style={{ fontWeight: 600 }}>ВСЕ ТОВАРЫ →</Link>
        </div>
        {loading && <Loader />}
        {error && <Alert type="error" message={error} />}
        {!loading && !error && (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}