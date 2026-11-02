import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();

  const handleAdd = () => {
    addItem(product);
    showToast(`«${product.title}» добавлен в корзину`);
  };

  // Выбираем эмодзи и цвет в зависимости от категории
  let emoji = '📦';
  let bgColor = '#e5e0ec'; // Стандартный светлый фон
  let textColor = '#6b4fbb';

  if (product.category === 'vinyl') {
    emoji = '💿';
    bgColor = '#2a1b38'; // Темно-фиолетовый
    textColor = '#e8b84b';
  } else if (product.category === 'figures') {
    emoji = '🗿';
    bgColor = '#1b2a38'; // Темно-синий
    textColor = '#5cb8b2';
  } else if (product.category === 'coins') {
    emoji = '🪙';
    bgColor = '#382e1b'; // Темно-золотой
    textColor = '#f8d66d';
  } else if (product.category === 'medals') {
    emoji = '🎖️';
    bgColor = '#381b1b'; // Темно-красный
    textColor = '#ff6b6b';
  }

  const categoryName = {
    vinyl: 'Винил',
    figures: 'Фигурки',
    coins: 'Монеты',
    medals: 'Медали'
  }[product.category] || 'Товар';

  return (
    <div style={{ 
      background: 'var(--surface)', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* Вместо картинки — красивый CSS-блок с эмодзи */}
      <Link to={`/product/${product.id}`} style={{ 
        aspectRatio: '1', 
        background: bgColor, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: textColor,
        textDecoration: 'none',
        transition: 'filter 0.3s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
      onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
      >
        <span style={{ fontSize: '4rem', marginBottom: '8px' }}>{emoji}</span>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
          {categoryName}
        </span>
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
