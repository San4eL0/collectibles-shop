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
    ? 'https://placehold.co/400x400/12161c/5cb8b2?text=No+Image' 
    : product.thumbnail;

  return (
    <div style={{ 
      background: 'var(--surface)', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Link to={`/product/${product.id}`} style={{ aspectRatio: '1', background: 'var(--bg)', display: 'block' }}>
        <img 
          src={imageSrc} 
          alt={product.title} 
          onError={() => setImgError(true)}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
          loading="lazy" 
        />
      </Link>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category === 'vinyl' ? 'Винил' : product.category === 'figures' ? 'Фигурки' : product.category === 'coins' ? 'Монеты' : 'Медали'}
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
    </div>
  );
}
