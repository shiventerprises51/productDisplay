// //AdminDashboard.js

// import React, { useState, useEffect } from "react";
// import AdminAddCategory from "./AdminAddCategory";
// import AdminAddProduct from "./AdminAddProduct";
// import AdminAddSubcategories from "./AdminAddSubcategories";
// import AdminProductList from "./AdminProductList";
// const AdminDashboard = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/api/categories");
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const deleteCategory = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/api/categories/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error deleting category");
//       }

//       console.log("Category deleted");
//       fetchCategories(); // Refresh categories after deletion
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   return (
//     <div className="container">
//       {/* Admin Dashboard Title */}
//       <div className="d-flex justify-content-center my-4">
//         <h1>Admin Dashboard</h1>
//       </div>

//       {/* Add Product Section */}
//       <div className="mb-4">
//         <AdminAddProduct categories={categories} />
//       </div>

//       <div className="container">
//         <div className="row">
//           {/* Left Column */}
//           <div className="col-6 border-end border-3 pe-3">
//             <h3>Add New Category</h3>
//             <AdminAddCategory fetchCategories={fetchCategories} />
//             <h3 className="mt-4">Existing Categories</h3>
//             <ul className="list-group">
//               {categories.map((category) => (
//                 <li
//                   key={category.id}
//                   className="list-group-item d-flex align-items-center"
//                 >
//                   <span className="fw-bold">{category.name}</span>
//                   <button
//                     className="btn btn-danger btn-sm ms-2"
//                     onClick={() => deleteCategory(category.id)}
//                   >
//                     Delete
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Right Column */}
//           <div className="col-6 ps-3">
//             <h3>Add Subcategories</h3>
//             <AdminAddSubcategories categories={categories} />
//           </div>
//         </div>
//       </div>

//       {/* Product List Section */}
//       <div className="mt-4">
//         <AdminProductList />
//       </div>
//     </div>

//     // <div>
//     //   <div className="d-flex justify-content-center">
//     //     <h1>Admin Dashboard</h1>
//     //   </div>
//     //   <div>
//     //     <AdminAddProduct categories={categories} />
//     //     <div className="conatiner">
//     //       <div className="row">
//     //         <div className="col">
//     //           <AdminAddCategory fetchCategories={fetchCategories} />
//     //           <h3>Existing Categories</h3>
//     //           <ul>
//     //             {categories.map((category) => (
//     //               <li key={category.id}>
//     //                 {category.name}
//     //                 <button onClick={() => deleteCategory(category.id)}>
//     //                   Delete
//     //                 </button>
//     //               </li>
//     //             ))}
//     //           </ul>
//     //         </div>

//     //         <div className="col">
//     //           <AdminAddSubcategories categories={categories} />
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   <div>
//     //     <AdminProductList />
//     //   </div>
//     // </div>
//   );
// };

// export default AdminDashboard;

// //AdminAddCategory.js
// import React, { useState } from "react";

// const AdminAddCategory = ({ fetchCategories }) => {
//   const [categoryName, setCategoryName] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const categoryData = { name: categoryName };

//     try {
//       const response = await fetch("http://localhost:3001/api/categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(categoryData),
//       });

//       const data = await response.json();
//       console.log("Category added:", data);

//       // Reset form after successful submission
//       setCategoryName("");

//       // Fetch the updated categories list
//       fetchCategories();
//     } catch (error) {
//       console.error("Error adding category:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Add New Category</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Category Name"
//           value={categoryName}
//           onChange={(e) => setCategoryName(e.target.value)}
//           required
//         />
//         <button type="submit">Add Category</button>
//       </form>
//     </div>
//   );
// };

// export default AdminAddCategory;
