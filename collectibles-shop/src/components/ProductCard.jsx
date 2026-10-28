import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useUI();
  const handleAdd = () => { addItem(product); showToast('Добавлено в корзину'); };

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product.id}`} style={{ aspectRatio: '1', background: '#f0f0f0' }}>
        <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
      </Link>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <Link to={`/product/${product.id}`} style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>{product.title}</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⭐ {product.rating?.toFixed(1)}</span>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: 'var(--primary)' }}>{Math.round(product.price * 90)} ₽</strong>
          <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', minHeight: 32 }}>+</button>
        </div>
      </div>
    </div>
  );
}