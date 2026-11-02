import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { translateTitle } from '../utils/translate.js';
import Alert from '../components/Alert.jsx';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '24px' }}>
        <h1 style={{ marginBottom: '24px' }}>Корзина</h1>
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
      <h1 style={{ marginBottom: '24px' }}>Корзина</h1>
      
      <div style={{ display: 'grid', gap: '24px' }} className="cart-layout">
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((item) => {
            if (!item || !item.id) return null; 
            
            return (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '16px', alignItems: 'center',
                background: 'var(--surface)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)',
              }}>
                <img 
                  src={item.thumbnail || 'https://placehold.co/80x80?text=No+Img'} 
                  alt={translateTitle(item.title)} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                
                <div style={{ display: 'grid', gap: '6px' }}>
                  <Link to={`/product/${item.id}`} style={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {translateTitle(item.title)}
                  </Link>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{Math.round((item.price || 0) * 90)} ₽</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <button className="btn btn-outline" style={{ padding: '2px 10px', minHeight: '30px' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity || 1}</span>
                    <button className="btn btn-outline" style={{ padding: '2px 10px', minHeight: '30px' }} onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '8px', justifyItems: 'end' }}>
                  <strong>{Math.round((item.price || 0) * (item.quantity || 1) * 90)} ₽</strong>
                  <button onClick={() => removeItem(item.id)} style={{ color: 'var(--error)', fontSize: '0.85rem' }}>Удалить</button>
                </div>
              </div>
            );
          })}
          <button onClick={clearCart} className="btn btn-outline" style={{ justifySelf: 'start' }}>Очистить корзину</button>
        </div>

        <aside style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', alignSelf: 'start', display: 'grid', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Итого</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Товары</span><span>{Math.round((totalPrice || 0) * 90)} ₽</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Доставка</span><span>Бесплатно</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
            <span>К оплате</span>
            <span style={{ color: 'var(--primary)' }}>{Math.round((totalPrice || 0) * 90)} ₽</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Оформить заказ</button>
          <Link to="/catalog" className="btn btn-outline" style={{ textAlign: 'center' }}>Продолжить покупки</Link>
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