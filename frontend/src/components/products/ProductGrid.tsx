import React from 'react';
import ProductCard from './ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  _id: string; // Use _id instead of id
  name: string;
  image: string;
  price: string;
  rating: number;
  description?: string; // Optional description
}

interface ProductGridProps {
  products: Product[];
  category: string;
  onProductClick?: (product: Product) => void; // Optional onClick handler for products
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, category, onProductClick }) => {
  const isMobile = useIsMobile();
  console.log('Products:', products);
  console.log('Is Mobile:', isMobile);

  if (isMobile) {
    console.log('Rendering Carousel');
    return (
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => {
              console.log('Rendering Product in Carousel:', product);
              return (
                <CarouselItem key={product._id} className="pl-2 md:pl-4 basis-1/2">
                  <div className="h-full">
                    <ProductCard
                      id={product._id} // Use _id here
                      name={product.name}
                      image={product.image}
                      price={product.price}
                      rating={product.rating}
                      category={category}
                      description={product.description}
                      onClick={() => onProductClick?.(product)}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 left-0" />
            <CarouselNext className="relative inset-0 translate-y-0 right-0" />
          </div>
        </Carousel>
      </div>
    );
  }

  console.log('Rendering Grid');
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        console.log('Rendering Product in Grid:', product);
        return (
          <ProductCard
            key={product._id} // Use _id here
            id={product._id} // Use _id here
            name={product.name}
            image={product.image}
            price={product.price}
            rating={product.rating}
            category={category}
            description={product.description}
            onClick={() => onProductClick?.(product)}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;