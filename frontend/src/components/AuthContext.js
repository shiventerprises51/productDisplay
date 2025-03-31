import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Custom Hook to access Auth Context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    return localStorage.getItem("auth") === "true"; // Check if user is authenticated
  });

  useEffect(() => {
    // Save auth state to localStorage whenever it changes
    localStorage.setItem("auth", auth ? "true" : "false");
  }, [auth]);

  const login = async (username, password) => {
    try {
      // Send username and password to backend for authentication
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
        {
          username,
          password,
        }
      );

      // If login is successful, store the token and set auth to true
      localStorage.setItem("auth_token", response.data.token);
      setAuth(true);
      navigate("/admin"); // Redirect to Admin page on successful login
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setAuth(false);
    localStorage.removeItem("auth");
    localStorage.removeItem("auth_token"); // Remove token on logout
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
