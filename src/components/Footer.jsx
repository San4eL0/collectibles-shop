export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--surface)', 
      color: 'var(--text)', 
      borderTop: '1px solid var(--border)',
      marginTop: 'auto', 
      padding: '32px 16px', 
      textAlign: 'center', 
      fontSize: '0.9rem' 
    }}>
      <div className="container">
        <p>© 2026 Коллекционер. Учебный проект.</p>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Винил, фигурки, монеты. Все права защищены.</p>
      </div>
    </footer>
  );
}
