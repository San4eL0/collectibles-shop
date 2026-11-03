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

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header style={{
      background: 'rgba(10,9,20,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 0 20px rgba(0,240,255,0.08)',
    }}>
      <div className="container header-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cyan)', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
          <span className="glitch" data-text="КОЛЛЕКЦИОНЕР//2077">КОЛЛЕКЦИОНЕР//2077</span>
        </Link>

        <form onSubmit={handleSearch} className={`header-search ${isAuthPage ? 'header-search-hidden' : ''}`} style={{ flex: '1 1 200px', display: 'flex', margin: '0 8px' }}>
          <input type="search" placeholder="Сканировать базу..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 0, padding: '8px 12px', maxWidth: '520px', color: 'var(--text)' }} />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', borderRadius: 0 }}>⌕</button>
        </form>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

          <Link to="/cart" style={{ position: 'relative', fontSize: '1.1rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)' }}>▣</span>
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -10,
                background: 'var(--accent)', color: '#04030a',
                width: 18, height: 18, fontSize: '0.7rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, boxShadow: '0 0 8px var(--accent)',
              }}>{totalCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/profile" style={{ fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
                ◉ {user?.firstName || 'Профиль'}
              </Link>
              <button onClick={logout} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Выйти</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '6px 16px', whiteSpace: 'nowrap' }}>Войти</Link>
          )}
        </div>
      </div>

      {/* Навигация по категориям */}
      <nav style={{ borderTop: '1px solid var(--border)', background: 'rgba(18,15,36,0.7)' }}>
        <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '6px 16px' }}>
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.id}
              to={c.id === 'all' ? '/catalog' : `/catalog/${c.id}`}
              style={({ isActive }) => ({
                padding: '8px 16px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent)' : 'var(--text)',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                background: isActive ? 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(255,58,139,0.12))' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              {c.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}