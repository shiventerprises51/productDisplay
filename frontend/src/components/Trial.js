// const Trial = () => {
//   return (
//     // <div>
//     //   <img
//     //     src="https://drive.google.com/uc?id=1IenORZzN2pneydRZ_Ke0PbKMMFEGgMKX"
//     //     alt="Google Drive Image"
//     //     style={{ width: "100%" }}
//     //   />
//     // </div>
//     <div>
//       <img
//         src={`https://lh3.googleusercontent.com/d/1IenORZzN2pneydRZ_Ke0PbKMMFEGgMKX=w1000`}
//         alt="Google Drive Image"
//         style={{ width: "100%" }}
//       />
//     </div>
//   );
// };

// export default Trial;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Trial = () => {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Send image_url to backend for uploading to Google Drive
  const handleUploadToDrive = async (id, imageUrl) => {
    if (!imageUrl) {
      alert("No image URL available!");
      return;
    }

    setUploading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await axios.post(
        "http://localhost:3001/api/imageupload",
        {
          imgUrl: imageUrl, // 🔥 Correct key name
          fileName: `${id}.jpg`, // 🔥 Provide a filename
        }
      );

      const imgFileId = response.data.fileId;
      console.log(`Product ${id} - File ID:`, imgFileId);

      // Update img_file_id in the database
      await axios.put(`http://localhost:3001/api/products/update-img/${id}`, {
        img_file_id: imgFileId,
      });

      alert(`Image for product ${id} uploaded to Drive successfully!`);
      fetchProducts(); // Refresh table after update
    } catch (error) {
      console.error("Error uploading image to Drive:", error);
      alert(`Failed to upload image for product ${id}.`);
    } finally {
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Details</th>
            <th>Image</th>
            <th>Drive Image</th> {/* New Column */}
            <th>Upload to Drive</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.details}</td>

              {/* Display Original Image */}
              <td>
                {product.image_url ? (
                  <a
                    href={product.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Image
                  </a>
                ) : (
                  "No Image"
                )}
              </td>

              {/* Display Image from Google Drive */}
              <td>
                {product.img_file_id ? (
                  // <img
                  //   // src={`https://drive.google.com/uc?export=view&id=${product.img_file_id}`}
                  // src={`https://lh3.googleusercontent.com/d/${product.img_file_id}`}
                  //   src={`https://photos.app.goo.gl/ASNtFTYuT8WVCAzo7`}
                  //   // src={`https://drive.google.com/uc?export=view&id=${product.img_file_id}`}
                  //   // src="https://drive.usercontent.google.com/download?id=1lxTZ7ejWuQ0-Dx28Jv7ilMgxx4knA1hR"
                  //   alt="Drive Image"
                  // />
                  <img
                    // src="https://photos.google.com/share/AF1QipMMWO1qhmeUYzRVdicwE0PSUXEbxUuMcUd7-VDo10pW-pdKznSI1cRAAtnVGeVBqg/photo/AF1QipOR7Cc6PfFa1CeCtuLR4K6hoMR23nudTCmCwGQI?key=V1h6dzg4bEhWNHo0MVJoVGxBTlZQVFY1Nk1KaEhR"
                    // src={`https://drive.google.com/thumbnail?id=${product.img_file_id}`}
                    src={`https://lh3.googleusercontent.com/d/${product.img_file_id}`}
                    alt="Product Image"
                    height={100}
                    width={100}
                  />
                ) : (
                  "Not Uploaded"
                )}
              </td>

              {/* Upload Button */}
              <td>
                <button
                  onClick={() =>
                    handleUploadToDrive(product.id, product.image_url)
                  }
                  disabled={uploading[product.id]}
                >
                  {uploading[product.id] ? "Uploading..." : "Upload to Drive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trial;
