import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MapPin, CreditCard, Banknote } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useData();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address || '',
    city: '',
    pincode: ''
  });

  // Unified checkout allows both guests and logged-in users


  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsPlacing(true);

    const orderId = "ORD" + Math.floor(Math.random() * 1000000);

    const orderDetails = {
      id: orderId,
      items: cartItems,
      total: getCartTotal() + 5,
      date: new Date().toISOString(),
      address,
      email: user?.email || (address.phone + "@guest.com"),
      paymentMethod,
      status: 'Processing'
    };

    // Fire and forget - save to DB in background, don't wait for it
    addOrder(orderDetails).catch(err => console.warn("Background order save failed:", err));

    // Immediately proceed to success page
    clearCart();
    navigate('/success', { state: { orderId } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900">
              <MapPin className="h-5 w-5 text-green-500" />
              <h2 className="font-bold text-lg">Delivery Address</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="name" value={address.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input required type="tel" name="phone" value={address.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <textarea required name="street" value={address.street} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"></textarea>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" name="city" value={address.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
               <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input required type="text" name="pincode" value={address.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-4 text-gray-900">Payment Options</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="text-green-500 focus:ring-green-500 h-4 w-4" />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">UPI (Demo)</div>
                  <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-green-500 focus:ring-green-500 h-4 w-4" />
                <Banknote className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Cash on Delivery</div>
                  <div className="text-xs text-gray-500">Pay at your doorstep</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Summary Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-24">
             <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
             <div className="space-y-3 text-sm mb-4 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
               {cartItems.map(item => (
                 <div key={item.id} className="flex justify-between gap-2">
                   <span className="text-gray-600 line-clamp-1 flex-1">{item.name} x{item.quantity}</span>
                   <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                 </div>
               ))}
             </div>
             
             <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Item Total</span><span>₹{getCartTotal()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Platform Fee</span><span>₹5</span></div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>To Pay</span><span>₹{getCartTotal() + 5}</span>
                </div>
             </div>

             <button 
               type="submit" 
               disabled={isPlacing}
               className={`w-full text-white font-bold py-4 rounded-xl mt-6 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${isPlacing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
             >
                {isPlacing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
