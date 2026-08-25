import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Composants principaux
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import Home from "./pages/Home";
import Catalog, { catalogProducts } from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./components/Profile/Profile";
import Loyalty from "./pages/Loyalty";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />{" "}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </Router>
  );
}

export default App;
