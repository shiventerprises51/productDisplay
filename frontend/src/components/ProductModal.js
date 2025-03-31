import React, { useRef, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import "./ProductModal.css";

const ProductModal = ({
  modalProduct,
  closeModal,
  handleAddToCart,
  handleRemoveFromCart,
  cartItems,
  handlePreviousProduct,
  handleNextProduct,
  handleTouchStart,
  handleTouchEnd,
  currentProductIndex,
  displayOrder,
  setQuantity,
}) => {
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  if (!modalProduct) return null;

  const cartProduct = cartItems.find((item) => item.id === modalProduct.id);

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="close-btn" onClick={closeModal}>
          <FiX size={24} />
        </button>

        <div className="modal-navigation">
          <button className="nav-arrow prev" onClick={handlePreviousProduct}>
            <FiArrowLeft size={32} />
          </button>
          <button className="nav-arrow next" onClick={handleNextProduct}>
            <FiArrowRight size={32} />
          </button>
        </div>

        <div className="modal-content">
          <div className="Modal-product-image">
            <img
              className="Modal-product-img"
              src={modalProduct.image_url}
              alt={modalProduct.name}
              loading="lazy"
            />
          </div>

          <div className="product-details">
            <h2 className="product-title">{modalProduct.name}</h2>
            <div className="price-section">
              <span className="price-label">Price:</span>
              <span className="price-value">₹{modalProduct.price}</span>
            </div>
            <p className="product-description">{modalProduct.details}</p>

            {cartProduct ? (
              <div className="quantity-controls">
                <button
                  className="quantity-btn btn-negtive"
                  onClick={() => {
                    if (cartProduct.quantity === 1) {
                      handleRemoveFromCart(modalProduct, true);
                    } else {
                      handleRemoveFromCart(modalProduct);
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={cartProduct.quantity}
                  className="quantity-input"
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setQuantity(cartProduct, newQuantity);
                  }}
                />
                <button
                  className="quantity-btn btn-postive"
                  onClick={() => handleAddToCart(modalProduct)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(modalProduct)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
