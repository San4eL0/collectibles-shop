import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { assetUrl } from '../utils/assetUrl.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();

  const handleAdd = () => {
    addItem(product);
    showToast(`«${product.title}» добавлен в корзину`);
  };

  return (
    <div style={{ 
      background: 'var(--surface)', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* Картинка товара */}
      <Link to={`/product/${product.id}`} style={{ 
        display: 'block', 
        overflow: 'hidden',
        aspectRatio: '1', 
        textDecoration: 'none',
      }}
      >
        <img 
          src={assetUrl(product.thumbnail)} 
          alt={product.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block', 
            transition: 'transform 0.3s' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Link>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
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
