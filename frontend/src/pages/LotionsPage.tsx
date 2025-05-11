import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { fetchLotions } from '@/assets/data.js';
import ProductCard from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LotionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [lotionsList, setLotionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLotions();
        setLotionsList(data); // Store fetched lotions in state
      } catch (error) {
        console.error('Error fetching lotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = lotionsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return parseInt(a.price) - parseInt(b.price);
    } else if (sortBy === 'price-high') {
      return parseInt(b.price) - parseInt(a.price);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleProductClick = (product) => {
    navigate(`/product/lotions/${product._id}`, { state: { product } }); // Pass product via state
  };

  return (
    <PageLayout>
      <div className="bg-secondary/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-playfair mb-2">Luxury Lotions</h1>
          <p className="text-gray-600 mb-0">Indulge in our premium collection of lotions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search lotions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">Loading lotions...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                image={product.image}
                price={product.price}
                rating={product.rating}
                category="lotions"
                description={product.description}
                onClick={() => handleProductClick(product)} // Handle product click
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No lotions found matching your search.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default LotionsPage;