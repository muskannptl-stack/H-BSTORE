import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/config';
import { ShieldCheck, Mail, Lock, UserPlus, Eye, EyeOff, Loader2, ArrowRight, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Basic validation for Admin Secret Code to prevent public signups
      if (secretCode !== 'MASTER2026') {
        throw new Error('Invalid Admin Access Code. You are not authorized.');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'admin' // The database trigger will set this role
          }
        }
      });

      if (error) throw error;

      addToast('Admin account created successfully! You can now log in.', 'success');
      navigate('/admin/login');
      
    } catch (error) {
      console.error('Signup error:', error);
      addToast(error.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0b] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] -mr-80 -mt-80 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] -ml-80 -mb-80 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10 py-10"
      >
        <div className="bg-[#121214]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/5 relative">
          
          {/* Subtle glow effect top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-5 rounded-3xl mb-6 border border-white/10 shadow-inner"
            >
              <UserPlus className="h-10 w-10 text-green-400" strokeWidth={1.5} />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Admin Setup
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Create a new management account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <ShieldCheck className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                 </div>
                 <input
                   type="text"
                   required
                   autoFocus
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="John Doe"
                   className="block w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/5 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 focus:bg-white/10 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                 </div>
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="admin@hbstore.com"
                   className="block w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/5 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 focus:bg-white/10 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                 </div>
                 <input
                   type={showPassword ? "text" : "password"}
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="block w-full pl-14 pr-14 py-4.5 bg-white/5 border border-white/5 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 focus:bg-white/10 transition-all sm:text-sm font-semibold"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                 >
                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Admin Authorization Code</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <Key className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-400 transition-colors" />
                 </div>
                 <input
                   type="password"
                   required
                   value={secretCode}
                   onChange={(e) => setSecretCode(e.target.value)}
                   placeholder="Provided by Master Admin"
                   className="block w-full pl-14 pr-4 py-4.5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60 focus:bg-emerald-500/10 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>

            <div className="flex items-center justify-center px-1 pt-2">
              <button 
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Already have access? Log in
              </button>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="group w-full relative flex justify-center items-center py-4.5 px-4 border border-transparent rounded-2xl shadow-2xl text-sm font-black text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0b] focus:ring-green-500 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></span>
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

        </div>
        
        {/* Footer info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-600 text-xs font-medium"
        >
          &copy; {new Date().getFullYear()} H&B Store Management. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
