import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add ignore class to modal submit
content = content.replace(
    'className="auth-modal__submit"',
    'className="auth-modal__submit react-datepicker-ignore-onclickoutside"'
)

# Add ignore class to inline submit
content = content.replace(
    'className="signup-cta__submit-btn"',
    'className="signup-cta__submit-btn react-datepicker-ignore-onclickoutside"'
)

# Also add it to Google buttons just in case
content = content.replace(
    'className="auth-modal__google"',
    'className="auth-modal__google react-datepicker-ignore-onclickoutside"'
)
content = content.replace(
    'className="signup-cta__google-btn"',
    'className="signup-cta__google-btn react-datepicker-ignore-onclickoutside"'
)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
