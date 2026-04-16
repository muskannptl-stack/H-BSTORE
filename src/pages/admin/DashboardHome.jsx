import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Package, Tags, ShoppingBag, Users, IndianRupee, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const DashboardHome = () => {
  const { products, orders, categories } = useData();
  
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Dynamic Sales Data for last 7 days
  const dataSales = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { 
        name: days[d.getDay()], 
        revenue: 0,
        fullDate: d.toDateString()
      };
    });

    orders.forEach(order => {
      const orderDate = new Date(order.date).toDateString();
      const chartDay = last7Days.find(d => d.fullDate === orderDate);
      if (chartDay) {
        chartDay.revenue += (order.total || 0);
      }
    });

    return last7Days;
  }, [orders]);

  // Dynamic Category Data
  const dataCategories = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 5);
  }, [products]);
  
  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: orders.length > 0 ? '+ Live' : '0%' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', change: 'Real-time' },
    { label: 'Active Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', change: 'Synced' },
    { label: 'Categories', value: categories.length, icon: Tags, color: 'text-orange-600', bg: 'bg-orange-50', change: 'Stable' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Analytics</h1>
            <p className="text-gray-500 text-sm font-medium">Real-time performance metrics for your store.</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-xl transition-all"
          >
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') || stat.change === 'Real-time' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 relative">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">Store Revenue</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Activity</p>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 700}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
           <h2 className="text-xl font-black text-gray-900 mb-1">Product Mix</h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Top Categories</p>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCategories} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 800}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 800}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 8, 8]} barSize={24} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Recent Transactions</h2>
            <p className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full font-bold">Latest 5</p>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-bold bg-gray-50/50 italic">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="p-6 font-black border-b border-gray-100">Order ID</th>
                  <th className="p-6 font-black border-b border-gray-100">Customer</th>
                  <th className="p-6 font-black border-b border-gray-100">Date</th>
                  <th className="p-6 font-black border-b border-gray-100">Status</th>
                  <th className="p-6 font-black text-right border-b border-gray-100">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.firestoreId} className="border-b border-gray-50 hover:bg-gray-50/80 transition-all text-sm group">
                    <td className="p-6 font-black text-gray-900">#{order.firestoreId?.slice(-6).toUpperCase()}</td>
                    <td className="p-6">
                        <p className="text-sm font-bold text-gray-900">{order.address?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{order.address?.phone}</p>
                    </td>
                    <td className="p-6 text-gray-500 font-bold">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6 font-black text-gray-900 text-right text-lg">₹{order.total}</td>
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

