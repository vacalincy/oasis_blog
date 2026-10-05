with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Replace inline DatePicker
old_inline = 'showYearPicker={showYearGrid2}'
new_inline = 'showYearPicker={showYearGrid2} shouldCloseOnSelect={!showYearGrid2}'
content = content.replace(old_inline, new_inline)

# Replace modal DatePicker
old_modal = 'showYearPicker={showYearGrid1}'
new_modal = 'showYearPicker={showYearGrid1} shouldCloseOnSelect={!showYearGrid1}'
content = content.replace(old_modal, new_modal)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
