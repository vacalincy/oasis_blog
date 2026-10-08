import fs from 'fs';
import https from 'https';

const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const options = {
  hostname: VITE_SUPABASE_URL.replace('https://', ''),
  path: '/rest/v1/profiles?limit=1',
  method: 'GET',
  headers: {
    'apikey': VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});
req.end();
