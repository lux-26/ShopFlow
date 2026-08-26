import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop,
  faChartPie,
  faBoxArchive,
  faBagShopping,
  faUsers,
  faGear,
  faStore,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/admin.css";

export default function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <FontAwesomeIcon icon={faShop} className="brand-icon" />
          <div>
            <h2>ShopFlow Admin</h2>
            <span>Management Portal</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className={isActive("/admin") || isActive("/admin/dashboard")}>
            <Link to="/admin/dashboard">
              <FontAwesomeIcon icon={faChartPie} /> Dashboard
            </Link>
          </li>
          <li className={isActive("/admin/products")}>
            <Link to="/admin/products">
              <FontAwesomeIcon icon={faBoxArchive} /> Product Management
            </Link>
          </li>
          <li className={isActive("/admin/orders")}>
            <Link to="/admin/orders">
              <FontAwesomeIcon icon={faBagShopping} /> Orders
            </Link>
          </li>
          <li className={isActive("/admin/users")}>
            <Link to="/admin/users">
              <FontAwesomeIcon icon={faUsers} /> Users
            </Link>
          </li>
          <li className={isActive("/admin/settings")}>
            <Link to="/admin/settings">
              <FontAwesomeIcon icon={faGear} /> Settings
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <Link to="/" className="view-store-btn">
            <FontAwesomeIcon icon={faStore} /> View Store
          </Link>
          <Link to="/connexion" className="logout-btn">
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </Link>
        </div>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
