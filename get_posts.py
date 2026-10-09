import os
import json
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

env_vars = {}
with open('oasis-react/.env', 'r') as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env_vars[k] = v.strip("'").strip('"')

url = f"{env_vars['VITE_SUPABASE_URL']}/rest/v1/posts?select=id,cover_image"
req = urllib.request.Request(url)
req.add_header('apikey', env_vars['VITE_SUPABASE_ANON_KEY'])
req.add_header('Authorization', f"Bearer {env_vars['VITE_SUPABASE_ANON_KEY']}")

response = urllib.request.urlopen(req, context=ctx)
data = json.loads(response.read())
for p in data:
    print(f"ID: {p['id']}, Image: {p['cover_image']}")
