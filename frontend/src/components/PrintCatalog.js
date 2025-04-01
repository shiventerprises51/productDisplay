// import React, { useEffect, useState } from "react";
// // import { PDFDocument } from "pdf-lib";
// import axios from "axios";
// import PrintCatNav from "./PrintCatNav";
// // import HandlePrint from "./print/HandlePrint";
// import { useNavigate } from "react-router-dom";

// const PrintCatalog = () => {
//   const navigate = useNavigate();
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [companyName, setCompanyName] = useState("SHIV ENTERPRISES");
//   const [mobileNumber, setMobileNumber] = useState(
//     "9958660231, 7838146412, 9717437131"
//   );
//   const [dateApplicaple, setDateApplicaple] = useState("1st April 2024");
//   const [priceFlag, setPriceFlag] = useState(true); // Whether to show prices
//   const [imgFlag, setImgFlag] = useState(true);
//   const [priceAdjustment, setPriceAdjustment] = useState(0); // Percentage adjustment
//   const [minPrice, setMinPrice] = useState(0); // Minimum price
//   const [maxPrice, setMaxPrice] = useState(1000); // Maximum price
//   const [hintText, setHintText] = useState("Trademark:-Vidhata");
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [successMessage, setSuccessMessage] = useState(""); // Success message
//   const [showHandlePrint, setShowHandlePrint] = useState(false); // State to control HandlePrint visibility

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}/api/categories`
//       );
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handlePrint = () => {
//     if (!categoryName) {
//       alert("Please select a category.");
//       return;
//     }

//     const selectedCategory = categories.find(
//       (cat) => String(cat.id) === String(categoryName)
//     );

//     // setIsLoading(true);
//     setSuccessMessage("Scroll below for preview"); // Clear previous success message

//     // Show the HandlePrint component
//     setShowHandlePrint(true);
//   };

//   const handlePreview = () => {
//     if (categoryName == "") {
//       alert("Please select the category");
//       return;
//     }
//     const props = {
//       dateApplicable: dateApplicaple,
//       priceFlag: priceFlag,
//       imgFlag: imgFlag,
//       priceAdjustment: priceAdjustment,
//       companyName: companyName,
//       phoneNumbers: mobileNumber,
//       hintText: hintText,
//       categoryId: categoryName,
//       minPrice: minPrice,
//       maxPrice: maxPrice,
//     };
//     navigate("/admin/printPreview", { state: props });
//   };

//   return (
//     <div className="Admin-parent">
//       <div className="">
//         <PrintCatNav />
//       </div>
//       <div className="container my-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h2 className="card-title text-center mb-4">Print Catalog</h2>
//             {isLoading && (
//               <div className="loading-overlay">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p>Generating and downloading catalog...</p>
//               </div>
//             )}
//             <form>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="categoryName" className="form-label">
//                     Select Category:
//                   </label>
//                   <select
//                     id="categoryName"
//                     className="form-select"
//                     onChange={(e) => setCategoryName(e.target.value)}
//                     disabled={isLoading}
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="companyName" className="form-label">
//                     Company Name:
//                   </label>
//                   <input
//                     type="text"
//                     id="companyName"
//                     className="form-control"
//                     value={companyName}
//                     onChange={(e) => setCompanyName(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label htmlFor="mobileNumber" className="form-label">
//                     Mobile Number:
//                   </label>
//                   <input
//                     type="text"
//                     id="mobileNumber"
//                     className="form-control"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="dateApplicable" className="form-label">
//                     Date Applicable:
//                   </label>
//                   <input
//                     type="text"
//                     id="dateApplicable"
//                     className="form-control"
//                     value={dateApplicaple}
//                     onChange={(e) => setDateApplicaple(e.target.value)}
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label htmlFor="hintText" className="form-label">
//                     Hint Text:
//                   </label>
//                   <input
//                     type="text"
//                     id="hintText"
//                     className="form-control"
//                     value={hintText}
//                     onChange={(e) => setHintText(e.target.value)}
//                     placeholder="Enter hint text"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       id="priceFlag"
//                       checked={priceFlag}
//                       onChange={(e) => setPriceFlag(e.target.checked)}
//                       disabled={isLoading}
//                     />
//                     <label className="form-check-label" htmlFor="priceFlag">
//                       Show Prices
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       id="priceFlag"
//                       checked={imgFlag}
//                       onChange={(e) => setImgFlag(e.target.checked)}
//                       disabled={isLoading}
//                     />
//                     <label className="form-check-label" htmlFor="priceFlag">
//                       Show image-less products
//                     </label>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <label htmlFor="priceAdjustment" className="form-label">
//                     Price Adjustment (%):
//                   </label>
//                   <input
//                     type="number"
//                     id="priceAdjustment"
//                     className="form-control"
//                     value={priceAdjustment}
//                     onChange={(e) => setPriceAdjustment(e.target.value)}
//                     placeholder="Enter percentage (e.g., 10 or -10)"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="minPrice" className="form-label">
//                     Minimum Price:
//                   </label>
//                   <input
//                     type="number"
//                     id="minPrice"
//                     className="form-control"
//                     value={minPrice}
//                     onChange={(e) => setMinPrice(e.target.value)}
//                     placeholder="Enter minimum price"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label htmlFor="maxPrice" className="form-label">
//                     Maximum Price:
//                   </label>
//                   <input
//                     type="number"
//                     id="maxPrice"
//                     className="form-control"
//                     value={maxPrice}
//                     onChange={(e) => setMaxPrice(e.target.value)}
//                     placeholder="Enter maximum price"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handlePreview}
//                   disabled={isLoading}
//                 >
//                   Preview
//                 </button>
//               </div>
//             </form>
//             {successMessage && (
//               <div className="alert alert-success mt-4" role="alert">
//                 {successMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrintCatalog;

import React, { useEffect, useState } from "react";
import axios from "axios";
import PrintCatNav from "./PrintCatNav";
import { useNavigate } from "react-router-dom";

const PrintCatalog = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Array to store selected category IDs
  const [companyName, setCompanyName] = useState("SHIV ENTERPRISES");
  const [mobileNumber, setMobileNumber] = useState(
    "9717437131, 7838146412, 9818143181"
  );
  const [dateApplicaple, setDateApplicaple] = useState("1st April 2024");
  const [priceFlag, setPriceFlag] = useState(true); // Whether to show prices
  const [imgFlag, setImgFlag] = useState(true);
  const [priceAdjustment, setPriceAdjustment] = useState(0); // Percentage adjustment
  const [minPrice, setMinPrice] = useState(0); // Minimum price
  const [maxPrice, setMaxPrice] = useState(1000); // Maximum price
  const [hintText, setHintText] = useState("Trademark:-Vidhata");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCategorySelection = (categoryId) => {
    // Toggle category selection
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handlePreview = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const props = {
      dateApplicable: dateApplicaple,
      priceFlag: priceFlag,
      imgFlag: imgFlag,
      priceAdjustment: priceAdjustment,
      companyName: companyName,
      phoneNumbers: mobileNumber,
      hintText: hintText,
      categoryIds: selectedCategories, // Pass selected category IDs as an array
      minPrice: minPrice,
      maxPrice: maxPrice,
    };
    navigate("/admin/printPreview", { state: props });
  };

  return (
    <div className="Admin-parent">
      <div className="">
        <PrintCatNav />
      </div>
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Print Catalog</h2>
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Generating and downloading catalog...</p>
              </div>
            )}
            <form>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Select Categories:</label>
                  <div className="category-checkboxes">
                    {categories.map((cat) => (
                      <div key={cat.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`category-${cat.id}`}
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => handleCategorySelection(cat.id)}
                          disabled={isLoading}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`category-${cat.id}`}
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="companyName" className="form-label">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    className="form-control"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number:
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    className="form-control"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="dateApplicable" className="form-label">
                    Date Applicable:
                  </label>
                  <input
                    type="text"
                    id="dateApplicable"
                    className="form-control"
                    value={dateApplicaple}
                    onChange={(e) => setDateApplicaple(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="hintText" className="form-label">
                    Hint Text:
                  </label>
                  <input
                    type="text"
                    id="hintText"
                    className="form-control"
                    value={hintText}
                    onChange={(e) => setHintText(e.target.value)}
                    placeholder="Enter hint text"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="priceFlag"
                      checked={priceFlag}
                      onChange={(e) => setPriceFlag(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="priceFlag">
                      Show Prices
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="priceFlag"
                      checked={imgFlag}
                      onChange={(e) => setImgFlag(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="priceFlag">
                      Show image-less products
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="priceAdjustment" className="form-label">
                    Price Adjustment (%):
                  </label>
                  <input
                    type="number"
                    id="priceAdjustment"
                    className="form-control"
                    value={priceAdjustment}
                    onChange={(e) => setPriceAdjustment(e.target.value)}
                    placeholder="Enter percentage (e.g., 10 or -10)"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="minPrice" className="form-label">
                    Minimum Price:
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    className="form-control"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Enter minimum price"
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="maxPrice" className="form-label">
                    Maximum Price:
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Enter maximum price"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePreview}
                  disabled={isLoading}
                >
                  Preview
                </button>
              </div>
            </form>
            {successMessage && (
              <div className="alert alert-success mt-4" role="alert">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCatalog;
