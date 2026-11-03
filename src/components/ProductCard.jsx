import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { assetUrl } from '../utils/assetUrl.js';

const CATEGORY_ICONS = {
  vinyl: '◉',
  figures: '▲',
  coins: '◎',
  medals: '◈',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();

  const handleAdd = () => {
    addItem(product);
    showToast(`«${product.title}» добавлен в корзину`);
  };

  const icon = CATEGORY_ICONS[product.category] || '◆';

  return (
    <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Категорийный ярлык */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(10,9,20,0.75)', padding: '2px 8px',
        border: '1px solid var(--border-glow)',
        fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 1,
        color: 'var(--cyan)',
      }}>
        {icon} LOG-{String(product.id).padStart(3, '0')}
      </div>

      {/* Картинка товара */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', overflow: 'hidden', aspectRatio: '1', textDecoration: 'none', position: 'relative' }}>
        <img
          src={assetUrl(product.thumbnail)}
          alt={product.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 0.4s', filter: 'contrast(1.1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.filter = 'contrast(1.2) saturate(1.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'contrast(1.1)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,240,255,0.15))', pointerEvents: 'none' }} />
      </Link>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Link to={`/product/${product.id}`} style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.6em', color: 'var(--text)' }}>
          {product.title}
        </Link>

        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
          ★ {product.rating?.toFixed(1) || '—'} / 5.0
        </span>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: 'var(--cyan)', fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>
            {product.price.toLocaleString('ru-RU')} ₥
          </strong>
          <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.75rem', minHeight: '34px' }}>
            ▸ АРХИВИРОВАТЬ
          </button>
        </div>
      </div>
    </div>
  );
}