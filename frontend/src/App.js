import React, { useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import FrontPage from "./components/FrontPage";
import Homepage from "./components/Homepage";
import AdminDashboard from "./components/AdminDashboard";
import AdminUpdateProduct from "./components/AdminUpdateProduct";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PrintCatalog from "./components/PrintCatalog";
import ContactUsPage from "./components/ContactUsPage";
import AdminUploadCatalog from "./components/AdminUploadCatalog";
import Downloads from "./components/Downloads";
import ContactusSuccess from "./components/ContactusSuccess";
import Cart from "./components/Cart";
import HandlePrint from "./components/print/HandlePrint";
import AdminUpdateCatalog from "./components/AdminUpdateCatalog";
import CatalogDownload from "./components/CatalogDownload";
import AdminAddDuplicate from "./components/AdminAddDuplicate";
import Trial from "./components/Trial";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [auth, navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/downloads" element={<Downloads />} /> */}
          <Route path="/FrontPage" element={<FrontPage />} />
          <Route path="/Contact-us" element={<ContactUsPage />} />
          <Route path="/Contact-success" element={<ContactusSuccess />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/downloads" element={<CatalogDownload />} />
          <Route
            path="admin/printPreview"
            element={
              <ProtectedRoute>
                <HandlePrint />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/update/:id"
            element={
              <ProtectedRoute>
                <AdminUpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/adddup/:id"
            element={
              <ProtectedRoute>
                <AdminAddDuplicate />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/printcatalog"
            element={
              <ProtectedRoute>
                <PrintCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadcatalog"
            element={
              <ProtectedRoute>
                <AdminUploadCatalog />
              </ProtectedRoute>
            }
          />

          <Route path="/trial" element={<Trial />} />

          <Route
            path="/updatecatalog"
            element={
              <ProtectedRoute>
                <AdminUpdateCatalog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <SpeedInsights />
    </Router>
  );
}

export default App;
