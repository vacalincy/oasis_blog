import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('posts').insert({
    author_id: '8b94b226-2323-4319-be27-37948d76c867', // arbitrary
    title: 'test',
    content: 'test content',
    status: 'draft'
  }).select();
  console.log('Error:', error);
}
run();
