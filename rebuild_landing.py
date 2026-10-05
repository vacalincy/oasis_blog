with open('oasis-react/src/pages/LandingPage_old.jsx', 'r') as f:
    content = f.read()

# 1. Add States
import_str = "const [isLoading, setIsLoading] = useState(false);"
new_states = """const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showInlinePassword, setShowInlinePassword] = useState(false);
  const [dob, setDob] = useState(null);
  const datePickerRef1 = useRef(null);
  const datePickerRef2 = useRef(null);
  
  const getYears = () => { const years = []; const currentYear = new Date().getFullYear(); for (let i = 0; i < 100; i++) years.push(currentYear - i); return years; };"""
content = content.replace(import_str, new_states)

if "import DatePicker" not in content:
    content = content.replace(
        "import { Link, useNavigate } from 'react-router-dom';",
        "import { Link, useNavigate } from 'react-router-dom';\nimport DatePicker from 'react-datepicker';\nimport 'react-datepicker/dist/react-datepicker.css';"
    )

content = content.replace("import React, { useEffect, useState }", "import React, { useEffect, useState, useRef }")

# 2. Fix Passwords
content = content.replace(
'''<input type="password" id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility">''',
'''<input type={showLoginPassword ? "text" : "password"} id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility" onClick={() => setShowLoginPassword(!showLoginPassword)}>'''
)

content = content.replace(
'''<input type="password" id="modal-signup-password" name="password" placeholder="Password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility">''',
'''<input type={showSignupPassword ? "text" : "password"} id="modal-signup-password" name="password" placeholder="Password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility" onClick={() => setShowSignupPassword(!showSignupPassword)}>'''
)

content = content.replace(
'''<input type="password" id="signup-password" name="password" placeholder="Password" required minLength="8" />''',
'''<input type={showInlinePassword ? "text" : "password"} id="signup-password" name="password" placeholder="Password" required minLength="8" />'''
)

# 3. Custom DatePicker String
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

dp_modal = f"""<DatePicker selected={{dob}} onChange={{(date) => setDob(date)}} id="modal-signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={{datePickerRef1}} maxDate={{new Date()}} popperPlacement="bottom-start" {custom_header} />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar" onClick={{() => datePickerRef1.current?.setOpen(true)}}>"""

dp_inline = f"""<div className="auth-modal__input-wrap" style={{{{"width": "100%"}}}}>
                        <DatePicker selected={{dob}} onChange={{(date) => setDob(date)}} id="signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={{datePickerRef2}} maxDate={{new Date()}} popperPlacement="bottom-start" {custom_header} />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar" onClick={{() => datePickerRef2.current?.setOpen(true)}} style={{{{position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex'}}}}>
                            <span className="dynamic-icon" style={{{{ WebkitMaskImage: 'url(/assets/images/icons/dateofbirth.svg)', width: '20px', height: '20px', backgroundColor: 'var(--color-text-light)' }}}}></span>
                        </button>
                    </div>"""

# 4. Replace DOB in Modal
content = content.replace(
'''<input type="text" id="modal-signup-dob" name="dob" placeholder="Date of birth (MM/DD/YYYY)" onFocus="(this.type='date')" onBlur="(this.type='text')" required />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar">''',
dp_modal
)

# 5. Replace DOB in Inline
content = content.replace(
'''<input type="text" id="signup-dob" name="dob" placeholder="Date of birth (MM/DD/YYYY)" onFocus="(this.type='date')" onBlur="(this.type='text')" />''',
dp_inline
)

# Fix Toast/redirect from before
content = content.replace(
"""      addToast('Success! Please log in.', 'success');
      setShowSignup(false);
      setShowLogin(true);""",
"""      addToast('Welcome to OASIS!', 'success');
      setShowSignup(false);
      window.location.href = '/discover';"""
)
content = content.replace(
"""      addToast(error.message, 'error');
    } else {
      addToast('Welcome back!', 'success');
      setShowLogin(false);
      navigate('/discover');""",
"""      addToast(error.message, 'error'); alert('Supabase Error: ' + error.message);
    } else {
      addToast('Welcome back!', 'success');
      setShowLogin(false);
      window.location.href = '/discover';"""
)


with open('oasis-react/src/pages/LandingPage.jsx', 'w') as f:
    f.write(content)
