import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
let url = '', key = ''
envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim()
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim()
})

const supabase = createClient(url, key)

async function inspectTable() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  if (error) {
    console.log('Error:', error.message, error.code)
  } else {
    console.log('Data:', data)
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]))
    } else {
      console.log('No data in table to inspect columns.')
    }
  }
}

inspectTable()
