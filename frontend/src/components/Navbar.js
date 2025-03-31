import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MobileNavbar from "./MobileNavbar";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-xs navbar-light bg-transparent">
        <div className="container-fluid nav-bar-desktop">
          <div className="leftside_navbar">
            <div className="navbar-logo" onClick={() => navigate("/")}>
              <img
                src={require("./image/ShivCollection-logo4.png")}
                alt="Company Logo"
                className="logo-img"
              />
            </div>
            <div className="nav-links">
              <button
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                className={`nav-link ${isActive("/FrontPage") ? "active" : ""}`}
                onClick={() => navigate("/FrontPage")}
              >
                Products
              </button>
              <button
                className={`nav-link ${
                  isActive("/Contact-us") ? "active" : ""
                }`}
                onClick={() => navigate("/Contact-us")}
              >
                Contact Us
              </button>
              <button
                className={`nav-link ${isActive("/downloads") ? "active" : ""}`}
                onClick={() => navigate("/downloads")}
              >
                Downloads
              </button>
            </div>
          </div>

          <div className="rightside_navbar">
            {auth ? (
              <button className="admin-btn" onClick={() => navigate("/admin")}>
                Admin
              </button>
            ) : (
              <div className="auth-buttons">
                <button
                  className="login-btn"
                  onClick={() => navigate("/admin")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mobilenav">
          <MobileNavbar />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
