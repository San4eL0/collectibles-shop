export default function Loader() {
  return (
    <div>
      <style>{`
        @keyframes cp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="cp-card" style={{ overflow: 'hidden' }}>
            <div style={{ aspectRatio: '1', background: 'linear-gradient(135deg, var(--surface-2), var(--bg-2))', animation: 'cp-pulse 1.4s infinite', borderBottom: '1px solid var(--border)' }} />
            <div style={{ padding: '16px', display: 'grid', gap: '10px' }}>
              <div style={{ height: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', width: '80%', animation: 'cp-pulse 1.4s infinite' }} />
              <div style={{ height: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', width: '50%', animation: 'cp-pulse 1.4s infinite' }} />
              <div style={{ height: '32px', background: 'linear-gradient(135deg, var(--surface-2), var(--bg-2))', border: '1px solid var(--border)', marginTop: '8px', animation: 'cp-pulse 1.4s infinite' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}