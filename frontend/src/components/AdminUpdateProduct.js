import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUpdate = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // State for product details
  const [product, setProduct] = useState({
    name: "",
    price: "",
    details: "",
    image_url: "",
    category_id: "",
    subcategory_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [useDefaultImage, setUseDefaultImage] = useState(false);

  // Fetch product details and categories on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products/${productId}`
        );
        const productData = response.data.product;
        setProduct(productData);
        setImagePreview(productData.image_url);
        setSelectedCategoryId(productData.category_id);
        setSelectedSubcategoryId(productData.subcategory_id);

        if (productData.category_id) {
          fetchSubcategories(productData.category_id);
        }
      } catch (err) {
        setError("Failed to fetch product details. Please try again.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin`
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      }
    };

    if (productId) {
      fetchProductDetails();
      fetchCategories();
    } else {
      setError("Product ID is missing in the URL.");
    }
  }, [productId]);

  // Fetch subcategories when a category is selected
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
      );
      setSubcategories(response.data);
    } catch (err) {
      setError("Failed to fetch subcategories. Please try again.");
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(""); // Reset subcategory when category changes
    setProduct((prevProduct) => ({
      ...prevProduct,
      category_id: categoryId,
      subcategory_id: "",
    }));

    // Fetch subcategories for the selected category
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategoryId(subcategoryId);
    setProduct((prevProduct) => ({
      ...prevProduct,
      subcategory_id: subcategoryId,
    }));
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = imagePreview;

    if (useDefaultImage) {
      uploadedImageUrl = "https://i.ibb.co/p0nQhDT/image.png"; // Replace with your default image URL
    } else if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=f3ad9357dc8e5de801518188f6938306`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.data && result.data.url) {
          uploadedImageUrl = result.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Failed to upload the image.");
        return;
      }
    }

    try {
      const updatedProduct = {
        ...product,
        image_url: uploadedImageUrl,
        category_id: selectedCategoryId,
        subcategory_id: selectedSubcategoryId,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/products/${productId}`,
        updatedProduct
      );
      setMessage(`Product updated successfully: ${response.data.product.name}`);
      setError("");
    } catch (err) {
      setError("Failed to update the product. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle image paste
  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        <div className="card-header text-center">
          <h2>Update Product</h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              left: "20px",
              top: "20px",
              padding: "5px 10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#6c757d",
              color: "white",
              fontSize: "19px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
          >
            ← Back
          </button>
        </div>
        <div className="card-body">
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          <form onSubmit={handleUpdate}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Subcategory</label>
                <select
                  className="form-select"
                  value={selectedSubcategoryId}
                  onChange={handleSubcategoryChange}
                  required
                  disabled={!selectedCategoryId || subcategories.length === 0}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Details</label>
                <textarea
                  name="details"
                  value={product.details || ""}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter product details"
                ></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={useDefaultImage}
                />
                <textarea
                  className="form-control mt-3"
                  onPaste={handlePaste}
                  placeholder="Paste image here (Ctrl+V)"
                  rows="3"
                  disabled={useDefaultImage}
                ></textarea>
                {imagePreview && (
                  <div className="mt-3 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "300px", maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="useDefaultImage"
                    checked={useDefaultImage}
                    onChange={(e) => setUseDefaultImage(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="useDefaultImage">
                    Use Default Image
                  </label>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdate;
