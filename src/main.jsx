import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import './index.css';

// Восстанавливаем тему из localStorage
const savedTheme = localStorage.getItem('theme') === 'light' ? 'theme-light' : 'theme-dark';
document.body.className = savedTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <UIProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </UIProvider>
    </HashRouter>
  </React.StrictMode>
);
