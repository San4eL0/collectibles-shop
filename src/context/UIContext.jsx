import { createContext, useContext, useState } from 'react';
import { IconCheck, IconClose } from '../components/icons.jsx';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  return (
    <UIContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '12px 20px',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: `1px solid ${toast.type === 'error' ? 'var(--error)' : 'var(--cyan)'}`,
          boxShadow: `0 0 16px ${toast.type === 'error' ? 'var(--error)66' : 'var(--cyan)55'}`,
          zIndex: 9999,
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          letterSpacing: '0.5px',
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast.type === 'error'
            ? <IconClose width={16} height={16} style={{ color: 'var(--error)' }} />
            : <IconCheck width={16} height={16} style={{ color: 'var(--success)' }} />}
          {toast.message}
        </div>
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);