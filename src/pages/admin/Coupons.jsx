import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Edit3, X, Percent, IndianRupee, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';

const Coupons = () => {
  const { coupons, addCoupon, deleteCoupon } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    type: 'Percentage',
    usageLimit: '',
    expiry: '',
    used: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCoupon(newCoupon);
    setShowAddModal(false);
    setNewCoupon({ code: '', discount: '', type: 'Percentage', usageLimit: '', expiry: '', used: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Coupons & Discounts</h1>
            <p className="text-gray-500 text-sm">Create and manage marketing promo codes.</p>
         </div>
         <button 
           onClick={() => setShowAddModal(true)}
           className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-md flex items-center gap-2 text-sm"
         >
           <Plus className="h-4 w-4" /> Create Coupon
         </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="p-6 font-black border-b border-gray-100">Code</th>
                  <th className="p-6 font-black border-b border-gray-100">Discount</th>
                  <th className="p-6 font-black border-b border-gray-100">Usage</th>
                  <th className="p-6 font-black border-b border-gray-100">Expiry</th>
                  <th className="p-6 font-black border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {coupons.map((c, i) => (
                    <motion.tr 
                      key={c.firestoreId} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-gray-50 hover:bg-gray-25 transition-colors text-sm"
                    >
                      <td className="p-6">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                               <Ticket className="h-4 w-4 text-indigo-600" />
                            </div>
                            <span className="font-extrabold text-gray-900 tracking-wider uppercase">{c.code}</span>
                         </div>
                      </td>
                      <td className="p-6">
                         <span className="font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg">
                            {c.type === 'Percentage' ? `${c.discount}%` : `₹${c.discount}`}
                         </span>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-2">
                           <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                             <div 
                               className="bg-gray-900 h-1.5 rounded-full" 
                               style={{ width: `${Math.min((c.used/c.usageLimit)*100, 100)}%` }}
                             ></div>
                           </div>
                           <span className="text-[10px] text-gray-500 font-bold">{c.used}/{c.usageLimit}</span>
                         </div>
                      </td>
                      <td className="p-6 text-gray-600 font-bold text-xs">{new Date(c.expiry).toLocaleDateString()}</td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => deleteCoupon(c.firestoreId)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
           >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black text-gray-900">Create Promo Code</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Coupon Code</label>
                    <input 
                      required type="text" 
                      placeholder="Ex: FESTIVE50"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-black text-indigo-600"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discount Value</label>
                        <div className="relative">
                            <input 
                              required type="number" 
                              value={newCoupon.discount}
                              onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold pr-10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {newCoupon.type === 'Percentage' ? <Percent className="h-4 w-4 text-gray-400" /> : <IndianRupee className="h-4 w-4 text-gray-400" />}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Type</label>
                        <select 
                          value={newCoupon.type}
                          onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold bg-white"
                        >
                           <option>Percentage</option>
                           <option>Fixed</option>
                        </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Usage Limit</label>
                        <input 
                          required type="number" 
                          value={newCoupon.usageLimit}
                          onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                          placeholder="100"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Expiry Date</label>
                        <input 
                          required type="date" 
                          value={newCoupon.expiry}
                          onChange={(e) => setNewCoupon({...newCoupon, expiry: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold"
                        />
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black mt-4 hover:shadow-xl transition-all active:scale-95">
                    Generate Coupon
                 </button>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Coupons;

