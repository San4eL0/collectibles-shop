import { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi, restoreSessionUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      // 1) Пробуем восстановить сохранённую сессию (если она есть)
      const saved = restoreSessionUser();
      if (saved) {
        setUser(saved);
        setToken(saved.accessToken);
        localStorage.setItem('token', saved.accessToken);
        setLoading(false);
        return;
      }
      // 2) Фолбэк: пробуем проверить старый токен через /auth/me
      const legacy = localStorage.getItem('token');
      if (!legacy) { setLoading(false); return; }
      try {
        const me = await fetchApi('/auth/me', { headers: { Authorization: `Bearer ${legacy}` } });
        setUser(me);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (username, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    setToken(data.accessToken);
    setUser(data);
    localStorage.setItem('token', data.accessToken);
    return data;
  };

  const registerAndLogin = async (payload) => {
    const data = await fetchApi('/users/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.accessToken);
    setUser(data);
    localStorage.setItem('token', data.accessToken);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('collector_session');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registerAndLogin, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);