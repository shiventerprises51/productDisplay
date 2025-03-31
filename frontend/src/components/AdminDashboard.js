import React, { useState, useEffect } from "react";
import AdminAddCategory from "./AdminAddCategory";
import AdminAddProduct from "./AdminAddProduct";
import AdminAddSubcategories from "./AdminAddSubcategories";
import AdminNavbar from "./AdminNavbar";
import AdminDisplay from "./AdminDisplay";
import AdminProductList from "./AdminProductList";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin`
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="Admin-parent">
      <div className=" Admin-Navbar">
        <AdminNavbar />
      </div>

      <div className="container">
        {/* Admin Dashboard Title */}
        <div className="d-flex justify-content-center my-4">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Add Product Section */}
        <div className="mb-4">
          <AdminAddProduct categories={categories} />
        </div>

        <div className="container">
          <div className="row">
            {/* Left Column */}
            <div className="col-6 border-end border-3 pe-3">
              <AdminAddCategory />
            </div>

            {/* Right Column */}
            <div className="col-6 ps-3">
              <AdminAddSubcategories categories={categories} />
            </div>
          </div>
        </div>
        <hr className="border-3 border-top border-secondary my-4" />
        {/* Product List Section */}
      </div>
      <div className="Admin-display">
        <AdminDisplay />
      </div>
    </div>
  );
};

export default AdminDashboard;
