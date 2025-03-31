import React, { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";

const StyledCartButton = styled.a`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: #1a237e;
  border-radius: 30px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  text-decoration: none;
  z-index: 2000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CartIcon = styled(FaShoppingCart)`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const ItemCount = styled.span`
  background: #ff4757;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-left: 0.5rem;
`;

const CartButton = ({ itemCount }) => {
  return (
    <StyledCartButton href="/cart">
      <CartIcon /> Cart
      {itemCount > 0 && <ItemCount>{itemCount}</ItemCount>}
    </StyledCartButton>
  );
};

export default CartButton;
