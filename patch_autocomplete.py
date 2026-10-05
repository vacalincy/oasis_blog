with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add autoComplete="new-password" to login password
content = content.replace(
    'id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8"',
    'id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8" autoComplete="new-password"'
)
# Add autoComplete="off" to login email
content = content.replace(
    'id="modal-login-email" name="email" placeholder="name@example.com" required',
    'id="modal-login-email" name="email" placeholder="name@example.com" required autoComplete="off"'
)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
