import re

with open('oasis-react/src/assets/css/add-post.css', 'r') as f:
    css = f.read()

# Remove width: 100% from tooltip-wrapper
css = css.replace(".tooltip-wrapper {\n    position: relative;\n    display: inline-flex;\n    gap: 20px;\n    width: 100%;\n}", ".tooltip-wrapper {\n    position: relative;\n    display: inline-flex;\n    gap: 20px;\n}")

# In case it didn't match exactly, do a regex substitution
css = re.sub(r'\.tooltip-wrapper\s*\{[^}]*\}', '.tooltip-wrapper {\n    position: relative;\n    display: inline-flex;\n    gap: 16px;\n    justify-content: flex-end;\n}', css)

with open('oasis-react/src/assets/css/add-post.css', 'w') as f:
    f.write(css)

print("Tooltip fixed")
