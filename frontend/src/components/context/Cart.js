import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );

  const quantityInCart = () => {
    return cartItems.length;
  };

  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart) {
      console.log(cartItems);
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item, removeCompletely = false) => {
    let updatedCartItems;

    if (removeCompletely) {
      // Remove the item completely from the cart
      updatedCartItems = cartItems.filter(
        (cartItem) => cartItem.id !== item.id
      );
    } else {
      // Reduce quantity or remove if quantity is 1
      updatedCartItems = cartItems
        .map((cartItem) =>
          cartItem.id === item.id && cartItem.quantity > 1
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0); // Ensure no zero-quantity items remain
    }

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update localStorage
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems"); // Clear from localStorage as well
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const setQuantity = (item, quantity) => {
    if (quantity <= 0) {
      // If the quantity is less than or equal to 0, remove the item from the cart
      removeFromCart(item);
    } else {
      // Update the quantity of the item in the cart
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: quantity } : cartItem
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update localStorage
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        setQuantity,
        quantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
