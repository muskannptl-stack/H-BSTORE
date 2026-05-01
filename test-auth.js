import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
let url = '', key = ''
envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim()
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim()
})

const supabase = createClient(url, key)

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'muskannptl@gmail.com',
    password: '@mrsunil4U'
  })
  if (error) console.log('Auth Error:', error.message)
  else console.log('Auth Success! User ID:', data.user.id)
}
test()
