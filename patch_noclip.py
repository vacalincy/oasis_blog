import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add popperModifiers
# Let's target the exact string: popperPlacement="bottom-start" portalId="root"
old_str = 'popperPlacement="bottom-start" portalId="root"'
new_str = 'popperPlacement="bottom-start" portalId="root" popperModifiers={[ { name: "flip", enabled: false } ]}'

content = content.replace(old_str, new_str)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
