with open('oasis-react/src/assets/css/auth-modal.css', 'r') as f:
    content = f.read()

new_css = """
/* Year Grid Styles */
.react-datepicker__year-wrapper {
    display: flex !important;
    flex-wrap: wrap !important;
    max-width: 250px !important;
    justify-content: center !important;
}
.react-datepicker__year-text {
    color: var(--color-primary-dark) !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    border-radius: 20px !important;
    margin: 4px !important;
    width: 60px !important;
}
.react-datepicker__year-text:hover {
    background-color: rgba(44, 90, 243, 0.05) !important;
}
.react-datepicker__year-text--selected,
.react-datepicker__year-text--keyboard-selected {
    background-color: var(--color-primary) !important;
    color: white !important;
}
"""

with open('oasis-react/src/assets/css/auth-modal.css', 'w') as f:
    f.write(content + new_css)
