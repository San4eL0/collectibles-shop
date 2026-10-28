import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>404</div>
      <h1 style={{ margin: '24px 0 16px' }}>Страница не найдена</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
        Возможно, товар был удалён или вы перешли по неверной ссылке.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">На главную</Link>
        <Link to="/catalog" className="btn btn-outline">В каталог</Link>
      </div>
    </div>
  );
}