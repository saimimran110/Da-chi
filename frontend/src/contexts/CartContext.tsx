import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { toast } from "sonner";
import { fetchCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartQuantity } from '@/assets/data'; // Import API functions

type Product = {
  id: string; // Use MongoDB's _id as id
  name: string;
  image: string;
  price: string;
  rating?: number;
  description?: string;
};

type CartItem = Product & {
  quantity: number;
};

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  cartItems: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART": {
      return {
        ...state,
        cartItems: action.payload,
      };
    }

    case "ADD_TO_CART": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
    }

    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const userId = localStorage.getItem("userId"); // Replace with actual user ID from authentication context or state

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await fetchCart(userId); // Fetch cart from backend
        dispatch({ type: "SET_CART", payload: cart.items || [] });
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load cart. Please try again.");
      }
    };

    loadCart();
  }, [userId,state.cartItems]);
const addToCart = async (product: Product) => {
  try {
    const updatedCart = await addToCartAPI(userId, {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
      description: product.description,
    });
    dispatch({ type: "SET_CART", payload: updatedCart.items });
    toast.success(`${product.name} added to cart successfully!`); // Show success toast
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("Failed to add item to cart. Please try again."); // Show error toast
  }
};

  const removeFromCart = async (id: string) => {
  try {
    const updatedCart = await removeFromCartAPI(userId, id); // Call the API to remove the item
    dispatch({ type: "SET_CART", payload: updatedCart.items }); // Update the cart state
    toast.success("Item removed from cart!");
     console.log("Updated Cart:", updatedCart); // Debugging
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove item from cart. Please try again.");
  }
};
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const updatedCart = await updateCartQuantity(userId, id, quantity > 0 ? "increment" : "decrement");
      dispatch({ type: "SET_CART", payload: updatedCart.items });
      toast.success("Cart updated successfully!");
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

const clearCart = async () => {
  // try {
  //   const updatedCart = await clearCartAPI(userId); // Call the API to clear the cart
  //   dispatch({ type: "CLEAR_CART" }); // Clear the cart in the state
  //   toast.success("Cart cleared successfully!");
  // } catch (error) {
  //   console.error("Error clearing cart:", error);
  //   toast.error("Failed to clear cart. Please try again.");
  // }
};

  const totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};