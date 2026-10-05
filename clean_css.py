import re

with open('oasis-react/src/assets/css/auth-modal.css', 'r') as f:
    content = f.read()

# Remove all React DatePicker overrides
content = re.sub(r'/\* React DatePicker Overrides.*', '', content, flags=re.DOTALL)
content = re.sub(r'/\* Year Grid Styles \*/.*', '', content, flags=re.DOTALL)

# Add them back perfectly
new_css = """
/* ============================================= */
/* REACT DATEPICKER OVERRIDES                    */
/* ============================================= */
.react-datepicker-wrapper {
    width: 100%;
}
.react-datepicker-popper {
    z-index: 1000 !important;
    padding-top: 10px !important; /* Push it down so it doesn't overlap the input */
}
.react-datepicker {
    font-family: inherit !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15) !important;
    background-color: #ffffff !important;
    padding: 15px;
}
.react-datepicker__triangle {
    display: none !important; /* Hide the little arrow pointing to the input */
}
.react-datepicker__header {
    background-color: transparent !important;
    border-bottom: none !important;
    padding-top: 5px !important;
}
.react-datepicker__day-name {
    color: var(--color-text-light) !important;
    font-weight: 500 !important;
    font-size: 0.9rem !important;
    width: 2.5rem !important;
    line-height: 2.5rem !important;
    margin: 0.2rem !important;
}
.react-datepicker__day {
    font-weight: 600 !important;
    color: var(--color-primary-dark) !important;
    width: 2.5rem !important;
    line-height: 2.5rem !important;
    margin: 0.2rem !important;
    border-radius: 50% !important;
}
.react-datepicker__day:hover {
    background-color: rgba(44, 90, 243, 0.05) !important;
}
.react-datepicker__day.react-datepicker__day--selected,
.react-datepicker__day.react-datepicker__day--keyboard-selected {
    background-color: var(--color-primary) !important;
    color: #ffffff !important;
}
.react-datepicker__day--outside-month {
    color: #cbd5e1 !important;
}

/* Year Grid Styles */
.react-datepicker__year-wrapper {
    display: flex !important;
    flex-wrap: wrap !important;
    max-width: 250px !important;
    justify-content: center !important;
}
.react-datepicker__year-text {
    color: var(--color-primary-dark) !important;
    font-weight: 600 !important;
    padding: 8px 12px !important;
    border-radius: 20px !important;
    margin: 4px !important;
    width: 60px !important;
}
.react-datepicker__year-text:hover {
    background-color: rgba(44, 90, 243, 0.05) !important;
}
.react-datepicker__year-text.react-datepicker__year-text--selected,
.react-datepicker__year-text.react-datepicker__year-text--keyboard-selected {
    background-color: var(--color-primary) !important;
    color: #ffffff !important;
}
"""

with open('oasis-react/src/assets/css/auth-modal.css', 'w') as f:
    f.write(content.strip() + "\n" + new_css)
