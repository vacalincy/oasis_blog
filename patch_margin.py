with open('oasis-react/src/assets/css/auth-modal.css', 'r') as f:
    content = f.read()

# Replace .react-datepicker block to add margin-top
old_css = """.react-datepicker {
    font-family: inherit !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15) !important;
    background-color: #ffffff !important;
    padding: 15px;
}"""

new_css = """.react-datepicker {
    font-family: inherit !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15) !important;
    background-color: #ffffff !important;
    padding: 15px;
    margin-top: 48px !important; /* Force it down below the input field */
}"""

content = content.replace(old_css, new_css)

with open('oasis-react/src/assets/css/auth-modal.css', 'w') as f:
    f.write(content)
