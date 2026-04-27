import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Printer, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const { orders, myLocalOrders, updateOrderStatus, deleteOrder } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const statusColors = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-yellow-100 text-yellow-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const allAdminOrders = React.useMemo(() => {
    // Get matching orders from Firestore
    const firestoreOrders = [...(orders || [])];
    
    // Merge: prefer Firestore data, fill in with local data
    const firestoreIds = firestoreOrders.map(o => o.id);
    const localOnly = (myLocalOrders || []).filter(o => !firestoreIds.includes(o.id));
    
    return [...firestoreOrders, ...localOnly].sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || 0);
      const dateB = new Date(b.created_at || b.date || 0);
      return dateB - dateA;
    });
  }, [orders, myLocalOrders]);

  const filteredOrders = allAdminOrders.filter(o => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = String(o.id || "").toLowerCase().includes(searchLower);
    const nameMatch = (o.address?.name || '').toLowerCase().includes(searchLower);
    const phoneMatch = (o.address?.phone || '').toLowerCase().includes(searchLower);
    return idMatch || nameMatch || phoneMatch;
  });

  return (
    <div className="space-y-6 relative">
      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
           >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Tax Invoice</h2>
                 <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900 font-bold">Close</button>
              </div>
              <div id="invoice-content" className="p-8 overflow-y-auto flex-1 bg-white text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                 <div className="flex justify-between mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 mb-1">H&B STORE</h3>
                       <p className="text-xs text-gray-500 font-medium">123, Marketplace Street, Digital City, 452001</p>
                       <p className="text-xs text-gray-500 font-medium">GSTIN: 23AAAAA0000A1Z5</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                       <p className="text-sm font-bold">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-10 mb-10 border-t border-b border-gray-100 py-6">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                       <p className="font-extrabold text-gray-900">{selectedOrder.address.name}</p>
                       <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {selectedOrder.address.street}, {selectedOrder.address.city}<br/>
                          {selectedOrder.address.state} - {selectedOrder.address.pincode}
                       </p>
                       <p className="text-xs text-gray-600 mt-1 font-bold">Ph: {selectedOrder.address.phone}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Information</p>
                       <p className="text-xs text-gray-600">ID: <span className="font-bold text-gray-800">#{selectedOrder.id}</span></p>
                       <p className="text-xs text-gray-600">Payment: <span className="font-bold text-gray-800">{selectedOrder.paymentMethod}</span></p>
                       <p className="text-xs text-gray-600">Status: <span className="font-bold text-green-600 uppercase tracking-wide">{selectedOrder.status}</span></p>
                    </div>
                 </div>

                 <table className="w-full text-left mb-10">
                    <thead>
                       <tr className="border-b-2 border-gray-900">
                          <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                          <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                          <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                          <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {selectedOrder.items.map((item, i) => (
                         <tr key={i}>
                            <td className="py-4">
                               <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                               <p className="text-[10px] text-gray-400">Regular Item</p>
                            </td>
                            <td className="py-4 text-center font-bold text-sm">{item.quantity}</td>
                            <td className="py-4 text-right font-bold text-sm">₹{item.price}</td>
                            <td className="py-4 text-right font-black text-sm">₹{item.price * item.quantity}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>

                 <div className="flex flex-col items-end gap-2 border-t-2 border-gray-900 pt-6">
                    <div className="flex justify-between w-48 text-sm">
                       <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                       <span className="font-bold">₹{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between w-48 text-sm">
                       <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                       <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between w-48 pt-2 mt-2 border-t border-gray-100">
                       <span className="text-gray-900 font-black uppercase tracking-widest text-xs">Grand Total</span>
                       <span className="font-black text-xl text-gray-900">₹{selectedOrder.total}</span>
                    </div>
                 </div>

                 <div className="mt-20 text-center border-t border-dashed border-gray-200 pt-8">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Thank you for shopping at H&B Store</p>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
                 <button 
                  onClick={() => window.print()}
                  className="bg-gray-900 text-white px-10 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
                 >
                    <Printer className="h-4 w-4" /> Print PDF Invoice
                 </button>
              </div>
           </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
            <p className="text-gray-500 text-sm">Track shipments, update statuses, and print invoices.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-gray-400" />
               </div>
               <input
                 type="text"
                 placeholder="Search Order ID / Customer"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm"
               />
             </div>
             <button className="bg-gray-100 border border-gray-200 text-gray-700 p-2.5 rounded-xl hover:bg-gray-200 transition-colors">
               <Filter className="h-5 w-5" />
             </button>
         </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
           <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id} 
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
               <div className="flex flex-col md:flex-row justify-between mb-5 pb-5 border-b border-gray-50">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">Order #{String(order.id || "").toUpperCase().slice(0, 8)}</h3>
                    <p className="text-xs text-gray-500 font-medium">{new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                     <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to completely delete this order? This cannot be undone.")) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors p-2" 
                      title="Delete Order"
                     >
                       <Trash2 className="h-4 w-4" />
                     </button>
                     <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2" 
                      title="Print Invoice"
                     >
                       <Printer className="h-5 w-5" />
                     </button>

                     <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                       <select 
                         value={order.status} 
                         onChange={(e) => handleStatusChange(order.id, e.target.value)}
                         className="px-2 py-1 bg-transparent text-sm font-semibold focus:outline-none cursor-pointer text-gray-700"
                       >
                         <option value="Pending">Pending</option>
                         <option value="Confirmed">Confirmed</option>
                         <option value="Preparing">Preparing</option>
                         <option value="Out for Delivery">Out for Delivery</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                     <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}>
                       {order.status}
                     </span>
                  </div>
               </div>
               
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Details</h4>
                   <p className="font-bold text-gray-900">{order.address.name || 'Website User'}</p>
                   <p className="text-sm text-gray-600 font-medium">{order.address.phone}</p>
                   <p className="text-sm text-gray-500 mt-2">{order.address.street}, {order.address.city} - {order.address.pincode}</p>
                   <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                     <div className="flex flex-col">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</span>
                       <span className={`text-sm font-bold ${order.paymentMethod === 'Online' ? 'text-green-600' : 'text-orange-600'}`}>
                         {order.paymentMethod === 'Online' ? 'PREPAID (ONLINE)' : 'CASH ON DELIVERY'}
                       </span>
                       {order.transactionId && (
                         <span className="text-[10px] text-gray-500 font-medium mt-0.5">UTR: {order.transactionId}</span>
                       )}
                     </div>
                     <span className="text-lg font-extrabold text-gray-900">₹{order.total}</span>
                   </div>
                 </div>
                 
                 <div className="flex-[1.5]">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                     {order.items.map(item => (
                       <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                         <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt={item.name} />
                         <div className="flex-1 min-w-0">
                           <p className="font-semibold text-gray-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</p>
                           <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity} × ₹{item.price}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
