import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { translateTitle } from '../utils/translate.js';
import { assetUrl } from '../utils/assetUrl.js';
import Alert from '../components/Alert.jsx';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '24px' }}>
        <h1 className="section-title" style={{ marginBottom: '24px' }}>КОРЗИНА // CART</h1>
        <Alert
          type="info"
          message="Ваша корзина пуста."
          action={<Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <h1 className="section-title" style={{ marginBottom: '24px' }}>КОРЗИНА // CART</h1>

      <div style={{ display: 'grid', gap: '24px' }} className="cart-layout">
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((item) => {
            if (!item || !item.id) return null;

            return (
              <div key={item.id} className="cp-card" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '16px', alignItems: 'center', padding: '16px',
              }}>
                <img
                  src={assetUrl(item.thumbnail) || 'https://placehold.co/80x80?text=No+Img'}
                  alt={translateTitle(item.title)}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />

                <div style={{ display: 'grid', gap: '6px' }}>
                  <Link to={`/product/${item.id}`} style={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {translateTitle(item.title)}
                  </Link>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{Math.round(item.price || 0).toLocaleString('ru-RU')} ₽</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <button className="btn btn-outline" style={{ padding: '2px 10px', minHeight: '30px' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity || 1}</span>
                    <button className="btn btn-outline" style={{ padding: '2px 10px', minHeight: '30px' }} onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px', justifyItems: 'end' }}>
                  <strong style={{ color: 'var(--cyan)' }}>{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('ru-RU')} ₽</strong>
                  <button onClick={() => removeItem(item.id)} style={{ color: 'var(--error)', fontSize: '0.85rem' }}>✕ Удалить</button>
                </div>
              </div>
            );
          })}
          <button onClick={clearCart} className="btn btn-outline" style={{ justifySelf: 'start' }}>ОЧИСТИТЬ КОРЗИНУ</button>
        </div>

        <aside className="cp-card" style={{ padding: '24px', alignSelf: 'start', display: 'grid', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem' }}>ИТОГО</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Товары</span><span>{Math.round(totalPrice || 0).toLocaleString('ru-RU')} ₽</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Доставка</span><span style={{ color: 'var(--success)' }}>FREE</span>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, var(--border-glow), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
            <span>К ОПЛАТЕ</span>
            <span style={{ color: 'var(--cyan)' }}>{Math.round(totalPrice || 0).toLocaleString('ru-RU')} ₽</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>ОФОРМИТЬ ЗАКАЗ ►</button>
          <Link to="/catalog" className="btn btn-outline" style={{ textAlign: 'center' }}>ПРОДОЛЖИТЬ ПОКУПКИ</Link>
        </aside>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .cart-layout { grid-template-columns: 1fr 320px !important; }
        }
      `}</style>
    </div>
  );
}