import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Phone, ArrowRight, ShieldCheck, Timer, RefreshCw, AlertCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New User Info
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef(null);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 10) {
      showToast('Enter a valid 10-digit number', 'error');
      return;
    }

    setLoading(true);
    try {
      // DEBUG/TEST BYPASS for USER
      if (phoneNumber === '7375034262' || phoneNumber === '1234567890') {
        setStep(2);
        setTimer(30);
        showToast('TEST MODE: OTP sent (123456)', 'success');
        setLoading(false);
        return;
      }

      setupRecaptcha();
      const formattedPhone = `+91${phoneNumber}`;

      const appVerifier = window.recaptchaVerifier;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      setTimer(60);
      showToast('OTP sent successfully!', 'success');
    } catch (error) {
      console.error("Firebase Auth Error:", error.code, error.message);
      if (error.code === 'auth/operation-not-allowed') {
        showToast('Error: Phone Auth is not enabled in Firebase Console!', 'error');
      } else if (error.code === 'auth/invalid-app-credential') {
        showToast('Error: Invalid API Keys or reCAPTCHA failure.', 'error');
      } else {
        showToast(`Error: ${error.code || 'Failed to send OTP'}`, 'error');
      }
      
      if (window.recaptchaVerifier) {
         window.recaptchaVerifier.clear();
         window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }

  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    if (attempts >= 3) {
      showToast('Too many wrong attempts. Please resend OTP.', 'error');
      return;
    }

    setLoading(true);
    try {
      let user;
      if ((phoneNumber === '7375034262' || phoneNumber === '1234567890') && otp === '123456') {
        // Mock user object for demo
        user = { phoneNumber: phoneNumber };
      } else {
        const result = await confirmationResult.confirm(otp);
        user = result.user;
      }
      
      // Check if user exists in Firestore

      const q = query(collection(db, "users"), where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setStep(3); // New user needs to provide name
      } else {
        const userData = querySnapshot.docs[0].data();
        login(userData);
        showToast(`Welcome back, ${userData.name}!`, 'success');
        navigate(location.state?.from || '/');
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      showToast(`Invalid OTP. Attempts left: ${3 - (attempts + 1)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const newUser = { name: fullName, phone: phoneNumber, role: 'user' };
    login(newUser); // In real app, save to Firestore here
    showToast('Account created successfully!', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center px-4">
      <div id="recaptcha-container"></div>
      
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
           
           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="phone"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                   <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                         <Phone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Login</h2>
                      <p className="text-gray-500 font-medium mt-1">Get special offers & track orders</p>
                   </div>

                   <form onSubmit={handleSendOTP} className="space-y-6">
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 border-r pr-3 border-gray-200">+91</div>
                         <input 
                           type="tel" maxLength="10" 
                           autoFocus
                           required 
                           value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                           placeholder="Enter Phone Number"
                           className="w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-black text-xl"
                         />
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                      >
                        {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Continue <ArrowRight className="h-5 w-5" /></>}
                      </button>
                   </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                   <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verify SMS</h2>
                   <p className="text-gray-500 font-medium mt-1 mb-8">Enter the 6-digit code sent to <br/><span className="text-gray-900 font-black">+91 {phoneNumber}</span></p>

                   <form onSubmit={handleVerifyOTP} className="space-y-6">
                      <input 
                        type="text" maxLength="6" required 
                        autoFocus
                        value={otp} onChange={e => setOtp(e.target.value)}
                        placeholder="· · · · · ·"
                        className="w-full text-center py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-green-500 outline-none transition-all font-black text-4xl tracking-widest"
                      />
                      
                      <button 
                        disabled={loading || otp.length < 6}
                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center"
                      >
                         {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Verify Code'}
                      </button>

                      <div className="flex flex-col items-center gap-4">
                         {timer > 0 ? (
                            <p className="text-gray-400 text-sm font-bold flex items-center gap-2">
                               <Timer className="h-4 w-4" /> Resend OTP in {timer}s
                            </p>
                         ) : (
                            <button 
                              type="button"
                              onClick={handleSendOTP}
                              className="text-blue-600 font-black text-sm hover:underline"
                            >
                               Resend via SMS
                            </button>
                         )}
                         <button type="button" onClick={() => setStep(1)} className="text-gray-400 text-sm font-bold hover:text-gray-900">Change number</button>
                      </div>
                   </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                   <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                         <User className="h-8 w-8 text-purple-600" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Almost There!</h2>
                      <p className="text-gray-500 font-medium mt-1">Please provide your details below</p>
                   </div>

                   <form onSubmit={handleCreateAccount} className="space-y-6">
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                         <input 
                           type="text" required 
                           autoFocus
                           value={fullName} onChange={e => setFullName(e.target.value)}
                           placeholder="Full Name (e.g. Sunil Kumar)"
                           className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold"
                         />
                      </div>
                      <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-gray-200 hover:bg-black transition-all">
                         Create My Account
                      </button>
                   </form>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;

