with open('oasis-react/src/pages/ResetPasswordPage.jsx', 'r') as f:
    content = f.read()

if "import { supabase }" not in content:
    content = content.replace("import { Link, useNavigate }", "import { Link, useNavigate }\nimport { supabase } from '../supabaseClient';\nimport { useToast } from '../context/ToastContext';")

old_logic = """  const handleReset = (e) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      setError(true);
      return;
    }
    
    setError(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 800);
  };"""

new_logic = """  const addToast = useToast();
  
  const handleReset = async (e) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      setError(true);
      return;
    }
    
    setError(false);
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.updateUser({
      password: pass1
    });
    
    setIsLoading(false);
    
    if (error) {
      addToast(error.message, 'error');
    } else {
      setIsSuccess(true);
      addToast('Password successfully reset!', 'success');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };"""

content = content.replace(old_logic, new_logic)

with open('oasis-react/src/pages/ResetPasswordPage.jsx', 'w') as f:
    f.write(content)
