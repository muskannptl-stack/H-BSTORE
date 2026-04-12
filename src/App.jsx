import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });


import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';


// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Success = lazy(() => import('./pages/Success'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Users = lazy(() => import('./pages/admin/Users'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const SeoBanners = lazy(() => import('./pages/admin/SeoBanners'));
const BulkUpload = lazy(() => import('./pages/admin/BulkUpload'));
const Staff = lazy(() => import('./pages/admin/Staff'));
const AnimatedRoutes = () => {

  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    return () => clearTimeout(timer);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Suspense fallback={<PageLoader />}><PageTransition><Home /></PageTransition></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><PageTransition><Products /></PageTransition></Suspense>} />
          <Route path="product/:id" element={<Suspense fallback={<PageLoader />}><PageTransition><ProductDetail /></PageTransition></Suspense>} />
          <Route path="cart" element={<Suspense fallback={<PageLoader />}><PageTransition><Cart /></PageTransition></Suspense>} />
          <Route path="checkout" element={<Suspense fallback={<PageLoader />}><PageTransition><Checkout /></PageTransition></Suspense>} />
          <Route path="login" element={<Suspense fallback={<PageLoader />}><PageTransition><Login /></PageTransition></Suspense>} />
          <Route path="signup" element={<Suspense fallback={<PageLoader />}><PageTransition><Signup /></PageTransition></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><PageTransition><Dashboard /></PageTransition></Suspense>} />
          <Route path="success" element={<Suspense fallback={<PageLoader />}><PageTransition><Success /></PageTransition></Suspense>} />
          <Route path="wishlist" element={<Suspense fallback={<PageLoader />}><PageTransition><Wishlist /></PageTransition></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageLoader />}><PageTransition><NotFound /></PageTransition></Suspense>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><PageTransition><AdminLogin /></PageTransition></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
          <Route index element={<Suspense fallback={<PageLoader />}><PageTransition><DashboardHome /></PageTransition></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><PageTransition><AdminProducts /></PageTransition></Suspense>} />
          <Route path="products/add" element={<Suspense fallback={<PageLoader />}><PageTransition><ProductForm /></PageTransition></Suspense>} />
          <Route path="products/edit/:id" element={<Suspense fallback={<PageLoader />}><PageTransition><ProductForm /></PageTransition></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><PageTransition><Categories /></PageTransition></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><PageTransition><Orders /></PageTransition></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageLoader />}><PageTransition><Users /></PageTransition></Suspense>} />
          <Route path="coupons" element={<Suspense fallback={<PageLoader />}><PageTransition><Coupons /></PageTransition></Suspense>} />
          <Route path="seo" element={<Suspense fallback={<PageLoader />}><PageTransition><SeoBanners /></PageTransition></Suspense>} />
          <Route path="bulk" element={<Suspense fallback={<PageLoader />}><PageTransition><BulkUpload /></PageTransition></Suspense>} />
          <Route path="staff" element={<Suspense fallback={<PageLoader />}><PageTransition><Staff /></PageTransition></Suspense>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const UserLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
