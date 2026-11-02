import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'tno' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme === 'tno' ? 'theme-tno' : '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container header-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
        <Link to="/" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>🎭 Коллекционер</Link>
        
        <form onSubmit={handleSearch} className={`header-search ${isAuthPage ? 'header-search-hidden' : ''}`} style={{ flex: '1 1 200px', display: 'flex' }}>
          <input type="search" placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px 0 0 8px', background: 'var(--bg)', color: 'var(--text)' }} />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}>🔍</button>
        </form>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '36px', borderRadius: '8px', whiteSpace: 'nowrap' }} title="Сменить тему">
            {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
          </button>

          <Link to="/cart" style={{ position: 'relative', fontSize: '1.2rem' }}>🛒
            {totalCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--accent)', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: theme === 'tno' ? '#000' : '#fff' }}>{totalCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/profile" style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{user?.firstName || 'Профиль'}</Link>
              <button onClick={logout} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Выйти</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>Войти</Link>
          )}
        </div>
      </div>
      
      {/* Навигация по категориям */}
      <nav style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 16px' }}>
          {CATEGORIES.map((c) => (
            <NavLink 
              key={c.id} 
              to={c.id === 'all' ? '/catalog' : `/catalog/${c.id}`} 
              style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text)', whiteSpace: 'nowrap' })}
            >
              {c.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
