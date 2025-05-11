import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import { ShoppingCart, ArrowLeft, Heart, Share2, Minus, Plus, Check } from "lucide-react";
import { fetchTrendingProducts, addToCart } from "@/assets/data";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, id } = useParams();
  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);

        // Fetch trending products
        const trending = await fetchTrendingProducts();

        // Filter related products based on the category
        if (trending) {
          const related =
            category === "perfumes"
              ? trending.PERFUMES
              : category === "lotions"
              ? trending.LOTIONS
              : trending.DEODORANTS;

          // Shuffle and pick 4 random related products
          setRelatedProducts(related.sort(() => 0.5 - Math.random()).slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        toast.error("Failed to load related products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [category]);

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === "increase") {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    try {
      setIsLoading(true);
      console.log("quantity", quantity);  
      const updatedCart = await addToCart(userId, {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        rating: product.rating,
        description: product.description,
        quantity: quantity,
      });

      console.log("Product added to cart:", updatedCart);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product && !isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {category || "products"}
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          product && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-[400px] md:h-[500px] object-contain p-4 transition-all duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20"
                      >
                        {category?.toUpperCase() || "FEATURED"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Heart className="h-5 w-5" />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Share2 className="h-5 w-5" />
                          <span className="sr-only">Share product</span>
                        </Button>
                      </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-playfair mt-2 mb-2 text-gray-900">
                      {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                      <Rating value={product.rating} className="text-amber-400" />
                      <span className="text-sm text-gray-500">({Math.floor(product.rating * 10)} reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-primary">Rs. {product.price}</span>
                    </div>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>In stock and ready to ship</span>
                  </div>

                  <Separator />

                  {/* Quantity Selector */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center w-fit border rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center">{quantity}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange("increase")}
                        className="h-10 w-10 rounded-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isLoading}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

             
{/* Related Products Section */}
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-6">You might also like</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {relatedProducts.map((relatedProduct) => (
      <div
        key={relatedProduct._id}
        onClick={() =>
          navigate(`/product/${relatedProduct.category}/${relatedProduct._id}`, {
            state: { product: relatedProduct },
          })
        }
        className="cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="w-full h-48 flex items-center justify-center overflow-hidden">
          <img
            src={relatedProduct.image}
            alt={relatedProduct.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">{relatedProduct.name}</h3>
          <p className="text-sm text-gray-500 mb-2">Rs. {relatedProduct.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>
            </>
          )
        )}
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;