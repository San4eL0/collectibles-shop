import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce.js';
import ProductCard from '../components/ProductCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function CatalogPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQ = useDebounce(query, 500);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [era, setEra] = useState('all'); // Фильтр по эпохе
  const [sort, setSort] = useState('default');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    let url = '/products';
    if (debouncedQ) {
      url = `/products/search?q=${debouncedQ}`;
    } else if (category) {
      url = `/products/category/${category}`;
    }

    fetchApi(url)
      .then((data) => { if (isMounted) setProducts(data.products || []); })
      .catch((err) => { if (isMounted) setError(err.message); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [category, debouncedQ]);

  const absoluteMaxPrice = useMemo(() => {
    if (!products.length) return 100000;
    const max = Math.max(...products.map(p => p.price));
    return Math.ceil(max / 1000) * 1000;
  }, [products]);

  useEffect(() => { setMaxPrice(absoluteMaxPrice); }, [absoluteMaxPrice]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchPrice = p.price <= maxPrice;
        const matchRating = (p.rating || 0) >= minRating;
        const matchEra = era === 'all' || p.era === era;
        return matchPrice && matchRating && matchEra;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, maxPrice, minRating, era, sort]);

  const getCategoryName = () => {
    const map = { vinyl: 'Винил', figures: 'Фигурки', coins: 'Монеты', medals: 'Медали' };
    return category ? map[category] : 'Все товары';
  };

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>
          {getCategoryName()}
          {debouncedQ && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — «{debouncedQ}»</span>}
        </h1>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Сортировка:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating-desc">По рейтингу</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gap: '24px', alignItems: 'start' }} className="catalog-layout">
        
        {/* Оборачиваем FilterPanel в sticky-контейнер */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <FilterPanel 
            maxPrice={maxPrice}
            absoluteMaxPrice={absoluteMaxPrice}
            minRating={minRating}
            era={era}
            onChangePrice={setMaxPrice}
            onChangeRating={setMinRating}
            onChangeEra={setEra}
            onReset={() => { setMaxPrice(absoluteMaxPrice); setMinRating(0); setEra('all'); }} 
          />
        </div>
        
        <div>
          {loading && <Loader />}
          {error && <Alert type="error" message={error} />}
          
          {!loading && !error && filteredProducts.length === 0 && (
            <Alert type="info" message="По вашему запросу ничего не найдено. Попробуйте сбросить фильтры." />
          )}
          
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
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
