import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/config';
import { Mail, Lock, User, Loader2, Shield, ArrowRight } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.includes('admin');

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password) {
      setError('Email aur password required hai');
      return;
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Auth start...', isLogin ? 'LOGIN' : 'SIGNUP');

      if (isLogin) {
        // ── LOGIN ──────────────────────────────
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        console.log('✅ Login success:', data.user?.email);
        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          navigate(isAdminPage ? '/admin' : '/');
        }, 500);

      } else {
        // ── SIGNUP ─────────────────────────────
        const roleToAssign = isAdminPage ? 'admin' : 'user';
        
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, role: roleToAssign } }
        });

        if (signupError) throw signupError;

        if (data.user) {
          // Manual sync with profiles table to ensure role is stored
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: email,
              full_name: name,
              role: roleToAssign,
              updated_at: new Date()
            });
          
          if (profileError) console.warn('Profile sync failed:', profileError.message);
        }

        setSuccess('Account created! Logging you in...');

        // Supabase auto-logs in if email confirmation is disabled.
        if (!data.session) {
           const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
           if (loginError) throw loginError;
        }

        setTimeout(() => {
          navigate(isAdminPage ? '/admin' : '/');
        }, 500);
      }

    } catch (err) {
      console.error('❌ Auth error:', err.message);
      setError(err.message || 'Kuch galat hua, dobara try karo');

    } finally {
      // 🔥 MAIN FIX (infinite loading solve)
      setLoading(false);
      console.log('🏁 Loading stopped');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Admin Account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Apne account mein sign in karo' : 'Naya account banao'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold">
            ❌ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold">
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Aapka pura naam"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5" /></>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
