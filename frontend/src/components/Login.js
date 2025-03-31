import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  // const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="parentcontainer">
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
        <button
          className={`nav-link ${isActive("/admin") ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </nav>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow-lg"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div className="card-body-login LoginBody">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
