export default function Footer() {
  return (
    <footer style={{ background: 'var(--text)', color: '#fff', marginTop: 'auto', padding: '32px 16px', textAlign: 'center', fontSize: '0.9rem' }}>
      <div className="container">
        <p>© 2026 Коллекционер. Учебный проект.</p>
        <p style={{ opacity: 0.7, marginTop: 8 }}>Винил, фигурки, монеты. Все права защищены.</p>
      </div>
    </footer>
  );
}