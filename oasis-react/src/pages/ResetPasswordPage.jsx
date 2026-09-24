import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      setError(true);
      return;
    }
    
    setError(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 800);
  };

  return (
    <div className="auth-body">
      <div className="auth-card">
        <Link to="/">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="auth-logo" />
        </Link>
        
        <h1 className="auth-title">Create new password</h1>
        <p className="auth-subtitle">Your new password must be at least 8 characters long and different from previously used passwords.</p>

        <form className="auth-form" onSubmit={handleReset}>
          <div>
            <label htmlFor="new-password">New password</label>
            <input 
              type="password" 
              id="new-password" 
              className="auth-input" 
              placeholder="••••••••" 
              required 
              minLength="8"
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm password</label>
            <input 
              type="password" 
              id="confirm-password" 
              className="auth-input" 
              placeholder="••••••••" 
              required 
              minLength="8"
              value={pass2}
              onChange={(e) => { setPass2(e.target.value); setError(false); }}
              style={{ borderColor: error ? '#e53e3e' : '' }}
            />
            {error && <span id="password-error" className="auth-error" style={{ display: 'block' }}>Passwords do not match.</span>}
          </div>
          
          <button 
            type="submit" 
            className={`btn-auth ${isLoading ? 'btn-loading' : ''}`}
            style={isSuccess ? { background: '#10B981' } : {}}
          >
            {isSuccess ? 'Password Reset!' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
