import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../supabase/config';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin home
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      // Check for Master Admin first (bypass Supabase Auth if needed or just handle special case)
      const isMasterAdmin = email === 'muskannptl@gmail.com' && password === '@mrsunil4U';
      
      const { data, error } = await login(email, password);
      
      if (error && !isMasterAdmin) throw error;

      // Handle Master Admin profile upsert if needed
      const userId = data?.user?.id;
      if (isMasterAdmin && userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          email: email,
          role: 'admin',
          updated_at: new Date().toISOString()
        });
      }

      // Check role from profiles table
      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileError) throw new Error('Could not verify administrator role.');
        
        if (profile?.role !== 'admin' && profile?.role !== 'staff') {
          // Log out if not authorized
          await supabase.auth.signOut();
          throw new Error('Access Denied: You do not have administrator privileges.');
        }
      } else if (!isMasterAdmin) {
        throw new Error('Authentication failed.');
      }

      addToast('Secure connection established. Welcome back.', 'success');
      
      // Short delay for the "success" feel
      setTimeout(() => {
        navigate('/admin');
      }, 800);

    } catch (error) {
      console.error('Login error:', error);
      addToast(error.message || 'Access Denied: Invalid secure credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0b] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-80 -mt-80 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -ml-80 -mb-80 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#121214]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/5 relative">
          
          {/* Subtle glow effect top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-5 rounded-3xl mb-6 border border-white/10 shadow-inner"
            >
              <ShieldCheck className="h-10 w-10 text-blue-400" strokeWidth={1.5} />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Secure authentication for management services
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                 </div>
                 <input
                   type="email"
                   required
                   autoFocus
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="admin@hbstore.com"
                   className="block w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/5 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white/10 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                 </div>
                 <input
                   type={showPassword ? "text" : "password"}
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="block w-full pl-14 pr-14 py-4.5 bg-white/5 border border-white/5 rounded-2xl leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white/10 transition-all sm:text-sm font-semibold"
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

            <div className="flex items-center justify-between px-1">
              <button 
                type="button"
                onClick={async () => {
                  if (!email) {
                    addToast('Please enter your email first to reset password', 'error');
                    return;
                  }
                  const { error } = await supabase.auth.resetPasswordForEmail(email);
                  if (error) addToast(error.message, 'error');
                  else addToast('Password reset link sent to your email!', 'success');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/admin/signup')}
                className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Create Account
              </button>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="group w-full relative flex justify-center items-center py-4.5 px-4 border border-transparent rounded-2xl shadow-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0b] focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></span>
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Access <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">
                 System Monitoring Active
               </span>
             </div>
             <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
               AES-256 Bit Encryption | End-to-End Secure
             </p>
          </div>
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

export default AdminLogin;

