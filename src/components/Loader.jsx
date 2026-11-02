export default function Loader() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ aspectRatio: '1', background: '#e5e0ec', animation: 'pulse 1.5s infinite' }} />
          <div style={{ padding: '16px', display: 'grid', gap: '10px' }}>
            <div style={{ height: '14px', background: '#e5e0ec', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '14px', background: '#e5e0ec', borderRadius: '4px', width: '50%', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '32px', background: '#e5e0ec', borderRadius: '8px', marginTop: '8px', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}