import re

with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# Replace the flex div to include width: '100%'
old_div = "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>"
new_div = "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>"
content = content.replace(old_div, new_div)

with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)
print("Flex width fixed!")
