import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store, Menu, Heart, Moon, Sun } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { wishlist, products } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFocused, setIsFocused] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setIsFocused(false);
    }
  };

  const suggestions = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100/50 transition-all dark:bg-gray-900/80 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <Store className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">H&B <span className="text-green-500">Store</span></span>
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-2xl mx-8 md:block relative">
            <form onSubmit={handleSearch} className="relative group z-20">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for groceries, drinks, snacks..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm relative z-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
            </form>
            {isFocused && searchTerm.trim() && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30">
                {suggestions.map(s => (
                  <Link 
                    key={s.id} 
                    to={`/product/${s.id}`} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <img src={s.image} alt={s.name} className="w-10 h-10 object-cover rounded bg-gray-100 border" />
                    <div>
                       <div className="font-semibold text-sm text-gray-800">{s.name}</div>
                       <div className="text-xs text-gray-500">{s.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {isFocused && (
               <div className="fixed inset-0 bg-black/20 z-0 backdrop-blur-sm transition-opacity" onClick={() => setIsFocused(false)}></div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-gray-600 hover:text-green-500 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to={user ? "/dashboard" : "/login"} className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors font-medium">
              <User className="h-5 w-5" />
              <span>{user ? user.name : 'Login'}</span>
            </Link>
            
            <Link to="/wishlist" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors font-medium group relative">
              <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-colors group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="font-semibold text-green-700 hidden sm:block">My Cart</span>
            </Link>
            
            <button className="md:hidden text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Search - Visible only on small screens */}
        <div className="p-3 md:hidden border-t border-gray-100">
           <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
