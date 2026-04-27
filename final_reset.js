import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uueguosaruhxmywpgbpt.supabase.co';
const supabaseServiceKey = 'sb_secret_QFxapU2dtObDaa5G8SMO_g_PCOTJebc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalReset() {
  const email = 'muskannptl@gmail.com';
  const password = '@mrsunil4U';

  console.log(`Final reset for: ${email}...`);

  // Get user
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);

  if (user) {
    console.log('User found. Updating password and confirming email...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true
    });

    if (updateError) {
      console.error('Update Error:', updateError);
    } else {
      console.log('User updated successfully.');
    }

    // Ensure profile exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email, role: 'admin' });

    if (profileError) {
      console.error('Profile Error:', profileError);
    } else {
      console.log('Admin profile ensured.');
    }
    
    console.log('SUCCESS! Everything is reset. Please try logging in now.');
  } else {
    console.log('User not found. Creating from scratch...');
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createError) console.error('Create Error:', createError);
    else await finalReset(); // Run again to set profile
  }
}

finalReset();
