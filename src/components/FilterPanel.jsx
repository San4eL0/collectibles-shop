export default function FilterPanel({
  maxPrice,
  absoluteMaxPrice,
  minRating,
  era,
  onChangePrice,
  onChangeRating,
  onChangeEra,
  onReset
}) {
  return (
    <aside className="cp-card" style={{ padding: '20px', display: 'grid', gap: '20px' }}>
      <h3 className="section-title" style={{ fontSize: '1.05rem' }}>ФИЛЬТРЫ // FLTR</h3>

      <label style={{ display: 'grid', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Цена до:</span>
          <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)' }}>{maxPrice.toLocaleString('ru-RU')}</span>
        </div>
        <input type="range" min={0} max={absoluteMaxPrice} step={100} value={maxPrice} onChange={(e) => onChangePrice(Number(e.target.value))} style={{ width: '100%' }} />
      </label>

      <div style={{ display: 'grid', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ЭРА // ERA</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'modern', 'vintage'].map((e) => (
            <button
              key={e}
              onClick={() => onChangeEra(e)}
              className={`btn ${era === e ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '4px 10px', fontSize: '0.7rem', minHeight: '30px' }}
            >
              {e === 'all' ? 'ВСЕ' : e === 'modern' ? 'NEW' : 'VINT'}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: 'grid', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Мин. рейтинг</span>
        <select value={minRating} onChange={(e) => onChangeRating(Number(e.target.value))} style={{ width: '100%', padding: '8px' }}>
          <option value={0}>Любой</option>
          <option value={3}>★ от 3</option>
          <option value={4}>★ от 4</option>
          <option value={4.5}>★ от 4.5</option>
        </select>
      </label>

      <button onClick={onReset} className="btn btn-outline" style={{ width: '100%', padding: '10px' }}>
        СБРОС // RESET
      </button>
    </aside>
  );
}