import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { translateTitle } from '../utils/translate.js';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!items.length && !submitted) {
    return (
      <div className="container" style={{ paddingTop: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Оформление заказа</h1>
        <p>Корзина пуста. <Link to="/catalog" style={{ color: 'var(--primary)' }}>Вернуться в каталог</Link></p>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Укажите имя';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Некорректный email';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Некорректный телефон';
    if (!form.address.trim()) newErrors.address = 'Укажите адрес доставки';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitted(true);
    clearCart();
    showToast('Заказ успешно оформлен!');
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '64px 16px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ marginBottom: '16px' }}>Заказ оформлен!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Номер вашего заказа: <strong>#{Math.floor(Math.random() * 9000) + 1000}</strong><br/>
          Мы отправим детали на {form.email}
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>Продолжить покупки</button>
      </div>
    );
  }

  const field = (label, name, type = 'text', placeholder = '') => (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => {
          setForm({ ...form, [name]: e.target.value });
          if (errors[name]) setErrors({ ...errors, [name]: null });
        }}
        placeholder={placeholder}
        style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${errors[name] ? 'var(--error)' : 'var(--border)'}` }}
      />
      {errors[name] && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors[name]}</span>}
    </label>
  );

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Оформление заказа</h1>
      
      <div style={{ display: 'grid', gap: '24px' }} className="checkout-layout">
        <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', display: 'grid', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Данные получателя</h2>
          {field('Имя и фамилия *', 'name', 'text', 'Иван Иванов')}
          {field('Email *', 'email', 'email', 'ivan@example.com')}
          {field('Телефон *', 'phone', 'tel', '+7 (900) 000-00-00')}
          {field('Адрес доставки *', 'address', 'text', 'Город, улица, дом, квартира')}
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Подтвердить заказ на {Math.round(totalPrice * 90)} ₽
          </button>
        </form>

        <aside style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Ваш заказ</h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '0.9rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {translateTitle(item.title)} × {item.quantity}
                </span>
                <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{Math.round(item.price * item.quantity * 90)} ₽</span>
              </div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Итого</span>
            <span style={{ color: 'var(--primary)' }}>{Math.round(totalPrice * 90)} ₽</span>
          </div>
        </aside>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr 320px !important; }
        }
      `}</style>
    </div>
  );
}