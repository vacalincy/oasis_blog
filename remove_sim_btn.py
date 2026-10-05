with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'r') as f:
    content = f.read()

sim_button = """<Link to="/reset-password" style={{ width: '100%' }}>
                <button className="btn-auth" style={{ background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-border)', marginTop: 0, width: '100%' }}>
                    Simulate clicking email link
                </button>
            </Link>"""

content = content.replace(sim_button, "")

with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'w') as f:
    f.write(content)
