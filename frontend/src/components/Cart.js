import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/Cart";
import "./Cart.css"; // Create this CSS file

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    setQuantity,
  } = useContext(CartContext);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const orderDetails = cartItems
      .map((item) => `${item.category} - ${item.name} (Qty: ${item.quantity})`)
      .join("\n");

    const totalAmount = getCartTotal();
    const message = `Order Details:\n${orderDetails}\n\nTotal: ₹${totalAmount}`;
    const encodedMessage = encodeURIComponent(message);
    const adminWhatsAppNumber = "9717437131"; // Replace with actual number

    window.open(
      `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`,
      "_blank"
    );
    clearCart();
  };

  return (
    <div className="container py-5">
      <button
        className="btn btn-secondary back-button mb-4"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Shopping
      </button>

      <h1 className="text-center mb-4">Your Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Product">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="img-fluid me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <div className="text-muted">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">₹{item.price}</td>
                    <td data-label="Quantity">
                      <div className="quantity-control">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => removeFromCart(item)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            setQuantity(item, newQuantity);
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td data-label="Total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td data-label="Actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item, true)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="m-0">Order Summary</h3>
              <h3 className="m-0">₹{getCartTotal().toFixed(2)}</h3>
            </div>
            <div className="d-grid gap-3">
              <button
                className="btn btn-lg btn-success"
                onClick={handlePlaceOrder}
              >
                Place Order via WhatsApp
              </button>
              <button
                className="btn btn-lg btn-outline-danger"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart-message">
          <h3>Your Cart Feels Lonely</h3>
          <p className="text-muted mt-3">
            Add some products to your cart and they'll appear here!
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/FrontPage")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
