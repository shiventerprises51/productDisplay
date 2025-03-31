import React, { useState, useEffect } from "react";
import { Trash, Edit, Trash2, Edit2 } from "lucide-react";

const AdminAddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryShow, setEditCategoryShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const confirmationText = process.env.REACT_APP_DELETE_CONFIRM_TEXT;

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

  const deleteCategory = async () => {
    // console.log(id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting category");
      }

      console.log("Category deleted");
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setOpen(false); // Close modal
    setDeleteId(null);
    setConfirmText("");
  };

  const updateCategory = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editCategoryName,
            show: editCategoryShow,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating category");
      }

      console.log("Category updated");
      setEditCategoryId(null); // Exit edit mode
      setEditCategoryName(""); // Clear input
      setEditCategoryShow(true); // Reset show checkbox
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const toggleShow = async (id, currentShow) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ show: !currentShow }),
        }
      );

      if (!response.ok) {
        throw new Error("Error toggling show status");
      }

      console.log("Show status updated");
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Error toggling show status:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name: categoryName, show: true }; // Default show to true

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        }
      );
      const data = await response.json();
      console.log("Category added");

      setCategoryName(""); // Reset form
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="container my-4">
      {/* Add New Category Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-3">Add New Category</h2>
          <form
            className="d-flex flex-column align-items-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 w-75">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </form>
        </div>
      </div>

      {/* Existing Categories Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Existing Categories</h3>
          <ul className="list-group">
            {categories.map((category) => (
              <li
                key={category.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {/* Checkbox to toggle show status */}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={category.show}
                    onChange={() => toggleShow(category.id, category.show)}
                  />
                </div>

                {editCategoryId === category.id ? (
                  // Show input field when editing
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                    <div className="form-check ms-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={editCategoryShow}
                        onChange={(e) => setEditCategoryShow(e.target.checked)}
                      />
                      <label className="form-check-label">
                        Show on Front Page
                      </label>
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateCategory(category.id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Show category name when not editing
                  <>
                    <span className="fw-bold">{category.name}</span>
                    <div className="btn-category-admin">
                      <Edit2
                        className="text-primary"
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setEditCategoryId(category.id);
                          setEditCategoryName(category.name);
                          setEditCategoryShow(category.show);
                        }}
                      ></Edit2>
                      <Trash2
                        className="text-danger"
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setDeleteId(category.id);
                          setOpen(true);
                        }}
                        // onClick={() => deleteCategory(category.id)}
                      ></Trash2>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <p>Enter the password to delete:</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              style={{
                padding: "5px",
                marginTop: "10px",
                border: "1px solid gray",
                borderRadius: "3px",
                textAlign: "center",
              }}
            />
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmText("");
                }}
                style={{
                  marginRight: "10px",
                  padding: "5px 10px",
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                disabled={confirmText !== confirmationText} // Compare input with env variable
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    confirmText === confirmationText ? "red" : "gray",
                  color: "white",
                  border: "none",
                  cursor:
                    confirmText === confirmationText
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddCategory;
