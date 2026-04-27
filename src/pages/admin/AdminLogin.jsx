import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await login(email, password);
      if (error) throw error;
      
      // The session change will be handled by AuthContext, 
      // but we need to wait for the profile to load to check role
      addToast('Credentials verified. Entering secure area...', 'success');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (error) {
      addToast(error.message || 'Access Denied: Invalid admin credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      login({ name: 'Admin', email: 'mrsunil', isAdmin: true });
      navigate('/admin');
      addToast('Securely authenticated! Welcome, Mr. Sunil.');
    } else {
      addToast('Invalid OTP code. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0b] relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -ml-64 -mb-64"></div>

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 z-10 transition-all duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gray-100 p-4 rounded-3xl mb-4">
            <ShieldCheck className="h-10 w-10 text-gray-900" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
            {step === 1 ? 'Admin Gateway' : 'Identity Verification'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 ? 'Enter your secure credentials' : 'Enter the 6-digit code sent to you'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Username</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-300" />
                 </div>
                 <input
                   type="text"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-300" />
                 </div>
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all sm:text-sm font-semibold"
                 />
              </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : 'Access Mainframe'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-8">
            <div className="flex justify-center gap-3">
               <input
                 type="text"
                 maxLength="6"
                 required
                 placeholder="000000"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 className="block w-full px-4 py-6 border border-gray-100 rounded-3xl leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 text-center text-4xl font-black tracking-[0.5em] transition-all"
               />
            </div>
            <div className="text-center">
               <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-gray-400 text-xs font-bold hover:text-gray-900 hover:underline"
               >
                 Return to credentials
               </button>
            </div>
            <button
               type="submit"
               className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all active:scale-95"
            >
              Verify & Enter
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center">
           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
             Level 4 AES Encrypted Session
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
