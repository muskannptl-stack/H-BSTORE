import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories: dynamicCategories } = useData();
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [priceRange, setPriceRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState(searchParam || '');

  const categoryNames = (dynamicCategories || []).map(c => typeof c === 'string' ? c : c?.name).filter(Boolean);
  const categories = ['All', ...categoryNames];
  const priceRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under ₹50', min: 0, max: 50 },
    { label: '₹50 - ₹150', min: 50, max: 150 },
    { label: 'Over ₹150', min: 150, max: Infinity }
  ];

  useEffect(() => {
    // Sync params with state
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [categoryParam, searchParam, selectedCategory, searchTerm]);

  useEffect(() => {
    let result = products || [];

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.name?.toLowerCase() || '').includes(lowerSearch) || 
        (p.category?.toLowerCase() || '').includes(lowerSearch)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    if (priceRange !== 'All') {
      const range = priceRanges.find(r => r.label === priceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Filters</h2>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Price Range</h3>
              <ul className="space-y-2">
                {priceRanges.map(range => (
                  <li key={range.label}>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input 
                        type="radio" 
                        name="price" 
                        value={range.label}
                        checked={priceRange === range.label}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="text-green-500 focus:ring-green-500"
                      />
                      {range.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchTerm ? `Search results for "${searchTerm}"` : (selectedCategory === 'All' ? 'All Products' : selectedCategory)}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Showing {filteredProducts.length} products</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Search in these results..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hidden sm:block"
            />
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-400 mb-4 text-6xl">😕</div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange('All');
                  setSearchTerm('');
                  setSearchParams({});
                }}
                className="mt-4 text-green-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
