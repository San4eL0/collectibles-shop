import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useUI } from '../context/UIContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useUI();
  
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Укажите имя';
    if (!form.lastName.trim()) errs.lastName = 'Укажите фамилию';
    if (form.username.trim().length < 3) errs.username = 'Минимум 3 символа';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Некорректный email';
    if (form.password.length < 6) errs.password = 'Минимум 6 символов';
    if (form.password !== form.confirm) errs.confirm = 'Пароли не совпадают';
    
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await fetchApi('/users/add', {
        method: 'POST',
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, username: form.username, email: form.email, password: form.password })
      });
      showToast('Регистрация успешна! Теперь войдите в аккаунт.');
      navigate('/login');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = 'text') => (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
      <input 
        type={type} 
        value={form[name]} 
        onChange={(e) => update(name, e.target.value)}
        style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${errors[name] ? 'var(--error)' : 'var(--border)'}` }} 
      />
      {errors[name] && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors[name]}</span>}
    </label>
  );

  return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Регистрация</h1>
      
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', display: 'grid', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {field('Имя', 'firstName')}
          {field('Фамилия', 'lastName')}
        </div>
        {field('Логин', 'username')}
        {field('Email', 'email', 'email')}
        {field('Пароль', 'password', 'password')}
        {field('Повторите пароль', 'confirm', 'password')}
        
        {errors.submit && <span style={{ color: 'var(--error)' }}>{errors.submit}</span>}
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
        
        <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '8px' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Войти</Link>
        </p>
      </form>
    </div>
  );
}