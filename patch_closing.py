import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add the new states
import_str = "const [showYearGrid2, setShowYearGrid2] = useState(false);"
new_states = """const [showYearGrid2, setShowYearGrid2] = useState(false);
  const [dayPicked1, setDayPicked1] = useState(false);
  const [yearPicked1, setYearPicked1] = useState(false);
  const [dayPicked2, setDayPicked2] = useState(false);
  const [yearPicked2, setYearPicked2] = useState(false);"""
content = content.replace(import_str, new_states)

# Replace Modal DatePicker
modal_old = r'<DatePicker selected=\{dob\} onChange=\{\(date\) => \{ setDob\(date\); if \(showYearGrid1\) setShowYearGrid1\(false\); \}\} id="modal-signup-dob" name="dob" placeholderText="Date of birth \(MM/DD/YYYY\)" required ref=\{datePickerRef1\} maxDate=\{new Date\(\)\} popperPlacement="bottom-start"  popperModifiers=\{\[ \{ name: "flip", enabled: false \}, \{ name: "offset", options: \{ offset: \[0, 15\] \} \} \}\} showYearPicker=\{showYearGrid1\} shouldCloseOnSelect=\{!showYearGrid1\}'

modal_new = """<DatePicker
    selected={dob}
    onChange={(date) => {
        setDob(date);
        if (showYearGrid1) {
            setShowYearGrid1(false);
            if (dayPicked1 || dob) {
                datePickerRef1.current?.setOpen(false);
            } else {
                setYearPicked1(true);
            }
        } else {
            if (yearPicked1 || dob) {
                datePickerRef1.current?.setOpen(false);
            } else {
                setDayPicked1(true);
            }
        }
    }}
    onCalendarOpen={() => {
        if (!dob) {
            setDayPicked1(false);
            setYearPicked1(false);
        }
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
    shouldCloseOnSelect={false}"""
content = re.sub(modal_old, modal_new, content, flags=re.DOTALL)

# Replace Inline DatePicker
inline_old = r'<DatePicker selected=\{dob\} onChange=\{\(date\) => \{ setDob\(date\); if \(showYearGrid2\) setShowYearGrid2\(false\); \}\} id="signup-dob" name="dob" placeholderText="Date of birth \(MM/DD/YYYY\)" required ref=\{datePickerRef2\} maxDate=\{new Date\(\)\} popperPlacement="bottom-start"  popperModifiers=\{\[ \{ name: "flip", enabled: false \}, \{ name: "offset", options: \{ offset: \[0, 15\] \} \} \}\} showYearPicker=\{showYearGrid2\} shouldCloseOnSelect=\{!showYearGrid2\}'

inline_new = """<DatePicker
    selected={dob}
    onChange={(date) => {
        setDob(date);
        if (showYearGrid2) {
            setShowYearGrid2(false);
            if (dayPicked2 || dob) {
                datePickerRef2.current?.setOpen(false);
            } else {
                setYearPicked2(true);
            }
        } else {
            if (yearPicked2 || dob) {
                datePickerRef2.current?.setOpen(false);
            } else {
                setDayPicked2(true);
            }
        }
    }}
    onCalendarOpen={() => {
        if (!dob) {
            setDayPicked2(false);
            setYearPicked2(false);
        }
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
    shouldCloseOnSelect={false}"""
content = re.sub(inline_old, inline_new, content, flags=re.DOTALL)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
