import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem(product);
    showToast(`«${product.title}» добавлен в корзину`);
  };

  const imageSrc = imgError || !product.thumbnail 
    ? 'https://placehold.co/400x400/e5e0ec/6b4fbb?text=No+Image' 
    : product.thumbnail;

  return (
    <div className="product-card" style={{ 
      background: 'var(--surface)', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Link to={`/product/${product.id}`} style={{ aspectRatio: '1', background: '#fff', display: 'block', overflow: 'hidden' }}>
        <img 
          src={imageSrc} 
          alt={product.title} 
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', /* Contain, чтобы фигурки/монеты не обрезались */
            padding: '10px',
            transition: 'transform 0.3s ease'
          }} 
          className="product-image"
          loading="lazy" 
        />
      </Link>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category === 'vinyl' ? 'Винил' : product.category === 'figures' ? 'Фигурки' : 'Монеты'}
        </span>

        <Link to={`/product/${product.id}`} style={{ 
          fontWeight: 600, 
          fontSize: '0.95rem', 
          lineHeight: 1.3, 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          minHeight: '2.6em',
          color: 'var(--text)'
        }}>
          {product.title}
        </Link>
        
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ⭐ {product.rating?.toFixed(1) || '—'}
        </span>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
            {product.price.toLocaleString('ru-RU')} ₽
          </strong>
          <button 
            onClick={handleAdd} 
            className="btn btn-primary" 
            style={{ padding: '6px 12px', fontSize: '0.85rem', minHeight: '36px' }}
          >
            + В корзину
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
