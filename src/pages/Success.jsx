import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const Success = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-10 md:p-14 text-center relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60"
        ></motion.div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-10"
          >
            <div className="mx-auto w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-200 rotate-6">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Yay! Order Placed.
            </h1>
            <p className="text-gray-500 font-medium text-lg mb-10 max-w-xs mx-auto">
              Your delicious items are being packed and will reach you in a flash!
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 mb-10 inline-block w-full"
          >
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Reference</span>
              <span className="text-2xl font-black text-gray-900 tracking-wider selection:bg-green-100">{orderId}</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link to="/dashboard" className="group flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:border-green-500 hover:text-green-600 transition-all active:scale-95">
              <Package className="h-5 w-5 group-hover:scale-110 transition-transform" /> Track Order
            </Link>
            <Link to="/" className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95">
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" /> Keep Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Success;
