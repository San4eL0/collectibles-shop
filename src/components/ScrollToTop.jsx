import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Этот эффект срабатывает при смене URL
  useEffect(() => {
    // Если мы перешли на новую страницу (не возвращаемся назад), скроллим наверх
    // (По умолчанию оставляем как есть, чтобы не ломать кнопку "Назад")
    if (!sessionStorage.getItem('scrollPos')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
