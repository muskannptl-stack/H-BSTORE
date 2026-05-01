import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/config';

const AuthContext = createContext();

const fetchProfile = async (sessionUser) => {
  // MASTER ADMIN BYPASS: Always grant admin role to master email
  if (sessionUser?.email === 'muskannptl@gmail.com') {
    return { role: 'admin', full_name: 'Master Admin' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .single();
    
    if (error) {
      console.warn("Profile fetch error:", error);
      return {};
    }
    return data || {};
  } catch (err) {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Single source for updating user state with profile
    const updateUserProfile = async (sessionUser) => {
      if (!sessionUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const profile = await fetchProfile(sessionUser);
      // Merge Auth User data with Database Profile data
      setUser({ ...sessionUser, ...profile });
      setLoading(false);
    };

    // Initialize Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserProfile(session?.user);
    });

    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`);
      if (session?.user) {
        updateUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  };

  const signup = async (email, password, fullName) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'user' } }
    });
    return result;
  };

  const loginWithOTP = async (email) => {
    const result = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't allow signup via OTP login
      }
    });
    return result;
  };

  const verifyOTP = async (email, token) => {
    const result = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return result;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
