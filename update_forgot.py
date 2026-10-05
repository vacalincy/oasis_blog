with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'r') as f:
    content = f.read()

# Add supabase import
if "import { supabase }" not in content:
    content = content.replace("import { Link }", "import { Link }\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext';")

# Update logic
old_logic = """  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };"""

new_logic = """  const addToast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });
    
    setIsLoading(false);
    
    if (error) {
      addToast(error.message, 'error');
    } else {
      setIsSubmitted(true);
    }
  };"""

content = content.replace(old_logic, new_logic)

with open('oasis-react/src/pages/ForgotPasswordPage.jsx', 'w') as f:
    f.write(content)
