import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'oasis-react/.env' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('profiles').select('id, full_name, avatar_url').neq('bio', 'Oasis enthusiast.')
  console.log(data)
}

run()
