export default function FilterPanel({ 
  maxPrice, 
  absoluteMaxPrice, 
  minRating, 
  onChangePrice, 
  onChangeRating, 
  onReset 
}) {
  return (
    <aside style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', display: 'grid', gap: '16px', alignSelf: 'start' }}>
      <h3 style={{ fontSize: '1.1rem' }}>Фильтры</h3>

      <label style={{ display: 'grid', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
          <span>Цена до:</span>
          <span>{maxPrice.toLocaleString('ru-RU')} ₽</span>
        </div>
        <input 
          type="range" 
          min={0} 
          max={absoluteMaxPrice} 
          step={100} 
          value={maxPrice} 
          onChange={(e) => onChangePrice(Number(e.target.value))} 
          style={{ width: '100%', accentColor: 'var(--primary)' }} 
        />
      </label>

      <label style={{ display: 'grid', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Мин. рейтинг</span>
        <select 
          value={minRating} 
          onChange={(e) => onChangeRating(Number(e.target.value))} 
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
        >
          <option value={0}>Любой</option>
          <option value={3}>от 3 ★</option>
          <option value={4}>от 4 ★</option>
          <option value={4.5}>от 4.5 ★</option>
        </select>
      </label>

      <button onClick={onReset} className="btn btn-outline" style={{ width: '100%', padding: '10px' }}>
        Сбросить
      </button>
    </aside>
  );
}
