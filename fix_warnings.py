import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Fix 1: Remove unused 'data' from signUp
content = content.replace("const { data, error } = await supabase.auth.signUp", "const { error } = await supabase.auth.signUp")

# Fix 2: Remove unused 'data' from signInWithPassword
content = content.replace("const { data, error } = await supabase.auth.signInWithPassword", "const { error } = await supabase.auth.signInWithPassword")

# Fix 3: Use isLoading to disable buttons
content = content.replace('className="auth-modal__submit"', 'className="auth-modal__submit" disabled={isLoading}')
content = content.replace('className="signup-cta__submit-btn"', 'className="signup-cta__submit-btn" disabled={isLoading}')

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
