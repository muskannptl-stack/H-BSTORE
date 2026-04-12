import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'NEWUSER50', discount: '50%', type: 'Percentage', usageLimit: 1000, used: 452, status: 'Active', expiry: '2024-12-31' },
    { id: 2, code: 'FLAT200', discount: '₹200', type: 'Fixed amount', usageLimit: 500, used: 12, status: 'Active', expiry: '2024-06-30' },
    { id: 3, code: 'FESTIVAL', discount: '15%', type: 'Percentage', usageLimit: 2000, used: 2000, status: 'Expired', expiry: '2023-11-20' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Coupons & Discounts</h1>
            <p className="text-gray-500 text-sm">Create and manage marketing promo codes.</p>
         </div>
         <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-sm shadow-md flex items-center gap-2">
           <Plus className="h-4 w-4" /> Create Coupon
         </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold rounded-tl-xl border-b border-gray-100">Code</th>
                  <th className="p-4 font-bold border-b border-gray-100">Discount</th>
                  <th className="p-4 font-bold border-b border-gray-100">Type</th>
                  <th className="p-4 font-bold border-b border-gray-100">Usage</th>
                  <th className="p-4 font-bold border-b border-gray-100">Expiry</th>
                  <th className="p-4 font-bold border-b border-gray-100">Status</th>
                  <th className="p-4 font-bold rounded-tr-xl border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={c.id} 
                    className="border-b border-gray-50 hover:bg-gray-25 transition-colors text-sm"
                  >
                    <td className="p-4 font-extrabold text-gray-900 tracking-wide text-md">
                       {c.code}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">{c.discount}</td>
                    <td className="p-4 text-gray-500">{c.type}</td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                         <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                           <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${(c.used/c.usageLimit)*100}%` }}></div>
                         </div>
                         <span className="text-xs text-gray-500 font-medium">{c.used}/{c.usageLimit}</span>
                       </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{new Date(c.expiry).toLocaleDateString()}</td>
                    <td className="p-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors"><Edit3 className="h-4 w-4" /></button>
                      <button className="hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default Coupons;
