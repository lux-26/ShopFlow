import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Assure-toi que le chemin est bon selon ton arborescence

export default function AdminLayout() {
  return (
    <div
      className="admin-layout"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      {/* La barre latérale avec tes modales */}
      <AdminSidebar />

      {/* Le conteneur principal où vont s'afficher dynamiquement tes pages admin */}
      <main
        className="admin-main-content"
        style={{ flex: 1, padding: "20px", backgroundColor: "#f8fafc" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
