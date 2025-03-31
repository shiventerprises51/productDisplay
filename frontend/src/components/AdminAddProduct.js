import React, { useState, useEffect } from "react";
const AdminAddProduct = ({ categories }) => {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("Size-");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [noImage, setNoImage] = useState(false); // New state for "No Image" checkbox
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  }, [categoryId]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubcategories(data);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handlePaste = (e) => {
    if (noImage) return; // Prevent pasting if "No Image" is checked
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        setImageFile(file);
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = imageUrl;

    if (noImage) {
      uploadedImageUrl = "https://i.ibb.co/p0nQhDT/image.png"; // Default URL if "No Image" is checked
    } else if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile); // Append the file directly

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=f3ad9357dc8e5de801518188f6938306`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        // console.log("ImgBB API Response:", result); // Log the API response

        if (result.data && result.data.url) {
          uploadedImageUrl = result.data.url; // Use the URL from the response
          // console.log("Uploaded Image URL:", uploadedImageUrl);
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        return;
      }
    }

    const productData = {
      name: name,
      price: price,
      details: details,
      image_url: uploadedImageUrl,
      category_id: categoryId,
      subcategory_id: subcategoryId,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        setMessage("Product added successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
      console.log("Product Data:", productData);
      setName("");
      setPrice("");
      setDetails("Size-");
      setImageFile(null);
      setImageUrl("");
      setNoImage(false); // Reset "No Image" checkbox
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="container my-4">
      <div className="Admin-card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Add New Product</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
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
                <select
                  className="form-select"
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  required
                  disabled={subcategories.length === 0}
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

            <div className="row mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={noImage} // Disable if "No Image" is checked
                />
                <div className="mt-3">
                  <label htmlFor="imageUrl" className="form-label">
                    Or Paste Image from Clipboard:
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    onPaste={handlePaste}
                    placeholder="Paste image here (Ctrl+V)"
                    disabled={noImage} // Disable if "No Image" is checked
                  />
                </div>
                {imageUrl && !noImage && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Pasted"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </div>
                )}
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="noImageCheck"
                    checked={noImage}
                    onChange={(e) => {
                      setNoImage(e.target.checked);
                      if (e.target.checked) {
                        setImageFile(null);
                        setImageUrl("");
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="noImageCheck">
                    No Image
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
