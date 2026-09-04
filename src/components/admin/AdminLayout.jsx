import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`admin-dashboard-layout page-transition ${isSidebarOpen ? "sidebar-open" : ""}`}
      style={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fond sombre (overlay) lorsqu'on ouvre le menu sur mobile */}
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      {/* La barre latérale des menus */}
      <aside className="admin-sidebar">
        <AdminSidebar />
      </aside>

      {/* Le conteneur principal */}
      <main className="admin-main-content">
        {/* Barre d'en-tête mobile intégrée proprement au flux pour contenir le bouton hamburger */}
        <div
          className="mobile-top-bar"
          style={{ display: "none", marginBottom: "15px" }}
        >
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Ouvrir le menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
--0