import React from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  id: string; // Use string to match MongoDB's _id
  name: string;
  image: string;
  price: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, image, price, quantity }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1); // Decrease quantity
    }
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(id, quantity + 1); // Increase quantity
  };

  const handleRemoveItem = () => {
    removeFromCart(id); // Remove item from cart
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-md font-medium">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">Rs. {price}</p>
          </div>
          <p className="text-md font-semibold text-primary">
            Rs. {(Number(price) * quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-2">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8"
              onClick={handleIncreaseQuantity}
            >
              +
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={handleRemoveItem}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
