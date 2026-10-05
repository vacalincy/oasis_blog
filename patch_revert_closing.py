import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Replace Modal DatePicker
modal_old = r'<DatePicker\s+selected=\{dob\}\s+onChange=\{\(date\) => \{\s+setDob\(date\);\s+if \(showYearGrid1\) \{\s+setShowYearGrid1\(false\);\s+if \(dayPicked1 || dob\) \{\s+datePickerRef1\.current\?\.setOpen\(false\);\s+\} else \{\s+setYearPicked1\(true\);\s+\}\s+\} else \{\s+if \(yearPicked1 || dob\) \{\s+datePickerRef1\.current\?\.setOpen\(false\);\s+\} else \{\s+setDayPicked1\(true\);\s+\}\s+\}\s+\}\}\s+onCalendarOpen=\{\(\) => \{\s+if \(!dob\) \{\s+setDayPicked1\(false\);\s+setYearPicked1\(false\);\s+\}\s+\}\}\s+id="modal-signup-dob"\s+name="dob"\s+placeholderText="Date of birth \(MM/DD/YYYY\)"\s+required\s+ref=\{datePickerRef1\}\s+maxDate=\{new Date\(\)\}\s+popperPlacement="bottom-start"\s+popperModifiers=\{\[ \{ name: "flip", enabled: false \}, \{ name: "offset", options: \{ offset: \[0, 15\] \} \} \]\}\s+showYearPicker=\{showYearGrid1\}\s+shouldCloseOnSelect=\{false\}'

modal_new = """<DatePicker
    selected={dob}
    onChange={(date) => {
        setDob(date);
        if (showYearGrid1) setShowYearGrid1(false);
    }}
    id="modal-signup-dob"
    name="dob"
    placeholderText="Date of birth (MM/DD/YYYY)"
    required
    ref={datePickerRef1}
    maxDate={new Date()}
    popperPlacement="bottom-start"
    popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]}
    showYearPicker={showYearGrid1}
    shouldCloseOnSelect={!showYearGrid1}"""
content = re.sub(modal_old, modal_new, content, flags=re.DOTALL)

# Replace Inline DatePicker
inline_old = r'<DatePicker\s+selected=\{dob\}\s+onChange=\{\(date\) => \{\s+setDob\(date\);\s+if \(showYearGrid2\) \{\s+setShowYearGrid2\(false\);\s+if \(dayPicked2 || dob\) \{\s+datePickerRef2\.current\?\.setOpen\(false\);\s+\} else \{\s+setYearPicked2\(true\);\s+\}\s+\} else \{\s+if \(yearPicked2 || dob\) \{\s+datePickerRef2\.current\?\.setOpen\(false\);\s+\} else \{\s+setDayPicked2\(true\);\s+\}\s+\}\s+\}\}\s+onCalendarOpen=\{\(\) => \{\s+if \(!dob\) \{\s+setDayPicked2\(false\);\s+setYearPicked2\(false\);\s+\}\s+\}\}\s+id="signup-dob"\s+name="dob"\s+placeholderText="Date of birth \(MM/DD/YYYY\)"\s+required\s+ref=\{datePickerRef2\}\s+maxDate=\{new Date\(\)\}\s+popperPlacement="bottom-start"\s+popperModifiers=\{\[ \{ name: "flip", enabled: false \}, \{ name: "offset", options: \{ offset: \[0, 15\] \} \} \]\}\s+showYearPicker=\{showYearGrid2\}\s+shouldCloseOnSelect=\{false\}'

inline_new = """<DatePicker
    selected={dob}
    onChange={(date) => {
        setDob(date);
        if (showYearGrid2) setShowYearGrid2(false);
    }}
    id="signup-dob"
    name="dob"
    placeholderText="Date of birth (MM/DD/YYYY)"
    required
    ref={datePickerRef2}
    maxDate={new Date()}
    popperPlacement="bottom-start"
    popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]}
    showYearPicker={showYearGrid2}
    shouldCloseOnSelect={!showYearGrid2}"""
content = re.sub(inline_old, inline_new, content, flags=re.DOTALL)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
