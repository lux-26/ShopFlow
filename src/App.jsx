import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Composants principaux
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages publiques
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./components/Profile/Profile";
import Loyalty from "./pages/Loyalty";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Logout from "./pages/admin/Logout";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";

// Composants Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Composant interne pour gérer l'affichage conditionnel du Header/Footer
function AppContent() {
  const location = useLocation();
  // Vérifie si on se trouve dans l'espace admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Le Header public ne s'affiche PAS sur les pages admin */}
      {!isAdminRoute && <Header />}

      <main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile />} />
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

      {/* Le Footer et le WhatsApp ne s'affichent PAS non plus sur les pages admin */}
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
