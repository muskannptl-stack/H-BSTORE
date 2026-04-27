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

  const [paymentMethod, setPaymentMethod] = useState('Online');
  const savedAddressStr = localStorage.getItem('savedCheckoutAddress');
  const savedAddr = savedAddressStr ? JSON.parse(savedAddressStr) : null;

  const [address, setAddress] = useState({
    name: savedAddr?.name || user?.name || '',
    phone: savedAddr?.phone || user?.phone || '',
    street: savedAddr?.street || user?.address || '',
    city: savedAddr?.city || '',
    pincode: savedAddr?.pincode || ''
  });

  const [isPlacing, setIsPlacing] = useState(false);

  // Unified checkout allows both guests and logged-in users

  if (cartItems.length === 0 && !isPlacing) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const [paymentStatus, setPaymentStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // ...
  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (isPlacing) return;
    
    setIsPlacing(true);

    try {
      if (paymentMethod === 'Online') {
         setPaymentStatus('Redirecting to Payment Gateway...');
         await new Promise(resolve => setTimeout(resolve, 1200));
         setPaymentStatus('Verifying Transaction...');
         await new Promise(resolve => setTimeout(resolve, 1500));
         setPaymentStatus('Payment Confirmed!');
         await new Promise(resolve => setTimeout(resolve, 600));
      } else {
         setPaymentStatus('Processing your order...');
         await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const orderDetails = {
        items: [...cartItems], // Clone to avoid reference issues
        total: getCartTotal() + 5,
        address,
        email: user?.email || (address.phone + "@guest.com"),
        payment_method: paymentMethod, // match snake_case in schema if needed, but schema uses payment_method
        transaction_id: paymentMethod === 'Online' ? transactionId : null,
        status: 'Pending',
        user_id: user?.id || null
      };

      // Save address for convenience
      localStorage.setItem('savedCheckoutAddress', JSON.stringify(address));

      // Attempt to save order
      let finalOrderId = '';
      try {
        const { data, error } = await addOrder(orderDetails);
        if (error) throw error;
        finalOrderId = data[0].id;
      } catch (err) {
        console.error("Order save failed:", err);
        throw new Error("Failed to save order to database.");
      }

      // Final UI update before navigation
      setPaymentStatus('Order Placed Successfully!');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Navigate to success page
      navigate('/success', { state: { orderId: finalOrderId }, replace: true });
      
      // Clear cart in background
      setTimeout(() => {
        clearCart();
      }, 200);

    } catch (error) {
      console.error("Checkout Error:", error);
      setPaymentStatus('Error placing order. Please try again.');
      setIsPlacing(false);
    }
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
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Online' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="text-green-500 focus:ring-green-500 h-4 w-4 mt-1 self-start" />
                <CreditCard className="h-5 w-5 text-gray-600 mt-0.5 self-start" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Online Payment (UPI Scan)</div>
                  <div className="text-xs text-gray-500 mb-3">Pay via PhonePe, GPay, Paytm, etc.</div>
                  
                  {paymentMethod === 'Online' && (
                    <div className="mt-3 p-4 bg-white border border-green-100 rounded-xl flex flex-col items-center text-center shadow-sm">
                       <p className="text-sm font-bold text-gray-800 mb-2">Scan & Pay ₹{getCartTotal() + 5}</p>
                       <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 inline-block">
                          <img src="/qrcode.jpg" alt="Payment QR Code" className="w-48 h-48 object-contain rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=sunilkumarmeena@ybl&pn=Sunil%20Kumar%20Meena&am=' + (getCartTotal() + 5); }} />
                       </div>
                       <p className="text-xs text-gray-500 mb-3 max-w-xs">After successful payment, please enter your 12-digit UTR or Transaction ID below to verify your order.</p>
                       <div className="w-full relative">
                         <input 
                           type="text" 
                           placeholder="Enter UTR / Transaction ID" 
                           required={paymentMethod === 'Online'} // Only required if online
                           value={transactionId}
                           onChange={(e) => setTransactionId(e.target.value)}
                           className="w-full text-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                         />
                       </div>
                    </div>
                  )}
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
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
                    {paymentStatus || 'Placing Order...'}
                  </>
                ) : (
                  paymentMethod === 'Online' ? 'Pay Securely Now' : 'Place Order via COD'
                )}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
