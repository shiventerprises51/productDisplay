import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadCatNav from "./UploadCatNav";

const AdminUploadCatalog = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [catalogs, setCatalogs] = useState([]);

  // Fetch the list of existing catalogs on component mount
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/gdrive`)

      .then((response) => {
        // setCatalogs(response.data);
        setCatalogs(response.data);
      })

      .catch((error) => {
        console.error("Error fetching catalogs:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("catalogs", file));

    setUploading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/gdrive`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", response.data);

      setMessage("Catalogs uploaded successfully!");
      setFiles([]);

      // Fetch updated catalog list after successful upload
      const updatedCatalogs = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/gdrive`
      );
      setCatalogs(updatedCatalogs.data);
    } catch (error) {
      setMessage("Failed to upload catalogs. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${filename}`
      );
      const updatedCatalogs = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/gdrive`
      );
      setCatalogs(updatedCatalogs.data);
      setMessage("Catalog deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete catalog. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleDownload = (filename) => {
    // Trigger download for the given filename

    window.open(
      `${process.env.REACT_APP_SERVER_URL}/api/gdrive/download/${filename}`,
      "_blank"
    );
  };

  return (
    <div>
      <UploadCatNav />
      <div className="container mt-4">
        <h3>Upload Catalogs</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="catalogs" className="form-label">
              Choose Catalog Files
            </label>
            <input
              type="file"
              className="form-control"
              id="catalogs"
              onChange={handleFileChange}
              accept=".pdf"
              multiple
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message && <div className="mt-2">{message}</div>}

        <h4 className="mt-4">Existing Catalogs</h4>
        <ul className="list-group">
          {catalogs.map((catalog) => (
            <li
              key={catalog.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{catalog.name}</span>
              <div>
                <button
                  onClick={() => handleDownload(catalog.name)}
                  className="btn btn-success btn-sm me-2"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(catalog.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUploadCatalog;
