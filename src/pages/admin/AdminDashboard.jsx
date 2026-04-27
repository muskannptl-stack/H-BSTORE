import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Package, ShoppingBag, Users, Plus, Trash2, Edit3, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { products, orders, categories, deleteProduct, updateOrderStatus } = useData();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
    { label: 'Live Orders', value: orders.filter(o => o.status === 'Pending').length, icon: ShoppingBag, color: 'orange' },
    { label: 'Customers', value: 124, icon: Users, color: 'green' }, // Simulated users count
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Master Control</h1>
            <p className="text-gray-500 font-medium">Manage your entire store from here.</p>
          </div>
          <div className="flex gap-2">
            {['products', 'orders', 'users'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-2xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl bg-${s.color}-50 text-${s.color}-600`}>
                <s.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-black text-gray-900">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder={`Search ${activeTab}...`} 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            {activeTab === 'products' && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <Plus className="w-5 h-5" /> Add Product
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'products' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.filter(p => (p?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())).map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{product.category}</td>
                      <td className="px-6 py-4 font-black text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                           {product.stock} in stock
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 className="w-5 h-5" /></button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'orders' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(orders || []).map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600 uppercase text-xs">#{String(order.id || '').slice(-6)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.address?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{order.email || 'No email'}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900">₹{order.total || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {order.status === 'Delivered' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-orange-500" />}
                           <span className={`font-bold text-xs ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-600'}`}>{order.status || 'Pending'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <select 
                           value={order.status} 
                           onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                           className="text-xs font-bold bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
                         >
                           <option value="Pending">Pending</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
