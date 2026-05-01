import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
let url = '', key = ''
envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim()
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim()
})

const supabase = createClient(url, key)

async function checkProfile() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'muskannptl@gmail.com',
    password: '@mrsunil4U'
  })
  
  if (authError) {
    console.log('Login failed:', authError.message)
    return
  }
  
  const userId = authData.user.id
  console.log('Logged in successfully. User ID:', userId)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.log('Profile Error:', profileError.message, profileError.code)
  } else {
    console.log('Profile found:', profile)
  }
}

checkProfile()
