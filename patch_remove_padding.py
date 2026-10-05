with open('oasis-react/src/assets/css/auth-modal.css', 'r') as f:
    content = f.read()

content = content.replace("padding-top: 10px !important; /* Push it down so it doesn't overlap the input */", "")

with open('oasis-react/src/assets/css/auth-modal.css', 'w') as f:
    f.write(content)
