import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Search, Filter, MoreHorizontal, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { products, deleteProduct, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Product Catalog</h2>
          <p className="text-gray-500 text-sm">Manage your inventory, pricing, and product variants.</p>
        </div>
        <Link 
          to="/admin/products/add" 
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-md font-bold text-sm active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="h-4 w-4 text-gray-500 hidden md:block" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 md:w-48 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-50 uppercase tracking-tight">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4 border-b border-gray-50">Product Details</th>
                <th className="p-4 border-b border-gray-50">Category</th>
                <th className="p-4 border-b border-gray-50">Pricing & Stock</th>
                <th className="p-4 border-b border-gray-50">Variants</th>
                <th className="p-4 border-b border-gray-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product.firestoreId || product.id} 
                    className="hover:bg-gray-25 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <img src={product.image} className="w-full h-full rounded-2xl object-cover border border-gray-100 shadow-sm" alt="" />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-sm" title="In Stock"></div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">ID: #{product.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-gray-900 text-sm">₹{product.price}</p>
                        <p className="text-[10px] text-gray-500 font-medium italic">MRP: ₹{Math.floor(product.price * 1.2)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes ? (
                          product.sizes.split(',').map(s => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">{s.trim()}</span>
                          ))
                        ) : <span className="text-gray-300 text-[10px]">No sizes</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/products/edit/${product.firestoreId || product.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.firestoreId || product.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                 <tr>
                   <td colSpan="5" className="text-center p-16">
                     <div className="flex flex-col items-center gap-3">
                       <div className="p-4 bg-gray-50 rounded-full">
                         <Search className="h-8 w-8 text-gray-300" />
                       </div>
                       <p className="text-gray-500 font-medium">No products match your criteria.</p>
                       <button 
                        onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                        className="text-gray-900 font-bold text-sm hover:underline"
                       >
                         Clear All Filters
                       </button>
                     </div>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
