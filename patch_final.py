with open('oasis-react/src/pages/LandingPage.jsx', 'r') as f:
    content = f.read()

import_str = "const [dob, setDob] = useState(null);"
new_states = """const [dob, setDob] = useState(null);
  const [showYearGrid1, setShowYearGrid1] = useState(false);
  const [showYearGrid2, setShowYearGrid2] = useState(false);"""
content = content.replace(import_str, new_states)

# Replace Modal DP EXACTLY
old_modal_dp = """<DatePicker selected={dob} onChange={(date) => setDob(date)} id="modal-signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef1} maxDate={new Date()} popperPlacement="bottom-start" renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
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
        )} />"""

new_modal_dp = """<DatePicker selected={dob} onChange={(date) => { setDob(date); if (showYearGrid1) setShowYearGrid1(false); }} id="modal-signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef1} maxDate={new Date()} popperPlacement="bottom-start" popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]} showYearPicker={showYearGrid1} shouldCloseOnSelect={!showYearGrid1} renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
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
        )} />"""
content = content.replace(old_modal_dp, new_modal_dp)

# Replace Inline DP EXACTLY
old_inline_dp = """<DatePicker selected={dob} onChange={(date) => setDob(date)} id="signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef2} maxDate={new Date()} popperPlacement="bottom-start" renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
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
        )} />"""

new_inline_dp = """<DatePicker selected={dob} onChange={(date) => { setDob(date); if (showYearGrid2) setShowYearGrid2(false); }} id="signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef2} maxDate={new Date()} popperPlacement="bottom-start" popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]} showYearPicker={showYearGrid2} shouldCloseOnSelect={!showYearGrid2} renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
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
        )} />"""
content = content.replace(old_inline_dp, new_inline_dp)

with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
