import React, { useContext } from "react";
import "./ProductCards.css";
import { CartContext } from "./context/Cart";

const ProductCards = ({
  id,
  category,
  image_url,
  name,
  price,
  description,
}) => {
  const product = { id, category, image_url, name, price, description };
  const { cartItems, addToCart, removeFromCart, setQuantity } =
    useContext(CartContext);

  const cartProduct = cartItems.find((item) => item.id === product.id);

  return (
    <div className="product-card">
      <img
        src={image_url}
        alt={name}
        className="product-image"
        loading="lazy"
      />
      <div className="product-details">
        <h5 className="product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="product-description">{description}</p>
      </div>

      {cartProduct ? (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (cartProduct.quantity === 1) {
                removeFromCart(product, true);
              } else {
                removeFromCart(product);
              }
            }}
            className="quantity-btn-product"
          >
            -
          </button>

          <input
            onClick={(e) => e.stopPropagation()}
            type="number"
            value={cartProduct.quantity}
            // min="0"
            style={{ width: "60px", textAlign: "center" }}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value);

              setQuantity(cartProduct, newQuantity);
            }}
          />
          {/* <button
            className="btn btn-success btn-sm d-flex align-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="bi bi-cart me-1"></i>
            {cartProduct.quantity}
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="quantity-btn-product"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="btn btn-warning btn-sm"
        >
          Add to cart
        </button>
      )}
    </div>
  );
};

export default ProductCards;
