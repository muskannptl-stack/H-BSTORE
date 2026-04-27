import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uueguosaruhxmywpgbpt.supabase.co';
const supabaseServiceKey = 'sb_secret_QFxapU2dtObDaa5G8SMO_g_PCOTJebc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin() {
  console.log('Fetching users...');
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('*');

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profiles found. Make sure you have signed up on the website first!');
    return;
  }

  console.log(`Found ${profiles.length} profiles. Updating all to 'admin' for setup...`);

  for (const profile of profiles) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', profile.id);

    if (updateError) {
      console.error(`Error updating profile ${profile.id}:`, updateError);
    } else {
      console.log(`Successfully made ${profile.email} an admin!`);
    }
  }
}

makeAdmin();
