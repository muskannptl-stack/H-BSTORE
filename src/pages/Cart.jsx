import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-green-50 p-6 rounded-full mb-6">
          <ShoppingBag className="text-green-500 h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Browse our categories and discover our best deals.</p>
        <Link to="/products" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group">
              <Link to={`/product/${item.id}`} className="shrink-0 bg-gray-50 rounded-xl p-2 w-24 h-24 flex items-center justify-center block">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </Link>
              
              <div className="flex-1">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-green-600 mb-1">{item.name}</h3>
                </Link>
                <div className="text-sm text-gray-500 mb-2">{item.category}</div>
                <div className="font-bold text-gray-900">₹{item.price}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:ml-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 sm:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  title="Remove Item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-4 mb-4">Bill Details</h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹5</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Grand Total</span>
                <span>₹{getCartTotal() + 5}</span>
              </div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                You saved ₹{Math.floor(getCartTotal() * 0.2)} on this order
              </p>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-between group active:scale-95"
            >
              <span>Checkout</span>
              <div className="flex items-center gap-2">
                <span>₹{getCartTotal() + 5}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Safe and secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
