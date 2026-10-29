import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { translateTitle, translateCategory } from '../utils/translate.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem(product);
    showToast(`«${translateTitle(product.title)}» добавлен в корзину`);
  };

  // Если картинка битая, показываем заглушку
  const imageSrc = imgError || !product.thumbnail 
    ? 'https://placehold.co/400x400/e5e0ec/6b4fbb?text=No+Image' 
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
      {/* Ссылка на товар с картинкой */}
      <Link to={`/product/${product.id}`} style={{ aspectRatio: '1', background: '#f0f0f5', display: 'block' }}>
        <img 
          src={imageSrc} 
          alt={translateTitle(product.title)} 
          onError={() => setImgError(true)}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
          loading="lazy" 
        />
      </Link>
      
      {/* Информация о товаре */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        
        {/* Категория */}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {translateCategory(product.category)}
        </span>

        {/* Название */}
        <Link to={`/product/${product.id}`} style={{ 
          fontWeight: 600, 
          fontSize: '0.95rem', 
          lineHeight: 1.3, 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          minHeight: '2.6em'
        }}>
          {translateTitle(product.title)}
        </Link>
        
        {/* Рейтинг */}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ⭐ {product.rating?.toFixed(1) || '—'}
        </span>
        
        {/* Цена и кнопка */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
            {Math.round(product.price * 90)} ₽
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