import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedCategory from '@/components/sections/FeaturedCategory';
import { fetchTrendingProducts } from '@/assets/data.js'; // Import the API function
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGrid from '@/components/products/ProductGrid';

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('PERFUMES');
  const [trendingProducts, setTrendingProducts] = useState({
    PERFUMES: [],
    DEODORANTS: [],
    LOTIONS: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation(); // For extracting the search query
  const navigate = useNavigate(); // For navigation

  // Fetch trending products when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTrendingProducts();
      if (data) {
        setTrendingProducts(data);
      }
    };

    fetchData();
  }, []);

  // Extract the search query from the URL and filter products
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    if (searchQuery) {
      const allProducts = [
        ...trendingProducts.PERFUMES,
        ...trendingProducts.DEODORANTS,
        ...trendingProducts.LOTIONS,
      ];

      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [location.search, trendingProducts]);

  // Handle product click to navigate to ProductDetailPage
  const handleProductClick = (product, category) => {
    navigate(`/product/${category}/${product._id}`, { state: { product } });
  };

  return (
    <PageLayout>
      <HeroSection />

      {/* Search Results Section */}
      {filteredProducts.length > 0 ? (
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-playfair text-center mb-8">
              Search Results
            </h2>
            <ProductGrid
              products={filteredProducts}
              category="search"
              onProductClick={(product) => handleProductClick(product, 'search')}
            />
          </div>
        </section>
      ) : (
        <>
          {/* Trending Products Section */}
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold font-playfair text-center mb-8">
                Trending Products
              </h2>

              <Tabs defaultValue="PERFUMES" onValueChange={setActiveCategory} className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="bg-white">
                    <TabsTrigger value="PERFUMES" className="text-sm md:text-base">Perfumes</TabsTrigger>
                    <TabsTrigger value="DEODORANTS" className="text-sm md:text-base">Deodorants</TabsTrigger>
                    <TabsTrigger value="LOTIONS" className="text-sm md:text-base">Lotions</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="PERFUMES" className="animate-fade-in">
                  <ProductGrid
                    products={trendingProducts.PERFUMES}
                    category="perfumes"
                    onProductClick={(product) => handleProductClick(product, 'perfumes')}
                  />
                </TabsContent>

                <TabsContent value="DEODORANTS" className="animate-fade-in">
                  <ProductGrid
                    products={trendingProducts.DEODORANTS}
                    category="deodorants"
                    onProductClick={(product) => handleProductClick(product, 'deodorants')}
                  />
                </TabsContent>

                <TabsContent value="LOTIONS" className="animate-fade-in">
                  <ProductGrid
                    products={trendingProducts.LOTIONS}
                    category="lotions"
                    onProductClick={(product) => handleProductClick(product, 'lotions')}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Featured Categories */}
          <FeaturedCategory
            title="Premium Perfumes"
            products={trendingProducts.PERFUMES}
            category="perfumes"
            linkTo="/perfumes"
            onProductClick={(product) => handleProductClick(product, 'perfumes')}
          />

          <FeaturedCategory
            title="Deodorants Collection"
            products={trendingProducts.DEODORANTS}
            category="deodorants"
            linkTo="/deodorants"
            onProductClick={(product) => handleProductClick(product, 'deodorants')}
          />

          <FeaturedCategory
            title="Luxury Lotions"
            products={trendingProducts.LOTIONS}
            category="lotions"
            linkTo="/lotions"
            onProductClick={(product) => handleProductClick(product, 'lotions')}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Dashboard;