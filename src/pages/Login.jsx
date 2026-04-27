import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabase/config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, RefreshCw, User, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, loginWithOTP, verifyOTP } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        if (loginMethod === 'otp') {
          if (!otpSent) {
            const { error } = await loginWithOTP(email);
            if (error) throw error;
            setOtpSent(true);
            showToast('OTP sent to your email!', 'success');
          } else {
            const { error } = await verifyOTP(email, otpToken);
            if (error) throw error;
            
            setTimeout(() => {
              if (location.state?.from) navigate(location.state.from);
              else navigate('/'); 
            }, 500);
            showToast('Logged in successfully!', 'success');
          }
        } else {
          const { data, error } = await login(email, password);
          if (error) throw error;
          
          setTimeout(() => {
            if (location.state?.from) navigate(location.state.from);
            else navigate('/'); 
          }, 500);
          
          showToast('Logged in successfully!', 'success');
        }
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) {
           showToast(passwordError, 'error');
           setLoading(false);
           return;
        }

        const { error } = await signup(email, password, fullName);
        if (error) throw error;
        showToast('Verification email sent! Please check your inbox.', 'success');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast('Please enter your email address first', 'error');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) showToast(error.message, 'error');
    else showToast('Password reset link sent to your email!', 'success');
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await loginWithGoogle();
      if (error) throw error;
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
              <p className="text-gray-500 font-medium mt-1">
                {isLogin ? 'Login to your account' : 'Create your free account'}
              </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                   <input 
                     type="text" required 
                     value={fullName} onChange={e => setFullName(e.target.value)}
                     placeholder="Full Name"
                     className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold"
                   />
                </div>
              )}

              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="email" required 
                   value={email} onChange={e => setEmail(e.target.value)}
                   disabled={otpSent}
                   placeholder="Email Address"
                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold disabled:opacity-60"
                 />
              </div>

              {(!isLogin || loginMethod === 'password') && !otpSent && (
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                   <input 
                     type="password" required 
                     value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="Password"
                     className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold"
                   />
                </div>
              )}

              {isLogin && loginMethod === 'otp' && otpSent && (
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                   <input 
                     type="text" required 
                     value={otpToken} onChange={e => setOtpToken(e.target.value)}
                     placeholder="6-digit OTP Code"
                     maxLength={6}
                     className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold tracking-[0.5em] text-center"
                   />
                </div>
              )}

              {isLogin && !otpSent && (
                <div className="flex justify-between items-center px-1">
                  <button 
                    type="button"
                    onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-bold transition-colors"
                  >
                    {loginMethod === 'password' ? 'Login with OTP instead' : 'Login with Password instead'}
                  </button>
                  {loginMethod === 'password' && (
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 
                  <>
                    {!isLogin ? 'Sign Up' : 
                     (loginMethod === 'otp' ? (otpSent ? 'Verify OTP & Login' : 'Send OTP') : 'Login')} 
                    <ArrowRight className="h-5 w-5" />
                  </>}
              </button>
           </form>

           <div className="mt-8">
              <div className="relative">
                 <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="mt-6 w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
              >
                <Chrome className="h-5 w-5 text-red-500" /> Google Account
              </button>
           </div>

           <p className="text-center mt-8 text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => {
                   setIsLogin(!isLogin);
                   setOtpSent(false);
                   setLoginMethod('password');
                }}
                className="text-blue-600 font-black hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


