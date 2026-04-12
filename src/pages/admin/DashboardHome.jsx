import React from 'react';
import { useData } from '../../context/DataContext';
import { Package, Tags, ShoppingBag, Users, IndianRupee, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const dataSales = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 13 },
  { name: 'Wed', revenue: 2000, orders: 98 },
  { name: 'Thu', revenue: 2780, orders: 39 },
  { name: 'Fri', revenue: 1890, orders: 48 },
  { name: 'Sat', revenue: 2390, orders: 38 },
  { name: 'Sun', revenue: 3490, orders: 43 },
];

const dataCategories = [
  { name: 'Grocery', value: 400 },
  { name: 'Snacks', value: 300 },
  { name: 'Drinks', value: 300 },
  { name: 'Personal Care', value: 200 },
];

const DashboardHome = () => {
  const { products, orders, categories } = useData();
  
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  
  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '+12.5%' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', change: '+8.2%' },
    { label: 'Active Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', change: '+2 new' },
    { label: 'Categories', value: categories.length, icon: Tags, color: 'text-orange-600', bg: 'bg-orange-50', change: 'Stable' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview Analytics</h1>
            <p className="text-gray-500 text-sm">Monitor your store's performance metrics and ongoing sales.</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 object-cover relative">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/> Revenue Tracking</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCategories} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Live Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold rounded-tl-xl border-b border-gray-100">Order ID</th>
                  <th className="p-4 font-bold border-b border-gray-100">Customer</th>
                  <th className="p-4 font-bold border-b border-gray-100">Date</th>
                  <th className="p-4 font-bold border-b border-gray-100">Status</th>
                  <th className="p-4 font-bold rounded-tr-xl text-right border-b border-gray-100">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-25 transition-colors text-sm">
                    <td className="p-4 font-semibold text-gray-900">{order.id}</td>
                    <td className="p-4 text-gray-600 font-medium">{order.address.name || 'Website User'}</td>
                    <td className="p-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-gray-900 text-right">₹{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
