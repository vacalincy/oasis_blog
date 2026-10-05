import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add onMouseDown to all Continue buttons
content = content.replace(
    'className="auth-modal__submit react-datepicker-ignore-onclickoutside" disabled={isLoading}',
    'className="auth-modal__submit react-datepicker-ignore-onclickoutside" disabled={isLoading} onMouseDown={(e) => e.preventDefault()}'
)
content = content.replace(
    'className="signup-cta__submit-btn react-datepicker-ignore-onclickoutside" disabled={isLoading}',
    'className="signup-cta__submit-btn react-datepicker-ignore-onclickoutside" disabled={isLoading} onMouseDown={(e) => e.preventDefault()}'
)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
