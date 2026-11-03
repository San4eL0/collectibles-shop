import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--cyan)', lineHeight: 1, fontFamily: 'var(--font-display)', textShadow: '0 0 30px var(--cyan)', position: 'relative' }}>
        <span className="glitch" data-text="4̷0̷4̷">404</span>
      </div>
      <h1 style={{ margin: '24px 0 16px' }}>СЕКТОР НЕ НАЙДЕН // NOT FOUND</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
        Данные по этому маршруту удалены или доступ заблокирован. Возможно, артефакт уже снят с базы.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">◄ НА ГЛАВНУЮ</Link>
        <Link to="/catalog" className="btn btn-outline">В КАТАЛОГ</Link>
      </div>
    </div>
  );
}