import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const MobileAdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-admin-nav">
      <div className="mobile-nav-header">
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="mobile-nav-menu">
          <button
            className={`nav-link ${isActive("/admin") ? "active" : ""}`}
            onClick={() => {
              navigate("/");
              setIsOpen(false);
            }}
          >
            Home
          </button>
          <button
            className={`nav-link ${
              isActive("/admin/printcatalog") ? "active" : ""
            }`}
            onClick={() => {
              navigate("/admin/printcatalog");
              setIsOpen(false);
            }}
          >
            Print Catalog
          </button>
          <button
            className={`nav-link ${isActive("/uploadcatalog") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/uploadcatalog");
              setIsOpen(false);
            }}
          >
            Upload Catalog
          </button>
          <button
            className={`nav-link ${
              isActive("/admin/uploadcatalog") ? "active" : ""
            }`}
            onClick={() => navigate("/updatecatalog")}
          >
            Update Catalog
          </button>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileAdminNavbar;
