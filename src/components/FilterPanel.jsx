export default function FilterPanel({ filters, onChange, onReset }) {
  return (
    <aside style={{ background: 'var(--surface)', padding: 16, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', display: 'grid', gap: 12 }}>
      <h3>Фильтры</h3>
      <label>Цена до: {filters.maxPrice} ₽<input type="range" min={0} max={50000} step={500} value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: +e.target.value })} style={{ width: '100%' }} /></label>
      <label>Мин. рейтинг<select value={filters.minRating} onChange={(e) => onChange({ minRating: +e.target.value })} style={{ width: '100%', padding: 8 }}><option value={0}>Любой</option><option value={3}>3+</option><option value={4}>4+</option></select></label>
      <button onClick={onReset} className="btn btn-outline">Сбросить</button>
    </aside>
  );
}