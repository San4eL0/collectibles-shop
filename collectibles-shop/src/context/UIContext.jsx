import { createContext, useContext, useState } from 'react';

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
          padding: '12px 24px', 
          // Здесь была ошибка: проверяем toast.type, а не type
          background: toast.type === 'error' ? 'var(--error)' : 'var(--success)', 
          color: '#fff', 
          borderRadius: '8px', 
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast.message}
        </div>
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);