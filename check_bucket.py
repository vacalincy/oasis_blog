import os
import json
import urllib.request

env_vars = {}
with open('oasis-react/.env', 'r') as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env_vars[k] = v.strip("'").strip('"')

url = f"{env_vars['VITE_SUPABASE_URL']}/storage/v1/bucket/avatars"
req = urllib.request.Request(url)
req.add_header('apikey', env_vars['VITE_SUPABASE_ANON_KEY'])
req.add_header('Authorization', f"Bearer {env_vars['VITE_SUPABASE_ANON_KEY']}")

try:
    response = urllib.request.urlopen(req)
    print("Bucket exists:", response.read().decode())
except Exception as e:
    print("Error:", getattr(e, 'read', lambda: str(e))())
