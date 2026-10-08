import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add handleGoogleLogin function
google_func = """  const handleLogin = async (formElement) => {"""
google_replacement = """  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      addToast('Error logging in with Google: ' + error.message, 'error');
    }
  };

  const handleLogin = async (formElement) => {"""
content = content.replace(google_func, google_replacement)

# Attach it to the buttons
# Find all Google buttons
pattern = r'<button type="button" className="(signup-cta__google-btn|auth-modal__google) react-datepicker-ignore-onclickoutside">'
replacement = r'<button type="button" className="\1 react-datepicker-ignore-onclickoutside" onClick={handleGoogleLogin}>'
content = re.sub(pattern, replacement, content)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)

print("Google Auth attached!")
