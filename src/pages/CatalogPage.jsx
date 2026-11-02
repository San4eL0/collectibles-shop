import { useEffect, useState, useMemo } from 'react';
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
  
  // Фильтры
  const [maxPrice, setMaxPrice] = useState(1000000); // По умолчанию миллион
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('default');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    const apiCat = category ? CAT_MAP[category] : null;
    let url = '/products?limit=194';
    
    if (debouncedQ) {
      url = `/products/search?q=${debouncedQ}&limit=194`;
    } else if (apiCat) {
      url = `/products/category/${apiCat}?limit=194`;
    }

    fetchApi(url)
      .then((data) => {
        if (isMounted) setProducts(data.products || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [category, debouncedQ]);

  // Вычисляем самую высокую цену в текущей категории для ползунка
  const absoluteMaxPrice = useMemo(() => {
    if (!products.length) return 100000;
    const max = Math.max(...products.map(p => Math.round(p.price * 90)));
    return Math.ceil(max / 1000) * 1000; // Округляем до тысяч вверх
  }, [products]);

  // Если сменилась категория, сбрасываем ползунок на максимум
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
    setMinRating(0);
  }, [absoluteMaxPrice]);

  // Клиентская фильтрация и сортировка
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const rubPrice = Math.round(p.price * 90);
        return rubPrice <= maxPrice && (p.rating || 0) >= minRating;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, maxPrice, minRating, sort]);

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>
          {category === 'vinyl' ? 'Винил' : category === 'figures' ? 'Фигурки' : category === 'coins' ? 'Монеты' : 'Все товары'} 
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

      <div style={{ display: 'grid', gap: '24px' }} className="catalog-layout">
        <FilterPanel 
          maxPrice={maxPrice}
          absoluteMaxPrice={absoluteMaxPrice}
          minRating={minRating}
          onChangePrice={setMaxPrice}
          onChangeRating={setMinRating}
          onReset={() => { setMaxPrice(absoluteMaxPrice); setMinRating(0); }} 
        />
        
        <div>
          {loading && <Loader />}
          {error && <Alert type="error" message={error} />}
          
          {!loading && !error && filteredProducts.length === 0 && (
            <Alert type="info" message="По вашему запросу ничего не найдено. Попробуйте сбросить фильтры или увеличить цену." />
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
