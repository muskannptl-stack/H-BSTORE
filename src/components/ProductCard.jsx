import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { wishlist, toggleWishlist } = useData();
  const { addToast } = useToast();
  
  const cartItem = cartItems.find(item => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    updateQuantity(product.id, 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    updateQuantity(product.id, -1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
    if (!isWishlisted) {
      addToast(`${product.name} added to wishlist`);
    } else {
      addToast(`${product.name} removed from wishlist`, 'error');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 overflow-hidden flex flex-col h-full group relative transition-all"
    >
      <Link to={`/product/${product.id}`} className="relative bg-gray-50/50 pt-[100%] overflow-hidden block rounded-t-3xl border-b border-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full text-gray-800 shadow-sm border border-white/50">
          {product.category}
        </div>
      </Link>
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10 shadow-sm border border-white/50"
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block flex-grow">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors leading-snug mb-1.5">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50/80">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through font-medium">₹{product.price + Math.floor(product.price * 0.2)}</span>
            <span className="font-extrabold text-xl text-gray-900 leading-none">₹{product.price}</span>
          </div>
          
          {cartItem ? (
            <div className="flex items-center bg-green-500 rounded-xl text-white shadow-md shadow-green-200">
              <button 
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center hover:bg-green-600 active:scale-95 transition-colors rounded-l-xl"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold">{cartItem.quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center hover:bg-green-600 active:scale-95 transition-colors rounded-r-xl"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="bg-white text-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-5 rounded-xl transition-all active:scale-95 border-2 border-green-100 hover:border-green-600 text-sm shadow-sm hover:shadow-md hover:shadow-green-200"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
