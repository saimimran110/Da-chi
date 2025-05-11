import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { searchProduct } from "@/assets/data";

const HeroSection: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await searchProduct("buraq"); // Replace with the product name you want to search
        setProduct(result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.category}/${product._id}`, { state: { product } }); // Pass product via state
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <section className="bg-gradient-to-r from-gray-100 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
              Discover Your <span className="text-black">Signature Scent</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-md">
              Explore our collection of premium fragrances, deodorants, and lotions crafted to enhance your personal style.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800 transition-colors">
                <a className="flex items-center">
                  Shop Perfumes
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-black hover:bg-black hover:text-white">
                <a>Shop Deodorants</a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Circular Container */}
              <div
                onClick={() => handleProductClick(product)} // Call handleProductClick on click
                className="bg-gradient-to-br from-gray-100 to-white rounded-full w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 -right-4 bg-black text-white rounded-full shadow-lg p-3 animate-bounce">
                <span className="font-medium">New!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;