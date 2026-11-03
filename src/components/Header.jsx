import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  IconSearch, IconCart, IconUser, IconLogout, IconSun, IconMoon, IconGrid,
} from './icons.jsx';

const CATEGORIES = [
  { id: 'all', name: 'Все' },
  { id: 'vinyl', name: 'Винил' },
  { id: 'figures', name: 'Фигурки' },
  { id: 'coins', name: 'Монеты' },
  { id: 'medals', name: 'Медали' },
];

export default function Header() {
  const { totalCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'theme-dark' : 'theme-light';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header style={{
      background: 'var(--header-bg)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 0 20px rgba(0,180,224,0.08)',
    }}>
      <div className="container header-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}>
        {/* Логотип */}
        <Link to="/" className="logo-neon">
          <span className="logo-mark">
            <IconGrid width={18} height={18} />
          </span>
          <span className="logo-text">
            КОЛЛЕКЦИО<span className="logo-accent">НЕР</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className={`header-search ${isAuthPage ? 'header-search-hidden' : ''}`} style={{ flex: '1 1 200px', display: 'flex', margin: '0 8px' }}>
          <input type="search" placeholder="Сканировать базу..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 0, padding: '8px 12px', maxWidth: '520px' }} />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSearch width={18} height={18} />
          </button>
        </form>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Переключатель темы */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title="Переключить тему"
            aria-label="Переключить тему"
            style={{ flexShrink: 0 }}
          >
            <span className="knob">
              {theme === 'dark' ? <IconSun width={14} height={14} /> : <IconMoon width={14} height={14} />}
            </span>
          </button>

          <Link to="/cart" style={{ position: 'relative', color: 'var(--cyan)', display: 'flex', alignItems: 'center', padding: 4 }}>
            <IconCart width={22} height={22} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -6,
                background: 'var(--accent)', color: '#04030a',
                minWidth: 18, height: 18, padding: '0 4px', fontSize: '0.7rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, boxShadow: '0 0 8px var(--accent)',
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
              }}>{totalCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
                <IconUser width={16} height={16} /> {user?.firstName || 'Профиль'}
              </Link>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                <IconLogout width={16} height={16} /> Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '6px 16px', whiteSpace: 'nowrap' }}>Войти</Link>
          )}
        </div>
      </div>

      {/* Навигация по категориям */}
      <nav style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '6px 16px' }}>
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.id}
              to={c.id === 'all' ? '/catalog' : `/catalog/${c.id}`}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent)' : 'var(--text)',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                background: isActive ? 'linear-gradient(135deg, rgba(0,180,224,0.18), rgba(255,60,140,0.12))' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              <IconGrid width={14} height={14} />
              {c.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}