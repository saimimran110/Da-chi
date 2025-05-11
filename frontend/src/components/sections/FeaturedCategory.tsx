import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProductGrid from '@/components/products/ProductGrid';
import { ArrowRight } from 'lucide-react';

interface Product {
  _id: string; // Use _id instead of id
  name: string;
  image: string;
  price: string;
  rating: number;
}

interface FeaturedCategoryProps {
  title: string;
  products: Product[];
  category: string;
  linkTo: string;
  onProductClick?: (product: Product) => void; // Add onProductClick prop
}

const FeaturedCategory: React.FC<FeaturedCategoryProps> = ({
  title,
  products,
  category,
  linkTo,
  onProductClick, // Accept onProductClick prop
}) => {
  // Display only first 4 products on home page
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-playfair">{title}</h2>
          <Link to={linkTo}>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <ProductGrid
          products={displayProducts}
          category={category}
          onProductClick={onProductClick} // Pass onProductClick to ProductGrid
        />
      </div>
    </section>
  );
};

export default FeaturedCategory;