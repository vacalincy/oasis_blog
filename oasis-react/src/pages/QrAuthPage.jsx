import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../assets/css/qr-auth.css';

export default function QrAuthPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const addToast = useToast();

  const [_sessionRecord, setSessionRecord] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvedStatus, setResolvedStatus] = useState(''); // 'approved' | 'declined' | 'expired'

  // Guest login state if user opens QR link without being logged in on this browser
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [guestLoginLoading, setGuestLoginLoading] = useState(false);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Fetch session details from Supabase
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setErrorMsg('No QR session identifier was provided. Please scan the QR code displayed on your computer.');
      setPageLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('qr_logins')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching QR session:', error);
        setErrorMsg('Unable to verify this QR session. Please ensure your computer is displaying an active QR code.');
        setPageLoading(false);
        return;
      }

      if (!data) {
        setErrorMsg('QR session not found or already completed. Please refresh the QR code on your computer screen.');
        setPageLoading(false);
        return;
      }

      const isExpired = new Date(data.expires_at) < new Date();
      if (isExpired || data.status === 'expired') {
        setResolvedStatus('expired');
      } else if (data.status === 'approved') {
        setResolvedStatus('approved');
      } else if (data.status === 'declined') {
        setResolvedStatus('declined');
      }

      setSessionRecord(data);
    } catch (err) {
      console.error('Unexpected error fetching QR session:', err);
      setErrorMsg('Failed to connect to authentication service.');
    } finally {
      setPageLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Handle Approve Login
  const handleApprove = async () => {
    if (!sessionId || !user) return;
    if (sessionRecord?.expires_at && new Date(sessionRecord.expires_at) < new Date()) {
      setResolvedStatus('expired');
      addToast('This QR code has expired. Please refresh the code on your desktop screen.', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Get current valid tokens from Supabase auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        addToast('Your session has expired. Please log in again to approve.', 'error');
        setIsSubmitting(false);
        return;
      }

      // 2. Update qr_logins record with auth tokens
      const { error: updateError } = await supabase
        .from('qr_logins')
        .update({
          status: 'approved',
          user_id: session.user.id,
          email: session.user.email,
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('Error approving QR login:', updateError);
        addToast('Failed to approve login. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      setResolvedStatus('approved');
      addToast('Login approved successfully!', 'success');
    } catch (err) {
      console.error('Approval exception:', err);
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Decline Login
  const handleDecline = async () => {
    if (!sessionId) return;
    setIsSubmitting(true);

    try {
      await supabase
        .from('qr_logins')
        .update({ status: 'declined' })
        .eq('session_id', sessionId);

      setResolvedStatus('declined');
      addToast('Login request declined.', 'info');
    } catch (err) {
      console.error('Decline exception:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Guest Login
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    if (!guestEmail || !guestPassword) return;

    setGuestLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword
      });

      if (error) {
        addToast(error.message, 'error');
      } else if (data?.session && sessionId) {
        // Automatically approve desktop session upon successful login
        const { error: approveError } = await supabase
          .from('qr_logins')
          .update({
            status: 'approved',
            user_id: data.session.user.id,
            email: data.session.user.email,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          })
          .eq('session_id', sessionId);

        if (approveError) {
          console.error('Error auto-approving QR login:', approveError);
        } else {
          setResolvedStatus('approved');
          addToast('Signed in & desktop login approved!', 'success');
        }
      }
    } catch (err) {
      console.error('Guest login error:', err);
      addToast('Failed to sign in. Please try again.', 'error');
    } finally {
      setGuestLoginLoading(false);
    }
  };

  if (pageLoading || authLoading) {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>
          <div className="auth-modal__spinner" style={{ margin: '2rem auto' }}></div>
          <h2 className="qr-auth-card__title">Verifying QR Code...</h2>
          <p className="qr-auth-card__subtitle">Connecting to OASIS authentication service</p>
        </div>
      </div>
    );
  }

  // Error State: Session not found / Invalid query
  if (errorMsg) {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>
          <Link to="/" title="OASIS Home">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
          </Link>
          <div className="qr-auth-card__top-icon qr-auth-card__top-icon--error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="qr-auth-card__title">QR Session Not Found</h2>
          <p className="qr-auth-card__subtitle">{errorMsg}</p>
          <div className="qr-auth-actions">
            <button type="button" className="qr-auth-btn qr-auth-btn--primary" onClick={handleGoBack}>
              ← Back to OASIS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Already Approved State
  if (resolvedStatus === 'approved') {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>
          <Link to="/" title="OASIS Home">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
          </Link>
          <div className="qr-auth-card__top-icon qr-auth-card__top-icon--success">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="qr-auth-card__title">Login Approved!</h2>
          <p className="qr-auth-card__subtitle">
            Your desktop device is now logged into OASIS.<br />
            You can safely close this page or return to your computer.
          </p>
          <div className="qr-auth-actions">
            <Link to="/dashboard" className="qr-auth-btn qr-auth-btn--primary" style={{ textDecoration: 'none' }}>
              Open My Dashboard
            </Link>
            <button type="button" className="qr-auth-btn qr-auth-btn--secondary" onClick={handleGoBack}>
              ← Return to OASIS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Declined State
  if (resolvedStatus === 'declined') {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>
          <Link to="/" title="OASIS Home">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
          </Link>
          <div className="qr-auth-card__top-icon qr-auth-card__top-icon--error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <h2 className="qr-auth-card__title">Login Declined</h2>
          <p className="qr-auth-card__subtitle">
            This desktop authorization request was rejected. No session was created.
          </p>
          <button type="button" className="qr-auth-btn qr-auth-btn--secondary" onClick={handleGoBack}>
            ← Return to OASIS
          </button>
        </div>
      </div>
    );
  }

  // Expired State
  if (resolvedStatus === 'expired') {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>
          <Link to="/" title="OASIS Home">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
          </Link>
          <div className="qr-auth-card__top-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h2 className="qr-auth-card__title">QR Code Expired</h2>
          <p className="qr-auth-card__subtitle">
            This QR code expired for your security. Please click &ldquo;Refresh QR&rdquo; on your computer screen to generate a new QR code.
          </p>
          <button type="button" className="qr-auth-btn qr-auth-btn--secondary" onClick={handleGoBack}>
            ← Return to OASIS
          </button>
        </div>
      </div>
    );
  }

  // User is NOT logged in in this mobile/browser window:
  // Ask them to log in to approve
  if (!user) {
    return (
      <div className="qr-auth-wrapper">
        <div className="qr-auth-card">
          <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>

          <Link to="/" title="OASIS Home">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
          </Link>

          <div className="qr-auth-card__top-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <div className="qr-auth-card__badge">
            <span className="qr-auth-card__badge-dot"></span>
            Awaiting Authentication
          </div>

          <h2 className="qr-auth-card__title">Sign In to Approve</h2>
          <p className="qr-auth-card__subtitle">
            Sign in to your OASIS account to authorize the desktop device.
          </p>

          <form className="qr-auth-guest-form" onSubmit={handleGuestLogin}>
            <div>
              <label htmlFor="guest-email">Email address</label>
              <input
                id="guest-email"
                type="email"
                placeholder="name@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="guest-password">Password</label>
              <input
                id="guest-password"
                type="password"
                placeholder="Your password"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                required
              />
            </div>

            <div className="qr-auth-actions" style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="qr-auth-btn qr-auth-btn--primary"
                disabled={guestLoginLoading}
              >
                {guestLoginLoading ? 'Signing in & Approving...' : 'Sign In & Approve'}
              </button>

              <button
                type="button"
                className="qr-auth-btn qr-auth-btn--secondary"
                onClick={handleGoBack}
              >
                ← Cancel & Return to OASIS
              </button>
            </div>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            New to OASIS? <Link to="/" style={{ color: '#2563eb', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    );
  }

  // Active Pending Confirmation View for Logged-In User
  const avatarLetter = (profile?.username || user.email || 'O')[0].toUpperCase();

  return (
    <div className="qr-auth-wrapper">
      <div className="qr-auth-card">
        <button type="button" className="qr-auth-card__close" onClick={handleGoBack} aria-label="Go back">✕</button>

        <Link to="/" title="OASIS Home">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" className="qr-auth-logo" />
        </Link>

        <div className="qr-auth-card__top-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>

        <div className="qr-auth-card__badge">
          <span className="qr-auth-card__badge-dot"></span>
          Desktop Login Request
        </div>

        <h1 className="qr-auth-card__title">Approve Desktop Login?</h1>
        <p className="qr-auth-card__subtitle">
          A computer device is requesting access to your OASIS account.
        </p>

        {/* Current User Card */}
        <div className="qr-auth-user-box">
          <div className="qr-auth-user-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="User Avatar" />
            ) : (
              avatarLetter
            )}
          </div>
          <div className="qr-auth-user-info">
            <div className="qr-auth-user-name">
              {profile?.full_name || profile?.username || 'OASIS Member'}
            </div>
            <div className="qr-auth-user-email">{user.email}</div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="qr-auth-notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>
            Only approve this request if you scanned the QR code on your own computer screen right now.
          </span>
        </div>

        {/* Actions */}
        <div className="qr-auth-actions">
          <button
            type="button"
            className="qr-auth-btn qr-auth-btn--primary"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Authorizing...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Approve Login</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="qr-auth-btn qr-auth-btn--secondary"
            onClick={handleDecline}
            disabled={isSubmitting}
          >
            Decline
          </button>

          <button
            type="button"
            className="qr-auth-btn qr-auth-btn--secondary"
            style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b' }}
            onClick={handleGoBack}
          >
            ← Back to OASIS
          </button>
        </div>
      </div>
    </div>
  );
}
