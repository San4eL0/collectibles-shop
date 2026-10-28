import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
  { id: 'vinyl', name: 'Винил', api: 'fragrances' },
  { id: 'figures', name: 'Фигурки', api: 'laptops' },
  { id: 'coins', name: 'Монеты', api: 'mens-watches' },
];

export default function Header() {
  const { totalCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>🎭 Коллекционер</Link>
        <form onSubmit={handleSearch} style={{ flex: '1 1 200px', display: 'flex' }}>
          <input type="search" placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px 0 0 8px' }} />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}>🔍</button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/cart" style={{ position: 'relative', fontSize: '1.2rem' }}>🛒
            {totalCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--accent)', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{totalCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/profile" style={{ fontWeight: 600 }}>{user?.firstName || 'Профиль'}</Link>
              <button onClick={logout} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Выйти</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '6px 12px' }}>Войти</Link>
          )}
        </div>
      </div>
      <nav style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 16px' }}>
          <NavLink to="/catalog" style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'inherit' })}>Все</NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c.id} to={`/catalog/${c.id}`} style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'inherit', whiteSpace: 'nowrap' })}>{c.name}</NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}