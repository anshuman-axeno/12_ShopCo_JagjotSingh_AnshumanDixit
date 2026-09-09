import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Spinner from './components/common/Spinner/Spinner';

// Route Lazy Loading for performance and code splitting
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const CategoriesPage = lazy(() => import('./pages/Categories/CategoriesPage'));
const ProductListingPage = lazy(() => import('./pages/ProductListing/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/Auth/SignupPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetails/OrderDetailsPage'));

// Admin Lazy Loaded Routes
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/Admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Suspense fallback={<Spinner message="Loading page..." fullScreen />}>
                <Routes>
                  {/* Public Customer Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/products" element={<ProductListingPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;