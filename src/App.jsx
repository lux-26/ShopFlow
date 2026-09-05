import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";

// Composants principaux
import Loader from "./pages/Loader/Loader";
import Header from "./components/clients/shared/Header/Header";
import Footer from "./components/clients/shared/Footer/Footer";
import WhatsAppButton from "./components/clients/shared/WhatsAppButton/WhatsAppButton";
import Contact from "./components/clients/shared/Contact/Contact";

// Pages publiques
import Home from "./pages/clients/Home/Home";
import Catalog from "./pages/clients/catalog/Catalog";
import ProductDetail from "./pages/clients/ProductDetail/ProductDetail";
import Profile from "./components/clients/Profile/Profile";
import Loyalty from "./pages/clients/Loyalty/Loyalty";
import Cart from "./pages/clients/Cart/Cart";
import Login from "./pages/clients/Login/Login";
import Logout from "./pages/admin/Logout";
import Register from "./pages/clients/Register/Register";
import SearchPage from "./pages/clients/SearchPage/SearchPage";
import Checkout from "./pages/clients/Checkout/Checkout";
import ForgotPassword from "./pages/clients/ForgotPassword/ForgotPassword";

// Composants Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Composant de protection pour le profil client
function ClientProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Tant qu'on n'a pas la réponse de /api/auth/me, on ne redirige pas :
  // ça éviterait un aller-retour vers /login à chaque rafraîchissement de page.
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!isAdminRoute && <Header />}

      <main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Route Profil Protégée : Bloque l'accès si non connecté et redirige vers /login */}
          <Route
            path="/profile"
            element={
              <ClientProtectedRoute>
                <Profile />
              </ClientProtectedRoute>
            }
          />

          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/produit/:id" element={<ProductDetail />} />

          <Route path="/logout" element={<Logout />} />

          {/* Routes Admin protégées */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
