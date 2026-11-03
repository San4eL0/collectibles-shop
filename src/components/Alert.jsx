export default function Alert({ type = 'info', message, action }) {
  const config = {
    info: { color: 'var(--cyan)', icon: '⍟' },
    error: { color: 'var(--error)', icon: '◈' },
    success: { color: 'var(--success)', icon: '✓' },
  };
  const c = config[type] || config.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
      padding: 16, border: `1px solid ${c.color}`, color: c.color,
      background: `${c.color}10`, boxShadow: `0 0 12px ${c.color}33`,
      margin: '12px 0',
    }}>
      <span style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, border: `1px solid ${c.color}`, transform: 'rotate(45deg)' }}>
        <span style={{ transform: 'rotate(-45deg)' }}>{c.icon}</span>
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {action}
    </div>
  );
}