export default function Alert({ type = 'info', message }) {
  const colors = { info: 'var(--primary)', error: 'var(--error)', success: 'var(--success)' };
  return <div style={{ padding: 16, border: `1px solid ${colors[type]}`, borderRadius: 8, color: colors[type], background: `${colors[type]}10` }}>{message}</div>;
}