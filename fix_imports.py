with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'r') as f:
    content = f.read()
content = content.replace("import { Link }\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext'; from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext';")
with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'w') as f:
    f.write(content)

with open('oasis-react/src/pages/ResetPasswordPage.jsx', 'r') as f:
    content = f.read()
content = content.replace("import { Link, useNavigate }\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext'; from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext';")
with open('oasis-react/src/pages/ResetPasswordPage.jsx', 'w') as f:
    f.write(content)
