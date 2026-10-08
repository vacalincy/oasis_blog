with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# Replace the ugly button for published posts
ugly_btn_published = """<button 
                                                className="btn-ghost" 
                                                style={{ padding: '4px 8px', fontSize: '0.8rem', zIndex: 2 }}"""
beautiful_btn = """<button 
                                                className="btn-primary" 
                                                style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '100px', zIndex: 2, border: 'none', height: 'auto', minHeight: '32px' }}"""
content = content.replace(ugly_btn_published, beautiful_btn)

with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)

print("Button style fixed!")
