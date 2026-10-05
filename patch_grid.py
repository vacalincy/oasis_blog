with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Add states for year grids
import_str = "const [dob, setDob] = useState(null);"
new_states = """const [dob, setDob] = useState(null);
  const [showYearGrid1, setShowYearGrid1] = useState(false);
  const [showYearGrid2, setShowYearGrid2] = useState(false);"""
content = content.replace(import_str, new_states)

# We need to replace the DatePicker props and headers carefully.
# Let's extract the inline form and modal forms and rebuild them.
# The safest way is regex replace of the DatePicker tags.

import re

# Modal DatePicker replacement
modal_dp_pattern = r'<DatePicker selected=\{dob\}.*?ref=\{datePickerRef1\}.*?/>'
new_modal_dp = """<DatePicker
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
    portalId="root"
    showYearPicker={showYearGrid1}
    renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
            <button type="button" onClick={() => setShowYearGrid1(!showYearGrid1)} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showYearGrid1 ? date.getFullYear() : date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
            </button>
            <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={showYearGrid1 ? decreaseYear : decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'<'}</button>
                <button type="button" onClick={showYearGrid1 ? increaseYear : increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'>'}</button>
            </div>
        </div>
    )}
/>"""

# Inline DatePicker replacement
inline_dp_pattern = r'<DatePicker selected=\{dob\}.*?ref=\{datePickerRef2\}.*?/>'
new_inline_dp = """<DatePicker
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
    portalId="root"
    showYearPicker={showYearGrid2}
    renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
            <button type="button" onClick={() => setShowYearGrid2(!showYearGrid2)} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showYearGrid2 ? date.getFullYear() : date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
            </button>
            <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={showYearGrid2 ? decreaseYear : decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'<'}</button>
                <button type="button" onClick={showYearGrid2 ? increaseYear : increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'>'}</button>
            </div>
        </div>
    )}
/>"""

content = re.sub(modal_dp_pattern, new_modal_dp, content, flags=re.DOTALL)
content = re.sub(inline_dp_pattern, new_inline_dp, content, flags=re.DOTALL)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
