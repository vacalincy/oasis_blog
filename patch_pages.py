import re

for page in ['oasis-react/src/pages/SupportPage.jsx', 'oasis-react/src/pages/ContactPage.jsx']:
    with open(page, 'r') as f:
        content = f.read()
    
    if "import Footer" not in content:
        content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport Footer from '../components/Footer';")
    
    if "<Footer />" not in content:
        content = content.replace("</main>\n        </div>", "</main>\n            <Footer />\n        </div>")
        
    with open(page, 'w') as f:
        f.write(content)
