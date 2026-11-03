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
      <h1 className="section-title" style={{ marginBottom: '24px' }}>ВХОД В АККАУНТ // LOGIN</h1>

      <form onSubmit={handleSubmit} className="cp-card" style={{ padding: '24px', display: 'grid', gap: '16px' }}>
        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>ЛОГИН</span>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '12px' }} placeholder="Идентификатор" autoComplete="username" />
        </label>

        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>ПАРОЛЬ</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px' }} placeholder="Код доступа" autoComplete="current-password" />
        </label>

        {error && <span style={{ color: 'var(--error)', fontSize: '0.9rem' }}>⚠ {error}</span>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'ПОДКЛЮЧЕНИЕ...' : '► ВОЙТИ'}
        </button>

        <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '8px' }}>
          Нет доступа? <Link to="/register" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Создать аккаунт</Link>
        </p>

        <div style={{ padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Тест: логин <strong style={{ color: 'var(--accent)' }}>emilys</strong>, пароль <strong style={{ color: 'var(--accent)' }}>emilyspass</strong>
        </div>
      </form>
    </div>
  );
}