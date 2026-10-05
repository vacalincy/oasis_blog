with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

import re

# Remove getYears
content = re.sub(r'\s*const getYears = \(\) => \{[^}]*\};\n', '\n', content)

# Remove navigate
content = re.sub(r'\s*const navigate = useNavigate\(\);\n', '\n', content)
# Also remove useNavigate from import if it's there
content = re.sub(r'import\s+\{\s*useNavigate\s*\}\s*from\s*\'react-router-dom\';?\n', '', content)

# Remove showInlinePassword
content = re.sub(r'\s*const \[showInlinePassword, setShowInlinePassword\] = useState\(false\);\n', '\n', content)
# Replace {showInlinePassword ? "text" : "password"} with "password"
content = content.replace('{showInlinePassword ? "text" : "password"}', '"password"')

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
