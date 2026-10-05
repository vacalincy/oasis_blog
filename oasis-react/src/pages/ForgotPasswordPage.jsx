import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addToast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });
    
    setIsLoading(false);
    
    if (error) {
      addToast(error.message, 'error');
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-card">
        <Link to="/">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="auth-logo" />
        </Link>
        
        {!isSubmitted ? (
          <div id="reset-request-view">
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">Enter the email address associated with your account, and we'll send you a link to reset your password.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="auth-input" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className={`btn-auth ${isLoading ? 'btn-loading' : ''}`}>
                Send Reset Link
              </button>
            </form>
          </div>
        ) : (
          <div id="reset-success-view" className="auth-success" style={{ display: 'flex' }}>
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="auth-title">Check your inbox</h1>
            <p className="auth-subtitle">We've sent a password reset link to <strong>{email}</strong>. Please check your spam folder if you don't see it within a few minutes.</p>
            
          </div>
        )}

        <div className="auth-links">
          <Link to="/">
             {/* Using standard text and entity instead of weird CSS mask for simplicity, or we can use SVG */}
             <span style={{ marginRight: '8px' }}>←</span>
             Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
