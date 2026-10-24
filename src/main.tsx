import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/catalog.css';
import './styles/checkout.css';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import InfoPage from './pages/InfoPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  NotFoundPage,
  PrivacyPolicyPage,
  ReturnsPolicyPage,
  ShippingPolicyPage,
  TermsPage,
} from './pages/SupportPages';
import { CartProvider } from './state/CartContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route
              path="account"
              element={
                <InfoPage
                  title="Customer Account (Placeholder)"
                  body="Customer sign-in, saved Indian shipping addresses and order history require a backend authentication service, which is planned for a future phase."
                />
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="returns-policy" element={<ReturnsPolicyPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
);
