import React, { useState } from 'react';
import { UserCircle, Shield, KeySquare, Search, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Ritesh Kumar', email: 'ritesh@example.com', role: 'Customer', orders: 12, joined: '2023-10-01', status: 'Active' },
    { id: '2', name: 'Amit Sharma', email: 'amit@demo.com', role: 'Premium', orders: 45, joined: '2023-11-15', status: 'Active' },
    { id: '3', name: 'Neha Gupta', email: 'neha@test.com', role: 'Wholesale', orders: 89, joined: '2022-05-20', status: 'Active' },
    { id: '4', name: 'Arjun Verma', email: 'arjun@fake.com', role: 'Customer', orders: 2, joined: '2024-01-10', status: 'Suspended' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-500 text-sm">Manage customers, roles, and wholesale accounts.</p>
         </div>
         <div className="flex gap-3">
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-gray-400" />
               </div>
               <input
                 type="text"
                 placeholder="Search user..."
                 className="block w-64 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
               />
             </div>
             <button className="bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-black transition-colors text-sm shadow-md">
               Export CSV
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><UserCircle className="h-6 w-6"/></div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Total Customers</p>
               <h3 className="text-2xl font-bold text-gray-900">4,291</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><KeySquare className="h-6 w-6"/></div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Wholesale Partners</p>
               <h3 className="text-2xl font-bold text-gray-900">124</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50 text-green-600"><Shield className="h-6 w-6"/></div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Active Now</p>
               <h3 className="text-2xl font-bold text-gray-900">68</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-5 font-bold rounded-tl-3xl border-b border-gray-100">Name</th>
                  <th className="p-5 font-bold border-b border-gray-100">Email</th>
                  <th className="p-5 font-bold border-b border-gray-100">Role</th>
                  <th className="p-5 font-bold border-b border-gray-100">Orders</th>
                  <th className="p-5 font-bold border-b border-gray-100">Status</th>
                  <th className="p-5 font-bold border-b border-gray-100 rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={u.id} 
                    className="border-b border-gray-50 hover:bg-gray-25 transition-colors text-sm"
                  >
                    <td className="p-5 font-semibold text-gray-900 flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">{u.name.charAt(0)}</div>
                       {u.name}
                    </td>
                    <td className="p-5 text-gray-600">{u.email}</td>
                    <td className="p-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.role === 'Wholesale' ? 'bg-purple-100 text-purple-700' : u.role === 'Premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role}
                       </span>
                    </td>
                    <td className="p-5 text-gray-600 font-medium">{u.orders}</td>
                    <td className="p-5">
                       <span className={`px-2 py-1 rounded text-xs font-semibold ${u.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                         • {u.status}
                       </span>
                    </td>
                    <td className="p-5 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <MoreVertical className="h-5 w-5" />
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

export default Users;
