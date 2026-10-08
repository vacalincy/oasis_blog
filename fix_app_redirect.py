import re

with open('oasis-react/src/App.jsx', 'r') as f:
    content = f.read()

# Let's create a ProtectedRoute component and insert it
protected_route_code = """
import { useAuth } from './context/AuthContext'

function ProfileEnforcer({ children }) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        if (loading) return;
        
        // If user is logged in but has no username/profile, they are new!
        // Redirect them to onboarding unless they are already there or on auth pages
        const isAuthPage = ['/', '/onboarding', '/terms', '/privacy'].includes(location.pathname);
        if (user && (!profile || !profile.username)) {
            if (!isAuthPage) {
                window.location.href = '/onboarding';
            }
        }
    }, [user, profile, loading, location]);
    
    return children;
}
"""

# Insert ProfileEnforcer after ScrollObserver
content = content.replace("function App() {", protected_route_code + "\nfunction App() {")

# Wrap Routes with ProfileEnforcer
content = content.replace("<Routes>", "<ProfileEnforcer>\n        <Routes>")
content = content.replace("</Routes>", "</Routes>\n        </ProfileEnforcer>")

# also need to import useAuth
if "import { useAuth }" not in content:
    # it's in the protected_route_code string, but we should make sure it's at top level if needed, or just let it be. 
    pass

with open('oasis-react/src/App.jsx', 'w') as f:
    f.write(content)
print("ProfileEnforcer added!")
