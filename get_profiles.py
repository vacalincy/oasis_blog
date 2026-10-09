import os
import json
import urllib.request

# Read .env file manually
env_vars = {}
with open('oasis-react/.env', 'r') as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env_vars[k] = v.strip("'").strip('"')

url = f"{env_vars['VITE_SUPABASE_URL']}/rest/v1/profiles?bio=neq.Oasis+enthusiast.&select=id,full_name,avatar_url"
req = urllib.request.Request(url)
req.add_header('apikey', env_vars['VITE_SUPABASE_ANON_KEY'])
req.add_header('Authorization', f"Bearer {env_vars['VITE_SUPABASE_ANON_KEY']}")

response = urllib.request.urlopen(req)
data = json.loads(response.read())
for p in data:
    print(p)
