with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="btn-save-action"', 'className="btn-glass"')
content = content.replace('className="btn-cancel-action"', 'className="btn-glass"')

with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)

print("Glass buttons fixed!")
