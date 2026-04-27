import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, LogOut, Package, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { orders, myLocalOrders, updateOrderStatus } = useData();

  const myOrders = React.useMemo(() => {
    // Get order IDs from local storage (guest/local history)
    const localIds = myLocalOrders.map(o => o.id);
    
    // Get matching orders from Supabase
    const dbOrders = orders.filter(order => 
      localIds.includes(order.id) || 
      (user?.email && order.email === user.email) ||
      (user?.id && order.user_id === user.id)
    );
    
    // Merge: prefer DB data, fill in with local data for any missing
    const dbIds = dbOrders.map(o => o.id);
    const localOnly = myLocalOrders.filter(o => !dbIds.includes(o.id));
    
    return [...dbOrders, ...localOnly].sort((a, b) => 
      new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
    );
  }, [orders, myLocalOrders, user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-50">
              <User className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email || 'Demo Account'}</p>
            
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold shadow-sm"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Previous Orders */}
        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="text-green-500" />
              Order History
            </h2>
            
            {myOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                <Link to="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((order, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.created_at || order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="font-bold text-gray-900 border bg-gray-50 px-2 py-0.5 rounded text-xs select-all">Order ID: {order.id}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-lg font-bold text-green-600">₹{order.total}</div>
                         <div className="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded inline-block mt-1">{order.status}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
                        <ul className="space-y-2">
                          {order.items.map(item => (
                            <li key={item.id} className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-gray-50 rounded border p-1" />
                              <div className="text-sm border-b pb-1 flex-1">
                                <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                                <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-sm mt-4 sm:mt-0">
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-semibold">{order.address.name}</div>
                            <div className="text-gray-600">{order.address.street}, {order.address.city} - {order.address.pincode}</div>
                            <div className="text-gray-500 text-xs mt-1">Phone: {order.address.phone}</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                           <span className="font-semibold">Payment: </span>
                           <span className="text-gray-600">{order.payment_method || order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Live Tracking & Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      {order.status === 'Cancelled' ? (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
                          <XCircle className="h-5 w-5" />
                          <span className="font-semibold">This order was cancelled.</span>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Tracking</h4>
                          <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                            
                            {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx, arr) => {
                              const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
                              const currentIndex = steps.indexOf(order.status);
                              const isCompleted = currentIndex >= idx;
                              const isCurrent = currentIndex === idx;
                              
                              return (
                                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase hidden sm:block ${isCurrent ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {(order.status === 'Pending' || order.status === 'Confirmed') && (
                            <div className="mt-6 text-right">
                              <button 
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to cancel this order?")) {
                                    updateOrderStatus(order.id, 'Cancelled');
                                  }
                                }}
                                className="text-red-500 hover:text-red-600 text-sm font-bold bg-white border border-red-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
