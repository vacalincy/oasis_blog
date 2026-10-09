import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'oasis-react/.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('posts').insert({
    author_id: '00000000-0000-0000-0000-000000000000',
    title: 'test',
    status: 'draft'
  }).select();
  console.log('Error:', error);
}
run();
