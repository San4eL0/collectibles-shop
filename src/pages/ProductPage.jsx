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

  // Отзывы и оценки
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState('');
  const [revError, setRevError] = useState(null);
  const [revSaving, setRevSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQty(1);
    setImgError(false);
    setMyRating(0);
    setMyText('');
    setRevError(null);

    fetchApi(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    setRevLoading(true);
    fetchApi(`/reviews/product/${id}`)
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setRevLoading(false));
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

  const handleReview = async (e) => {
    e.preventDefault();
    setRevError(null);
    if (!myRating) { setRevError('Выберите оценку (1–5)'); return; }
    if (!myText.trim()) { setRevError('Напишите текст отзыва'); return; }
    setRevSaving(true);
    try {
      const saved = await fetchApi(`/reviews/product/${product.id}`, {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, rating: myRating, text: myText.trim() }),
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviews((prev) => {
        const rest = prev.filter((r) => r.authorId !== saved.authorId);
        return [saved, ...rest];
      });
      setMyRating(0);
      setMyText('');
      showToast('Отзыв опубликован');
    } catch (err) {
      setRevError(err.message);
    } finally {
      setRevSaving(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const imageSrc = imgError || !product.thumbnail
    ? 'https://placehold.co/600x600/141130/00f0ff?text=NO+DATA'
    : assetUrl(product.thumbnail);

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/">Главная</Link> / <Link to="/catalog">Каталог</Link> / <span style={{ color: 'var(--cyan)' }}>{translateTitle(product.title)}</span>
      </nav>

      <div style={{ display: 'grid', gap: '32px', gridAutoRows: 'auto' }} className="product-layout">
        <div style={{ display: 'grid', gap: '16px', alignSelf: 'start', alignContent: 'start' }}>
          <div className="cp-card" style={{ padding: '12px' }}>
            <img
              src={imageSrc}
              alt={translateTitle(product.title)}
              onError={() => setImgError(true)}
              style={{ width: '100%', objectFit: 'cover', borderRadius: 0, display: 'block' }}
            />
          </div>

          {/* Галерея реальных скриншотов из игры — ниже обложки */}
          {product.screenshots?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '10px' }}>
                <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2 }}>/// IN-GAME // СКРИНШОТЫ</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {product.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${translateTitle(product.title)} — скриншот ${i + 1}`}
                    loading="lazy"
                    className="screenshot-img"
                    style={{ width: '100%', display: 'block', border: '1px solid var(--border)', transition: '0.2s' }}
                  />
                ))}
              </div>
            </div>
          )}
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
              {product.stock > 0 ? '► ЗАКАЗАТЬ' : 'НЕТ В НАЛИЧИИ'}
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

          {/* ОТЗЫВЫ И ОЦЕНКИ */}
          <div className="cp-card" style={{ padding: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>ОТЗЫВЫ КОЛЛЕКЦИОНЕРОВ // REVIEWS</h3>
              {avgRating && (
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
                  ★ {avgRating} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({reviews.length})</span>
                </span>
              )}
            </div>

            <form onSubmit={handleReview} style={{ display: 'grid', gap: '10px', marginBottom: reviews.length ? '20px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Оценка:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setMyRating(n)}
                      style={{
                        fontSize: '1.3rem', color: n <= myRating ? 'var(--accent)' : 'var(--border)',
                        background: 'transparent', lineHeight: 1, textShadow: n <= myRating ? '0 0 8px var(--accent)' : 'none',
                      }}
                    >★</button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                value={myText}
                onChange={(e) => setMyText(e.target.value)}
                placeholder="Поделитесь впечатлением о товаре..."
                style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
              />
              {revError && <span style={{ color: 'var(--error)', fontSize: '0.82rem' }}>⚠ {revError}</span>}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={revSaving}>
                  {revSaving ? 'ПУБЛИКАЦИЯ...' : '► ОСТАВИТЬ ОТЗЫВ'}
                </button>
              </div>
            </form>

            {revLoading && <Loader />}

            {!revLoading && reviews.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Отзывов пока нет. Будьте первым!</p>
            )}

            <div style={{ display: 'grid', gap: '14px' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{r.authorName}</strong>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>★ {r.rating}.0</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .product-layout { grid-template-columns: 1fr 1fr !important; }
        }
        @media (hover: hover) {
          .screenshot-img:hover { border-color: var(--border-glow); box-shadow: 0 0 12px var(--border-glow); }
        }
      `}</style>
    </div>
  );
}