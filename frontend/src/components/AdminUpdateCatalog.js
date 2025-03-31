import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePDF } from "./print/GeneratePDF";

const AdminUpdateCatalog = () => {
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

  const handleUploadAllPDFs = async () => {
    setLoading(true);

    for (const category of categories) {
      try {
        const subcategoryResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
        );
        const subcategories = subcategoryResponse.data;

        let pages = [];

        for (const subcat of subcategories) {
          const productResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=0&maxPrice=999999&imgFlag=false`
          );
          const products = productResponse.data;

          const chunkSize = 9;
          for (let i = 0; i < products.length; i += chunkSize) {
            pages.push({
              subcategoryName: subcat.name,
              subPageNumber: Math.floor(i / chunkSize) + 1,
              productsOnPage: products.slice(i, i + chunkSize),
            });
          }
        }

        if (pages.length === 0) continue;

        // Generate PDF as a Blob
        const pdfBytes = await generatePDF(
          pages,
          "SHIV ENTERPRISES",
          "1st April 2024",
          "9958660231, 7838146412, 9717437131",
          "Trademark:-Vidhata",
          0,
          true
        );

        // Convert PDF Bytes to a Blob
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

        // Create a FormData object to send the PDF
        const formData = new FormData();
        formData.append("catalogs", pdfBlob, `${category.name}_Catalog.pdf`);

        // Upload the PDF to the backend
        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/gdrive`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const categoryDetailsResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}`
        );
        const existingCatalogId = categoryDetailsResponse.data.catalog_id;
        console.log(existingCatalogId);

        // if (existingCatalogId) {
        //   await axios.delete(
        //     `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
        //   );
        //   console.log(`Deleted old file with ID: ${existingCatalogId}`);
        // }

        if (existingCatalogId) {
          try {
            await axios.delete(
              `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
            );
            console.log(`Deleted old file with ID: ${existingCatalogId}`);
          } catch (deleteError) {
            console.error(
              `Failed to delete old file with ID: ${existingCatalogId}, proceeding with new upload.`,
              deleteError
            );
          }
        }

        // Update catalog_id in the database
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}/update-catalog`,
          { catalog_id: uploadResponse.data.fileId }
        );

        console.log(
          `Uploaded ${category.name} PDF, File ID:`,
          uploadResponse.data.fileId
        );
      } catch (error) {
        console.error(`Error processing ${category.name}:`, error);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Admin Update Catalog</h1>
      <button onClick={handleUploadAllPDFs} disabled={loading}>
        {loading ? "Uploading..." : "Upload All Catalogs"}
      </button>
    </div>
  );
};

export default AdminUpdateCatalog;
