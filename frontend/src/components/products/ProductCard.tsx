import React from 'react';
import { Button } from "@/components/ui/button";
import Rating from '@/components/ui/rating';
import { ShoppingCart } from 'lucide-react';
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { addToCart } from '@/assets/data'; // Import the addToCart API function
import {toast} from "sonner"; // Import toast for notifications
interface ProductCardProps {
  id: string; // Use id here (mapped from _id in ProductGrid)
  name: string;
  image: string;
  price: string;
  rating: number;
  category: string;
  description: string;
  onClick?: () => void; // Optional onClick handler
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  rating,
  category,
  description,
  onClick, // Accept the onClick prop
}) => {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation to avoid triggering parent click handlers

    const userId = localStorage.getItem("userId"); // Replace with the actual user ID from your authentication context or state
    console.log('User ID:', userId); // Log the user ID for debugging
    try {   
      // Call the Cart API to add the product
      const updatedCart = await addToCart(userId, {
        productId: id, // Use id here
        name,
        image,
        price,
        rating,
        description,
      });

      console.log('Product added to cart:', updatedCart);
      toast.success(`${name} added to cart successfully!`); // Show success notification
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart. Please try again.'); // Show error notification
    }
  };

  return (
    <Card
      className="product-card group h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick} // Call the onClick handler when the card is clicked
    >
      <div className="overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="product-image w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-medium text-lg mb-2">{name}</CardTitle>
        <p className="text-sm text-gray-600 mb-2">{description}</p> {/* Display the description */}
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-black">Rs. {price}</p>
          <Rating value={rating} />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;