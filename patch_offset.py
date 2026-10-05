with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

old_mod = 'popperModifiers={[ { name: "flip", enabled: false } ]}'
new_mod = 'popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]}'

content = content.replace(old_mod, new_mod)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
