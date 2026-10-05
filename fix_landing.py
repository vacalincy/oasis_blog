import re

with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

# Let's fix the greedy matching issue.
# We will just replace ALL `<DatePicker ... />` with the new ones.
# First, we need to extract the parts.

custom_header = """renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem' }}>
              {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(value)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              >
                {getYears().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'<'}</button>
              <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0 }}>{'>'}</button>
            </div>
          </div>
        )}"""

dp1 = f'<DatePicker selected={{dob}} onChange={{(date) => setDob(date)}} id="modal-signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={{datePickerRef1}} maxDate={{new Date()}} popperPlacement="bottom-start" {custom_header} />'
dp2 = f'<DatePicker selected={{dob}} onChange={{(date) => setDob(date)}} id="signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={{datePickerRef2}} maxDate={{new Date()}} popperPlacement="bottom-start" {custom_header} />'

# Let's completely recreate the inline form and modals to be 100% sure we restore them correctly.
