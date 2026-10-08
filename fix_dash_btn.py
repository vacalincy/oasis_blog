import re

with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# The button style string currently lacks width: 'auto'
old_style = "style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '100px', zIndex: 2, border: 'none', height: 'auto', minHeight: '32px' }}"
new_style = "style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '100px', zIndex: 2, border: 'none', height: 'auto', minHeight: '32px', width: 'auto' }}"

content = content.replace(old_style, new_style)

with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)

print("Dashboard button fixed!")
