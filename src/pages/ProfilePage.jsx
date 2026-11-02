import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Личный кабинет</h1>
      
      <div style={{ display: 'grid', gap: '24px' }} className="profile-layout">
        <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Мой профиль</h2>
          <dl style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Имя</dt>
              <dd style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Логин</dt>
              <dd>{user?.username}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Статус</dt>
              <dd>{isAdmin ? 'Администратор' : 'Покупатель'}</dd>
            </div>
          </dl>
        </div>

        <div style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
          <Link to="/profile/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>📦 Мои заказы</Link>
          <Link to="/cart" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>🛒 Корзина</Link>
          <Link to="/catalog" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>🏪 Перейти в каталог</Link>
          
          {isAdmin && (
            <>
              <div style={{ margin: '12px 0', borderTop: '1px solid var(--border)' }} />
              <Link to="/admin/products" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>⚙️ Управление товарами</Link>
              <Link to="/admin/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }}>📋 Управление заказами</Link>
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