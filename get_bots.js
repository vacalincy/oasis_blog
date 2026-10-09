import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: 'oasis-react/.env' })
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
async function run() {
  const { data } = await supabase.from('profiles').select('avatar_url').eq('bio', 'Oasis enthusiast.').limit(5)
  console.log(data)
}
run()
