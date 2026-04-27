import React, { useState, useMemo } from 'react';
import { UserCircle, Shield, KeySquare, Search, MoreVertical, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';

const Users = () => {
  const { users, orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const getUserOrdersCount = (phone) => {
    return orders.filter(o => o.address?.phone === phone).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Network</h1>
            <p className="text-gray-500 text-sm font-medium">Manage and track your registered customers.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-[1.2rem] bg-white shadow-sm focus:ring-4 focus:ring-gray-900/5 outline-none font-medium transition-all"
                />
             </div>
             <button className="bg-gray-900 text-white px-6 py-3 rounded-[1.2rem] font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                Export
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600"><UserCircle className="h-7 w-7"/></div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Customers</p>
               <h3 className="text-2xl font-black text-gray-900">{users.length}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600"><ShoppingBag className="h-7 w-7"/></div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Business</p>
               <h3 className="text-2xl font-black text-gray-900">{orders.length} Orders</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-purple-50 text-purple-600"><Shield className="h-7 w-7"/></div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Live Status</p>
               <h3 className="text-2xl font-black text-gray-900">Active Now</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="p-6 font-black border-b border-gray-100">Customer Details</th>
                  <th className="p-6 font-black border-b border-gray-100">Contact</th>
                  <th className="p-6 font-black border-b border-gray-100">Orders</th>
                  <th className="p-6 font-black border-b border-gray-100">Joined Date</th>
                  <th className="p-6 font-black border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((u, i) => (
                    <motion.tr 
                      key={u.firestoreId} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-sm group"
                    >
                      <td className="p-6">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black italic">
                               {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                               <p className="font-black text-gray-900">{u.name || 'Anonymous'}</p>
                               <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md uppercase">ID: {u.id?.slice(-6).toUpperCase()}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-6">
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Mail className="h-3 w-3" /> {u.email || 'No email'}</p>
                            <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Phone className="h-3 w-3" /> {u.phone || 'No phone'}</p>
                         </div>
                      </td>
                      <td className="p-6">
                         <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-black text-[10px] uppercase tracking-wider">
                           {getUserOrdersCount(u.phone)} Purchases
                         </div>
                      </td>
                      <td className="p-6">
                         <p className="text-xs text-gray-500 font-bold flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> {u.joined ? new Date(u.joined).toLocaleDateString() : 'Dec 2023'}
                         </p>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold italic bg-gray-50/30">
               No customers found matching your search.
            </div>
          )}
      </div>
    </div>
  );
};

export default Users;
