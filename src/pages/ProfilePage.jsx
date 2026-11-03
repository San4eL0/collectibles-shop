import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginBottom: '24px' }}>ЛИЧНЫЙ КАБИНЕТ // PROFILE</h1>

      <div style={{ display: 'grid', gap: '24px' }} className="profile-layout">
        <div className="cp-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>МОЙ ПРОФИЛЬ</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: 64, height: 64, border: '2px solid var(--cyan)', boxShadow: '0 0 16px rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--cyan)', transform: 'rotate(45deg)' }}>
              <span style={{ transform: 'rotate(-45deg)' }}>◉</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID: {user?.id || '—'} // ACCESS GRANTED</div>
            </div>
          </div>
          <dl style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Логин</dt>
              <dd style={{ color: 'var(--cyan)' }}>{user?.username}</dd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Статус</dt>
              <dd style={{ color: isAdmin ? 'var(--accent)' : 'var(--success)' }}>
                {isAdmin ? '◈ АДМИНИСТРАТОР' : '◉ ПОКУПАТЕЛЬ'}
              </dd>
            </div>
          </dl>
        </div>

        <div style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
          <Link to="/profile/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>◈ МОИ ЗАКАЗЫ</Link>
          <Link to="/cart" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>▣ КОРЗИНА</Link>
          <Link to="/catalog" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>⌂ В КАТАЛОГ</Link>

          {isAdmin && (
            <>
              <div style={{ margin: '12px 0', borderTop: '1px solid var(--border)' }} />
              <Link to="/admin/products" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>⚙ УПРАВЛЕНИЕ ТОВАРАМИ</Link>
              <Link to="/admin/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>☰ УПРАВЛЕНИЕ ЗАКАЗАМИ</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .profile-layout { grid-template-columns: 1fr 300px !important; }
        }
      `}</style>
    </div>
  );
}