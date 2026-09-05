import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShop } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout page-transition">
      {/* Barre supérieure visible uniquement sur mobile/tablette (<768px) */}
      <div className="mobile-topbar">
        <button
          type="button"
          className="sidebar-toggle-btn"
          aria-label="Ouvrir le menu"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="mobile-topbar-brand">
          <FontAwesomeIcon icon={faShop} className="brand-icon" />
          <span>Administration ShopFlow</span>
        </div>
      </div>

      {/* La barre latérale des menus */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay affiché derrière le menu quand il est ouvert sur mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Le conteneur principal où vont s'afficher dynamiquement les pages admin */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
