import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const location = useLocation();

  // Сохраняем позицию скролла перед уходом со страницы
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('scrollPos', window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Восстанавливаем позицию скролла при монтировании компонента (возврат назад)
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPos');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 10); // Небольшая задержка, чтобы React успел отрисовать DOM
    }
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '24px 0' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
