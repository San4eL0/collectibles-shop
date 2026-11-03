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

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');
    if (!digits) return '';
    if (digits[0] === '8') digits = '7' + digits.slice(1);
    if (digits[0] !== '7') digits = '7' + digits;

    let formatted = '+7';
    if (digits.length > 1) formatted += ` (${digits.slice(1, 4)}`;
    if (digits.length > 4) formatted += `) ${digits.slice(4, 7)}`;
    if (digits.length > 7) formatted += `-${digits.slice(7, 9)}`;
    if (digits.length > 9) formatted += `-${digits.slice(9, 11)}`;

    return formatted;
  };

  if (!items.length && !submitted) {
    return (
      <div className="container" style={{ paddingTop: '24px' }}>
        <h1 className="section-title" style={{ marginBottom: '16px' }}>ОФОРМЛЕНИЕ ЗАКАЗА</h1>
        <p>Корзина пуста. <Link to="/catalog" style={{ color: 'var(--cyan)' }}>Вернуться в каталог</Link></p>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Укажите имя';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Некорректный email';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length !== 11) newErrors.phone = 'Введите полный номер (11 цифр)';
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
        <div style={{ fontSize: '3.5rem', marginBottom: '16px', color: 'var(--success)', textShadow: '0 0 24px var(--success)' }}>✔</div>
        <h1 className="glitch" data-text="ЗАКАЗ ПОДТВЕРЖДЁН" style={{ marginBottom: '16px' }}>ЗАКАЗ ПОДТВЕРЖДЁН</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Номер операции: <strong style={{ color: 'var(--accent)' }}>#{Math.floor(Math.random() * 9000) + 1000}</strong><br />
          Детали отправлены на {form.email}
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>ПРОДОЛЖИТЬ ПОКУПКИ ►</button>
      </div>
    );
  }

  const field = (label, name, type = 'text', placeholder = '') => (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => {
          setForm({ ...form, [name]: e.target.value });
          if (errors[name]) setErrors({ ...errors, [name]: null });
        }}
        placeholder={placeholder}
        style={{ padding: '12px', border: `1px solid ${errors[name] ? 'var(--error)' : 'var(--border)'}` }}
      />
      {errors[name] && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors[name]}</span>}
    </label>
  );

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <h1 className="section-title" style={{ marginBottom: '24px' }}>ОФОРМЛЕНИЕ ЗАКАЗА</h1>

      <div style={{ display: 'grid', gap: '24px' }} className="checkout-layout">
        <form onSubmit={handleSubmit} className="cp-card" style={{ padding: '24px', display: 'grid', gap: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>ДАННЫЕ ПОЛУЧАТЕЛЯ</h2>
          {field('Имя и фамилия *', 'name', 'text', 'Иван Иванов')}
          {field('Email *', 'email', 'email', 'ivan@example.com')}

          <label style={{ display: 'grid', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Телефон *</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setForm({ ...form, phone: formatted });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="+7 (900) 000-00-00"
              style={{ padding: '12px', border: `1px solid ${errors.phone ? 'var(--error)' : 'var(--border)'}` }}
            />
            {errors.phone && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.phone}</span>}
          </label>

          {field('Адрес доставки *', 'address', 'text', 'Город, улица, дом, квартира')}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            ПОДТВЕРДИТЬ // {Math.round(totalPrice).toLocaleString('ru-RU')} ₥
          </button>
        </form>

        <aside className="cp-card" style={{ padding: '24px', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.05rem' }}>ВАШ ЗАКАЗ</h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '0.9rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                  {translateTitle(item.title)} × {item.quantity}
                </span>
                <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{Math.round(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>ИТОГО</span>
            <span style={{ color: 'var(--cyan)' }}>{Math.round(totalPrice).toLocaleString('ru-RU')} ₽</span>
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