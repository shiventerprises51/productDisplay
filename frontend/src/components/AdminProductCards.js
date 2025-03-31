import React, { useEffect, useState } from "react";
import "./AdminProductCards.css";

const AdminProductCards = ({ image, name, price, description, id }) => {
  const [products, setProducts] = useState([]);
  return (
    <div>
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h5 className="Admin-product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="Admin-product-description">{description}</p>
      </div>
    </div>
  );
};

export default AdminProductCards;
