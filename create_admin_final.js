import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uueguosaruhxmywpgbpt.supabase.co';
const supabaseServiceKey = 'sb_secret_QFxapU2dtObDaa5G8SMO_g_PCOTJebc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAndMakeAdmin() {
  const email = 'muskannptl@gmail.com';
  const password = '@mrsunil4U';
  const fullName = 'Sunil Kumar Meena';

  console.log(`Creating user: ${email}...`);

  // Create user via Admin API (bypasses email confirmation)
  const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (createError) {
    if (createError.message.includes('already registered')) {
      console.log('User already exists. Proceeding to update role...');
      // Get existing user ID
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        await updateProfile(existingUser.id, email);
      }
    } else {
      console.error('Error creating user:', createError);
    }
    return;
  }

  if (user) {
    console.log('User created successfully!');
    await updateProfile(user.id, email);
  }
}

async function updateProfile(id, email) {
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id, email, role: 'admin' });

  if (profileError) {
    console.error('Error setting admin role:', profileError);
  } else {
    console.log('SUCCESS! You are now an Admin. You can login now.');
  }
}

createAndMakeAdmin();
