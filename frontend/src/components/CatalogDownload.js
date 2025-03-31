import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const CatalogDownload = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDownload = (fileId) => {
    if (!fileId) {
      alert("No catalog available for this category.");
      return;
    }

    // Direct download from backend
    const downloadUrl = `${process.env.REACT_APP_SERVER_URL}/api/gdrive/download/${fileId}`;
    window.open(downloadUrl, "_blank"); // Open in new tab for direct download
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="container mt-4">
        <h2>Download Catalogs</h2>
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={category.img_url}
                  alt={category.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{category.name}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(category.catalog_id)}
                    disabled={loading || !category.catalog_id}
                  >
                    {loading ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CatalogDownload;
