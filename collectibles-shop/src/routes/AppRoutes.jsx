import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import HomePage from '../pages/HomePage.jsx';
import CatalogPage from '../pages/CatalogPage.jsx';
import ProductPage from '../pages/ProductPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import AdminProductsPage from '../pages/AdminProductsPage.jsx';
import AdminOrdersPage from '../pages/AdminOrdersPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:category" element={<CatalogPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="profile/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}