import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

old_func = """  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = formElement.email.value;
    const password = formElement.password.value;"""

new_func = """  const handleLogin = async (formElement) => {
    setIsLoading(true);
    const email = formElement.email.value;
    const password = formElement.password.value;"""

content = content.replace(old_func, new_func)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
print("Fixed handleLogin")
