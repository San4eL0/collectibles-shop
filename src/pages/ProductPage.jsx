import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { translateTitle, translateCategory, translateDescription } from '../utils/translate.js';
import { assetUrl } from '../utils/assetUrl.js';
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
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQty(1);
    setImgError(false);

    fetchApi(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: '24px' }}><Loader /></div>;

  if (error || !product) {
    return (
      <div className="container" style={{ paddingTop: '24px' }}>
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
    showToast(`«${translateTitle(product.title)}» × ${qty} добавлен в корзину`);
  };

  const imageSrc = imgError || !product.thumbnail
    ? 'https://placehold.co/600x600/141130/00f0ff?text=NO+DATA'
    : assetUrl(product.thumbnail);

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/">Главная</Link> / <Link to="/catalog">Каталог</Link> / <span style={{ color: 'var(--cyan)' }}>{translateTitle(product.title)}</span>
      </nav>

      <div style={{ display: 'grid', gap: '32px' }} className="product-layout">
        <div className="cp-card" style={{ padding: '16px' }}>
          <img
            src={imageSrc}
            alt={translateTitle(product.title)}
            onError={() => setImgError(true)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{translateTitle(product.title)}</h1>

          <div style={{ display: 'flex', gap: '18px', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--accent)' }}>★ {product.rating?.toFixed(1) || '—'}</span>
            <span>Артикул: <strong style={{ color: 'var(--text)' }}>{product.sku || product.id}</strong></span>
            <span>База: <strong style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>{product.stock > 0 ? `+${product.stock} шт.` : 'НЕТ'}</strong></span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {translateDescription(product.description)}
          </p>

          <strong style={{ fontSize: '2rem', color: 'var(--cyan)', fontFamily: 'var(--font-display)' }}>
            {Math.round(product.price).toLocaleString('ru-RU')} ₽
          </strong>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: '10px 16px', fontSize: '1.1rem', color: 'var(--cyan)' }}>−</button>
              <span style={{ padding: '0 16px', minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ padding: '10px 16px', fontSize: '1.1rem', color: 'var(--cyan)' }}>+</button>
            </div>

            <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock <= 0}>
              {product.stock > 0 ? '► В АРХИВ ИЗДАНИЯ' : 'НЕТ В НАЛИЧИИ'}
            </button>
            <button className="btn btn-outline" onClick={() => { addItem(product); navigate('/checkout'); }}>
              КУПИТЬ СЕЙЧАС
            </button>
          </div>

          <div className="cp-card" style={{ padding: '20px', marginTop: '8px' }}>
            <h3 className="section-title" style={{ marginBottom: '12px', fontSize: '1rem' }}>ХАРАКТЕРИСТИКИ // SPECS</h3>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
              <dt style={{ color: 'var(--text-muted)' }}>Категория</dt><dd>{translateCategory(product.category)}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Бренд</dt><dd>{product.brand || 'Не указан'}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Вес</dt><dd>{product.weight || '—'} г</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Габариты</dt><dd>{product.dimensions ? `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth} см` : '—'}</dd>
              <dt style={{ color: 'var(--text-muted)' }}>Гарантия</dt><dd>{product.warrantyInformation || '1 год'}</dd>
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