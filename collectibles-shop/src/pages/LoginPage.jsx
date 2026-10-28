import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await login(username.trim(), password);
      showToast(`Добро пожаловать, ${data.firstName || username}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', paddingTop: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Вход в аккаунт</h1>
      
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', display: 'grid', gap: '16px' }}>
        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Логин</span>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} 
            placeholder="Введите логин" 
            autoComplete="username" 
          />
        </label>
        
        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Пароль</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} 
            placeholder="Введите пароль" 
            autoComplete="current-password" 
          />
        </label>
        
        {error && <span style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error}</span>}
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '8px' }}>
          Нет аккаунта? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Зарегистрироваться</Link>
        </p>
        
        <div style={{ padding: '12px', background: '#f0f0f5', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Для теста: логин <strong>emilys</strong>, пароль <strong>emilyspass</strong>
        </div>
      </form>
    </div>
  );
}