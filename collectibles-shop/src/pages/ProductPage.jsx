import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useUI();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQty(1);
    fetchApi(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><Loader /></div>;
  if (error || !product) {
    return (
      <div className="container">
        <Alert 
          type="error" 
          message={`Товар не найден: ${error || 'Ошибка 404'}`} 
          action={<button className="btn btn-primary" onClick={() => navigate('/catalog')}>В каталог</button>}
        />
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    showToast(`«${product.title}» × ${qty} добавлен в корзину`);
  };

  return (
    <div className="container">
      <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/">Главная</Link> / <Link to="/catalog">Каталог</Link> / <span>{product.title}</span>
      </nav>

      <div style={{ display: 'grid', gap: '32px' }} className="product-layout">
        <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
          <img src={product.thumbnail} alt={product.title} style={{ width: '100%', borderRadius: '8px' }} />
        </div>
        
        <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{product.title}</h1>
          
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span>⭐ {product.rating?.toFixed(1) || 'Нет оценок'}</span>
            <span>Артикул: {product.sku || product.id}</span>
            <span>В наличии: {product.stock} шт.</span>
          </div>

          <p style={{ color: 'var(--text-muted)' }}>{product.description}</p>
          
          <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>
            {Math.round(product.price * 90)} ₽
          </strong>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: '10px 16px', fontSize: '1.1rem' }}>−</button>
              <span style={{ padding: '0 16px', minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ padding: '10px 16px', fontSize: '1.1rem' }}>+</button>
            </div>
            
            <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock <= 0}>
              {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
            </button>
            <button className="btn btn-outline" onClick={() => { addItem(product); navigate('/checkout'); }}>
              Купить сейчас
            </button>
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '20px', marginTop: '8px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.05rem' }}>Характеристики</h3>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <dt style={{ color: 'var(--text-muted)' }}>Категория</dt><dd>{product.category}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Вес</dt><dd>{product.weight || '—'} г</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Габариты</dt><dd>{product.dimensions ? `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth} см` : '—'}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Гарантия</dt><dd>{product.warrantyInformation || '—'}</dd>
            </dl>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .product-layout { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}