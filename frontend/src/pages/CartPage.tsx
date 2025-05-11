import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from "./CheckoutForm"; // Import the CheckoutForm component
import { placeOrder } from '@/assets/data'; // Import the placeOrder API function
import { useNavigate } from 'react-router-dom';


const CartPage: React.FC = () => {
  const navigate = useNavigate(); // For navigation
  const { cartItems, subtotal, clearCart } = useCart(); // everything from context
  const [isCheckout, setIsCheckout] = useState(false); // State to toggle the checkout form

const handleCheckout = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.error("Please login to proceed to checkout.");
    navigate("/auth"); // Redirect to login/signup page
    return;
  }
  setIsCheckout(true); // Show the checkout form
};

  const handleCheckoutSuccess = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Replace with the actual user ID from your authentication context or state
      const orderDetails = await placeOrder(userId); // Call the placeOrder API
      console.log("Order Details:", orderDetails);

      // Show success toast and clear the cart
      toast.success("Order placed successfully!");
      clearCart();
      setIsCheckout(false); // Hide the checkout form
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };


  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-playfair mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : isCheckout ? (
          // Show the CheckoutForm when the user clicks "Checkout"
          <CheckoutForm onSuccess={handleCheckoutSuccess} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    id={item.productId}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    quantity={item.quantity}
                  />
                ))}
              </div>

              {/* <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared successfully!");
                  }}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Clear Cart
                </Button>
              </div> */}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">Rs. {subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleCheckout}>
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CartPage;