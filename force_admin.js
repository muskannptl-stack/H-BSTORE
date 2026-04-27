import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uueguosaruhxmywpgbpt.supabase.co';
const supabaseServiceKey = 'sb_secret_QFxapU2dtObDaa5G8SMO_g_PCOTJebc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceAdmin() {
  const email = 'muskannptl@gmail.com';
  console.log(`Searching for user with email: ${email}...`);

  // Get user ID from Auth
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error listing users:', authError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User with email ${email} not found in Auth. Please sign up first!`);
    return;
  }

  console.log(`User found! ID: ${user.id}. Inserting/Updating profile...`);

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email: user.email, role: 'admin' });

  if (profileError) {
    console.error('Error creating profile:', profileError);
  } else {
    console.log('SUCCESS! You are now an Admin.');
  }
}

forceAdmin();
