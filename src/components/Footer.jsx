import React from 'react';
import { Store, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = React.useState(0);

  const handleAdminClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        navigate('/admin');
        return 0;
      }
      return newCount;
    });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-500 p-1.5 rounded-lg">
                <Store className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">H&B Store</span>
            </div>
            <p className="text-sm text-gray-400">
              Your favorite online grocery and convenience store. Groceries delivered in minutes.
            </p>
          </div>
          <div>
             <h3 className="text-white font-semibold mb-4">Categories</h3>
             <ul className="space-y-2 text-sm">
               <li><Link to="/products?category=Grocery" className="hover:text-green-400 transition-colors">Grocery</Link></li>
               <li><Link to="/products?category=Drinks" className="hover:text-green-400 transition-colors">Drinks</Link></li>
               <li><Link to="/products?category=Snacks" className="hover:text-green-400 transition-colors">Snacks</Link></li>
               <li><Link to="/products?category=Fruits" className="hover:text-green-400 transition-colors">Fruits</Link></li>
             </ul>
          </div>
          <div>
             <h3 className="text-white font-semibold mb-4">Quick Links</h3>
             <ul className="space-y-2 text-sm">
               <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
               <li><Link to="/products" className="hover:text-green-400 transition-colors">All Products</Link></li>
               <li><Link to="/cart" className="hover:text-green-400 transition-colors">Cart</Link></li>
               <li><Link to="/dashboard" className="hover:text-green-400 transition-colors">My Account</Link></li>
             </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@hbstore.demo</li>
              <li>Phone: +1 234 567 8900</li>
              <li>Address: Demo Street, Web City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 H&B Store. All rights reserved.</p>
          <div className="flex flex-col items-end gap-1 mt-2 md:mt-0">
             <p className="flex items-center gap-1">
               Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by{" "}
               <span 
                 onClick={handleAdminClick}
                 className="text-gray-400 hover:text-green-500 transition-colors cursor-default select-none font-medium ml-1"
                 title="HB Store Developer"
               >
                 Sunil
               </span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
