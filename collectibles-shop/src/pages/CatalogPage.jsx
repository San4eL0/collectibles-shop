import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce.js';
import ProductCard from '../components/ProductCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

const CAT_MAP = { vinyl: 'fragrances', figures: 'laptops', coins: 'mens-watches' };

export default function CatalogPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQ = useDebounce(query, 500);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({ maxPrice: 50000, minRating: 0 });
  const [sort, setSort] = useState('default');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const apiCat = category ? CAT_MAP[category] : null;
    let url = '/products?limit=50';
    
    if (debouncedQ) {
      url = `/products/search?q=${debouncedQ}&limit=50`;
    } else if (apiCat) {
      url = `/products/category/${apiCat}?limit=50`;
    }

    fetchApi(url)
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, debouncedQ]);

  // Клиентская фильтрация и сортировка
  const filteredProducts = products
    .filter((p) => p.price * 90 <= filters.maxPrice && (p.rating || 0) >= filters.minRating)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>
          {category ? CAT_MAP[category] : 'Все товары'} 
          {debouncedQ && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — «{debouncedQ}»</span>}
        </h1>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Сортировка:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating-desc">По рейтингу</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gap: '24px' }} className="catalog-layout">
        <FilterPanel 
          filters={filters} 
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} 
          onReset={() => setFilters({ maxPrice: 50000, minRating: 0 })} 
        />
        
        <div>
          {loading && <Loader />}
          {error && <Alert type="error" message={error} />}
          {!loading && !error && filteredProducts.length === 0 && (
            <Alert type="info" message="По вашему запросу ничего не найдено. Попробуйте сбросить фильтры." />
          )}
          {!loading && !error && filteredProducts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .catalog-layout { grid-template-columns: 240px 1fr !important; }
        }
      `}</style>
    </div>
  );
}