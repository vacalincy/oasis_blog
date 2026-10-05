with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

content = content.replace('portalId="root"', '')

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
