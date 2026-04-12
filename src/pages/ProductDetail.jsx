import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { ChevronRight, ShieldCheck, Truck, Plus, Minus, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, wishlist, toggleWishlist } = useData();
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));
  const cartItem = cartItems.find(item => item.id === product?.id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link to="/products" className="text-green-600 mt-4 inline-block hover:underline">Return to products</Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-xs text-gray-500 gap-2">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/products?category=${product.category}`} className="hover:text-green-600">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Image */}
          <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center border border-gray-100 aspect-square md:aspect-auto md:h-[500px]">
             <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="text-sm text-green-600 font-semibold mb-2">{product.category}</div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900 pr-4">{product.name}</h1>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 bg-gray-50 hover:bg-red-50 rounded-full transition-colors group"
                >
                  <Heart className={`h-6 w-6 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                <span className="text-lg text-gray-400 line-through">₹{product.price + Math.floor(product.price * 0.2)}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">20% OFF</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</p>

              <div className="mt-8 space-y-6">
                {product.sizes && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Size</h3>
                    <div className="flex flex-wrap gap-2">
                       {product.sizes.split(',').map(s => (
                         <button key={s} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            {s.trim()}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {product.colors && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Colors</h3>
                    <div className="flex flex-wrap gap-2">
                       {product.colors.split(',').map(c => (
                         <div key={c} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-gray-900 transition-all">
                            <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.trim().toLowerCase() }}></span>
                            <span className="text-xs font-bold text-gray-700">{c.trim()}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>


            <div className="border-t border-b border-gray-100 py-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Action */}
            <div className="mt-auto pt-6">
              {cartItem ? (
                <div className="flex items-center justify-center bg-green-500 rounded-xl text-white font-medium p-2 w-full sm:w-64 mx-auto md:mx-0 shadow-lg shadow-green-200">
                  <button 
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-green-600 rounded-lg transition-colors active:scale-95"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="flex-1 text-center text-xl font-bold">{cartItem.quantity} <span className="text-xs font-normal opacity-80 block">in cart</span></span>
                  <button 
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-green-600 rounded-lg transition-colors active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full sm:w-64 bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                >
                  ADD TO CART
                </button>
              )}
            </div>
            
            {/* Promises */}
            <div className="grid grid-cols-2 gap-4 mt-8 bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm"><span className="font-semibold block text-gray-800">Superfast</span> <span className="text-gray-500">Delivery</span></div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-lg shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                 </div>
                 <div className="text-sm"><span className="font-semibold block text-gray-800">100% Genuine</span> <span className="text-gray-500">Products</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
