import { IconGrid } from './icons.jsx';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)',
      color: 'var(--text)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      padding: '28px 16px',
      fontSize: '0.9rem',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--cyan), var(--magenta), transparent)', boxShadow: '0 0 12px var(--cyan)' }} />
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="logo-neon" style={{ justifyContent: 'center', marginBottom: 12 }}>
          <span className="logo-mark">
            <IconGrid width={16} height={16} />
          </span>
          <span className="logo-text" style={{ fontSize: '0.95rem' }}>
            КОЛЛЕКЦИО<span className="logo-accent">НЕР</span>
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2026 Коллекционер. Учебный проект. // Территория Кремниевых Призраков
        </p>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, opacity: 0.7, fontSize: '0.75rem' }}>
          Винил • Фигурки • Монеты • Медали — артефакты одной эры
        </p>
      </div>
    </footer>
  );
}