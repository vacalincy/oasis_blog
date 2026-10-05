with open('oasis-react/src/assets/css/auth-modal.css', 'r') as f:
    content = f.read()

import re
content = re.sub(r'/\* Style the native selects to look modern \*/.*', '', content, flags=re.DOTALL)

new_css = """
.react-datepicker__header {
    background-color: transparent !important;
    border-bottom: none !important;
    padding-top: 10px !important;
}
.react-datepicker {
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
}
.react-datepicker__day-name {
    color: var(--color-text-light) !important;
    font-weight: 500 !important;
    font-size: 0.9rem !important;
}
.react-datepicker__day {
    font-weight: 500 !important;
    color: var(--color-primary-dark) !important;
    border-radius: 50% !important;
}
.react-datepicker__day:hover {
    background-color: rgba(44, 90, 243, 0.05) !important;
}
.react-datepicker__day--selected {
    background-color: var(--color-primary) !important;
    color: white !important;
}
.react-datepicker__day--outside-month {
    color: #cbd5e1 !important;
}
"""
with open('oasis-react/src/assets/css/auth-modal.css', 'w') as f:
    f.write(content + new_css)
