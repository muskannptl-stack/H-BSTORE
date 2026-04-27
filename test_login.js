import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uueguosaruhxmywpgbpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWd1b3NhcnVoeG15d3BnYnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDUzMTQsImV4cCI6MjA5MjY4MTMxNH0.suDTEUOpPOIqc-PJohWhAW6hpM-Gnle5Te5NVJ8i-xI'
);

console.log('Testing Supabase login...');

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'muskannptl@gmail.com',
  password: '@mrsunil4U'
});

if (error) {
  console.log('LOGIN FAILED:', error.message, '| Status:', error.status);
} else {
  console.log('LOGIN SUCCESS! User:', data.user?.email);
  console.log('Email confirmed:', data.user?.email_confirmed_at ? 'YES' : 'NO - email not confirmed!');
  
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', data.user.id).single();
  console.log('Profile role:', profile?.role || 'NO PROFILE FOUND');
}

process.exit(0);
