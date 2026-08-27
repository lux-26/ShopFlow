import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div
      className="admin-layout page-transition"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      {/* La barre latérale des menu*/}
      <AdminSidebar />

      {/* Le conteneur principal où vont s'afficher dynamiquement les pages admin */}
      <main
        className="admin-main-content"
        style={{ flex: 1, padding: "20px", backgroundColor: "#f8fafc" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
