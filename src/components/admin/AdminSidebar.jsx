import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <i className="fa-solid fa-shop brand-icon"></i>
        <div>
          <h2>ShopFlow Admin</h2>
          <span>Management Portal</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li className={isActive("/admin/dashboard")}>
          <Link to="/admin/dashboard">
            <i className="fa-solid fa-chart-pie"></i> Dashboard
          </Link>
        </li>
        <li className={isActive("/admin/products")}>
          <Link to="/admin/products">
            <i className="fa-solid fa-box-archive"></i> Product Management
          </Link>
        </li>
        <li className={isActive("/admin/orders")}>
          <Link to="/admin/orders">
            <i className="fa-solid fa-bag-shopping"></i> Orders
          </Link>
        </li>
        <li className={isActive("/admin/users")}>
          <Link to="/admin/users">
            <i className="fa-solid fa-users"></i> Users
          </Link>
        </li>
        <li className={isActive("/admin/settings")}>
          <Link to="/admin/settings">
            <i className="fa-solid fa-gear"></i> Settings
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <Link to="/" className="view-store-btn">
          <i className="fa-solid fa-store"></i> View Store
        </Link>
        <Link to="/connexion" className="logout-btn">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </Link>
      </div>
    </aside>
  );
}
