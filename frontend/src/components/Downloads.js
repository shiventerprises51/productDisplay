// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";

// const Downloads = () => {
//   const [catalogs, setCatalogs] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCatalogs = async () => {
//       try {
//         const updatedCatalogs = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/gdrive`
//         );
//         setCatalogs(updatedCatalogs.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCatalogs();
//   }, []);

//   const handleDownload = (filename) => {
//     window.open(
//       `${process.env.REACT_APP_SERVER_URL}/api/gdrive/download/${filename}`,
//       "_blank"
//     );
//   };

//   const generateRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };
//   const generatePreviewImage = (name, index) => {
//     const firstLetter = name.charAt(0).toUpperCase();

//     // Generate a background color based on the index or name
//     const backgroundColors = [
//       "#FF5733",
//       "#33FF57",
//       "#3357FF",
//       "#FF33A1",
//       "#A1FF33",
//       "#33FFFC",
//       "#FF8C00",
//       "#8CFF00",
//       "#FF00FF",
//     ];

//     const backgroundColor =
//       backgroundColors[index % backgroundColors.length] ||
//       generateRandomColor();

//     return (
//       <div
//         style={{
//           width: "100%",
//           height: "200px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: backgroundColor,
//           color: "#fff",
//           fontSize: "9rem", // Large font size for first letter
//           fontWeight: "bold",
//           borderRadius: "0.25rem",
//         }}
//       >
//         {firstLetter}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="ContactNavbar">
//         <Navbar />
//       </div>
//       <div className="container mt-4">
//         <h1 className="mb-4">Catalogs: </h1>
//         {loading && <p>Loading catalogs...</p>}
//         {error && <p>{error}</p>}
//         {!loading && !error && catalogs.length === 0 && (
//           <p>No catalogs available for download.</p>
//         )}
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           {catalogs.map((catalog, index) => (
//             <div key={index} className="col">
//               <div className="card shadow-sm">
//                 {/* Preview image or first letter of file name as preview */}
//                 {generatePreviewImage(catalog.name)}
//                 <div className="card-body">
//                   <h5 className="card-title">{catalog.name}</h5>
//                   {/* Download button */}
//                   <button
//                     onClick={() => handleDownload(catalog.name)}
//                     className="btn btn-success w-100"
//                   >
//                     Download
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Downloads;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Downloads.css";

// const CategoryCards = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories`
//         );
//         setCategories(response.data); // Assuming response.data is an array of categories
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="grid-container">
//       {categories.map((category) => (
//         <div key={category.id} className="card">
//           <img
//             src={category.img_url}
//             alt={category.name}
//             className="card-img"
//           />
//           <h3 className="card-title">{category.name}</h3>
//           <button className="download-btn">Download</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CategoryCards;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { generatePDF } from "./print/GeneratePDF"; // Import the PDF function
import "./Downloads.css";
import Navbar from "./Navbar";

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null); // Track loading state for each category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/categories`
        );
        setCategories(response.data); // Assuming response.data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDownloadPDF = async (categoryId, categoryName) => {
    setLoading(categoryId); // Indicate which category is loading

    try {
      // Fetch subcategories
      const subcategoryResponse = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
      );
      const subcategories = subcategoryResponse.data;

      let pages = [];

      // Fetch products for each subcategory
      for (const subcat of subcategories) {
        const productResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=0&maxPrice=999999&imgFlag=false`
        );
        const products = productResponse.data;

        // Paginate products (9 per page)
        const chunkSize = 9;
        for (let i = 0; i < products.length; i += chunkSize) {
          pages.push({
            subcategoryName: subcat.name,
            subPageNumber: Math.floor(i / chunkSize) + 1,
            productsOnPage: products.slice(i, i + chunkSize),
          });
        }
      }

      if (pages.length === 0) {
        alert("No products available for this category.");
        setLoading(null);
        return;
      }

      const pdfBytes = await generatePDF(
        pages,
        "SHIV ENTERPRISES", // Default company name (string ✅)
        "1st April 2024", // Date (string ✅)
        "9958660231, 7838146412, 9717437131", // Phone number should be a string (✅ FIXED)
        "Trademark:-Vidhata", // Hint text (string ✅)
        0, // No price adjustment (number ✅)
        true // No price flag (boolean ✅)
      );

      // Trigger file download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${categoryName}_Catalog.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(null); // Reset loading state
    }
  };

  return (
    <>
      <div className="ContactNavbar">
        <Navbar />
      </div>
      <h2 className="catalogs-heading">Catalogs</h2>
      <div className="grid-container">
        {categories.map((category) => (
          <div key={category.id} className="D-card">
            <img
              src={category.img_url}
              alt={category.name}
              className="card-img"
            />
            <h3 className="card-title">{category.name}</h3>
            <button
              className="download-btn"
              onClick={() => handleDownloadPDF(category.id, category.name)}
              disabled={loading === category.id}
            >
              {loading === category.id ? "Downloading..." : "Download"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryCards;
