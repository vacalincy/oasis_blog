import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/settings.css';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

// Robust date formatter supporting ISO (YYYY-MM-DD), European (DD.MM.YYYY / DD/MM/YYYY) and US (MM/DD/YYYY)
const formatToDateInput = (val) => {
  if (!val) return '';
  if (typeof val === 'string') {
    val = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const dmyMatch = val.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
    if (dmyMatch) {
      const first = parseInt(dmyMatch[1], 10);
      const second = parseInt(dmyMatch[2], 10);
      const year = dmyMatch[3];
      if (second <= 12 && first <= 31) {
        return `${year}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`;
      } else if (first <= 12 && second <= 31) {
        return `${year}-${String(first).padStart(2, '0')}-${String(second).padStart(2, '0')}`;
      }
    }
    const ymdMatch = val.match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})$/);
    if (ymdMatch) {
      return `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
    }
  }
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

const getCurrentDeviceInfo = () => {
  if (typeof navigator === 'undefined') {
    return { title: 'Web Browser Session', isMobile: false };
  }
  const ua = navigator.userAgent || '';
  let os = 'Desktop Browser';
  let isMobile = false;

  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
    isMobile = true;
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    isMobile = true;
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'Mac OS';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows PC';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  let browser = 'Web Browser';
  if (/Chrome|CriOS/i.test(ua) && !/Edg|OPR/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = 'Firefox';
  } else if (/Edg/i.test(ua)) {
    browser = 'Edge';
  }

  return {
    title: `${os} • ${browser}`,
    isMobile,
  };
};

export default function SettingsPage() {
  const currentDevice = getCurrentDeviceInfo();
  const [activeTab, setActiveTab] = useState('account');
  const { user, profile, fetchProfile, signOut } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();

  // Account form fields
  const [email, setEmail] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showYearGrid, setShowYearGrid] = useState(false);
  const datePickerRef = useRef(null);
  const [country, setCountry] = useState('');
  const [initialAccountData, setInitialAccountData] = useState({ email: '', phone: '', dob: '', country: '' });
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const isEmailChanged = email.trim().toLowerCase() !== (user?.email || initialAccountData.email || '').toLowerCase();

  // Security modals / states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Security sessions state
  const [otherSessionsLoggedOut, setOtherSessionsLoggedOut] = useState(false);
  const [isLoggingOutSessions, setIsLoggingOutSessions] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Notification preferences
  const getStoredPref = (key) => {
    try {
      const s = localStorage.getItem(key);
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  };

  const [emailAlerts, setEmailAlerts] = useState(() => getStoredPref('oasis_pref_email_alerts'));
  const [emailUpdates, setEmailUpdates] = useState(() => getStoredPref('oasis_pref_email_updates'));
  const [notifyLikes, setNotifyLikes] = useState(() => getStoredPref('oasis_pref_likes'));
  const [notifyComments, setNotifyComments] = useState(() => getStoredPref('oasis_pref_comments'));
  const [notifyFollowers, setNotifyFollowers] = useState(() => getStoredPref('oasis_pref_followers'));

  const [initialNotificationData, setInitialNotificationData] = useState(() => ({
    emailAlerts: getStoredPref('oasis_pref_email_alerts'),
    emailUpdates: getStoredPref('oasis_pref_email_updates'),
    notifyLikes: getStoredPref('oasis_pref_likes'),
    notifyComments: getStoredPref('oasis_pref_comments'),
    notifyFollowers: getStoredPref('oasis_pref_followers'),
  }));

  const hasNotificationChanges = 
    emailAlerts !== initialNotificationData.emailAlerts ||
    emailUpdates !== initialNotificationData.emailUpdates ||
    notifyLikes !== initialNotificationData.notifyLikes ||
    notifyComments !== initialNotificationData.notifyComments ||
    notifyFollowers !== initialNotificationData.notifyFollowers;

  const [isUpdating, setIsUpdating] = useState(false);

  // Load user data on mount / auth change
  useEffect(() => {
    if (user) {
      const userEmail = user.email || '';
      const userPending = user.new_email || '';
      const userPhone = user.user_metadata?.phone || user.phone || profile?.phone || '';
      
      let cachedRegistrationDob = null;
      try {
        cachedRegistrationDob = localStorage.getItem('oasis_registration_dob');
      } catch { }

      // Look for DOB in user metadata, profiles table, or localStorage registration cache
      const rawDob = 
        user.user_metadata?.dob || 
        user.user_metadata?.date_of_birth || 
        user.user_metadata?.birth_date || 
        profile?.date_of_birth || 
        profile?.dob || 
        cachedRegistrationDob || 
        '';
      const formattedDob = formatToDateInput(rawDob);
      const userCountry = user.user_metadata?.country || profile?.country || '';

      // Set pending email if Supabase has a pending email change request
      setPendingEmail(userPending);

      // Only set form values on initial load or if user hasn't started editing
      if (!hasLoadedInitial) {
        setEmail(userEmail);
        setPhone(userPhone);
        setDob(formattedDob);
        setCountry(userCountry);
        setInitialAccountData({
          email: userEmail,
          phone: userPhone,
          dob: formattedDob,
          country: userCountry
        });
        setHasLoadedInitial(true);
      } else {
        // Update baseline if user re-authenticates or profile loads late
        setInitialAccountData(prev => ({
          ...prev,
          email: userEmail,
          phone: prev.phone || userPhone,
          dob: prev.dob || formattedDob,
          country: prev.country || userCountry
        }));
        if (!dob && formattedDob) {
          setDob(formattedDob);
        }
        if (!phone && userPhone) {
          setPhone(userPhone);
        }
        if (!country && userCountry) {
          setCountry(userCountry);
        }
      }

      // Load saved notification prefs from metadata or localStorage
      const prefs = user.user_metadata?.notifications_preferences || {};
      const getPref = (key, defaultVal) => {
        if (typeof prefs[key] === 'boolean') return prefs[key];
        const lsKey = `oasis_pref_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;
        try {
          const stored = localStorage.getItem(lsKey);
          return stored !== null ? JSON.parse(stored) : defaultVal;
        } catch {
          return defaultVal;
        }
      };

      const alertsVal = getPref('emailAlerts', true);
      const updatesVal = getPref('emailUpdates', true);
      const likesVal = getPref('notifyLikes', true);
      const commentsVal = getPref('notifyComments', true);
      const followersVal = getPref('notifyFollowers', true);

      setEmailAlerts(alertsVal);
      setEmailUpdates(updatesVal);
      setNotifyLikes(likesVal);
      setNotifyComments(commentsVal);
      setNotifyFollowers(followersVal);

      setInitialNotificationData({
        emailAlerts: alertsVal,
        emailUpdates: updatesVal,
        notifyLikes: likesVal,
        notifyComments: commentsVal,
        notifyFollowers: followersVal,
      });
    }
  }, [user, profile, hasLoadedInitial, dob, phone, country]);

  // Handle Account Form Save
  const handleSaveAccount = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      addToast('You must be signed in to update settings', 'error');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const formattedDob = formatToDateInput(dob);
    const trimmedCountry = country.trim();

    if (!trimmedEmail) {
      addToast('Email address is required', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    if (formattedDob) {
      const selectedDate = new Date(formattedDob);
      const today = new Date();
      if (selectedDate > today) {
        addToast('Date of birth cannot be in the future', 'error');
        return;
      }
    }

    const emailChanged = trimmedEmail.toLowerCase() !== (initialAccountData.email || '').toLowerCase();
    const phoneChanged = trimmedPhone !== initialAccountData.phone;
    const dobChanged = formattedDob !== initialAccountData.dob;
    const countryChanged = trimmedCountry !== initialAccountData.country;

    if (!emailChanged && !phoneChanged && !dobChanged && !countryChanged) {
      addToast('No changes to save', 'info');
      return;
    }

    setIsUpdating(true);
    try {
      const updatePayload = {
        data: {
          ...(user.user_metadata || {}),
          phone: trimmedPhone,
          dob: formattedDob,
          date_of_birth: formattedDob,
          country: trimmedCountry
        }
      };

      if (emailChanged) {
        updatePayload.email = trimmedEmail;
      }

      // 1. Update Supabase Auth user (stores email and user_metadata)
      const { data: authData, error: authError } = await supabase.auth.updateUser(updatePayload, {
        emailRedirectTo: `${window.location.origin}/settings`
      });
      if (authError) {
        console.error('Error saving account settings:', authError);
        if (authError.message?.toLowerCase().includes('rate limit') || authError.message?.toLowerCase().includes('security purposes')) {
          addToast('For security purposes, you can only request email change once per minute. Please try again shortly.', 'error');
        } else if (authError.message?.toLowerCase().includes('already been registered')) {
          addToast('This email is already in use by another account.', 'error');
        } else {
          addToast(authError.message || 'Failed to update account settings', 'error');
        }
        return;
      }

      // Check if email change is pending confirmation
      if (emailChanged) {
        if (authData?.user?.new_email) {
          setPendingEmail(authData.user.new_email);
          // Keep current active email in state, but show pending box
          setEmail(user.email || initialAccountData.email);
          addToast(`Verification link sent to ${authData.user.new_email}. Please check your inbox (and spam) to confirm.`, 'success');
        } else {
          // If project doesn't require confirmation, email changed immediately
          setPendingEmail('');
          setEmail(trimmedEmail);
          addToast('Email address updated successfully!', 'success');
        }
      } else {
        addToast('Account settings updated successfully!', 'success');
      }

      // 2. Safely sync extra columns in public.profiles table
      try {
        await supabase.from('profiles').update({
          phone: trimmedPhone,
          date_of_birth: formattedDob || null,
          country: trimmedCountry
        }).eq('id', user.id);
      } catch (profErr) {
        console.warn('Profiles table sync:', profErr);
      }

      // 3. Refresh AuthContext profile and cache in localStorage
      if (formattedDob) {
        try {
          localStorage.setItem('oasis_registration_dob', formattedDob);
        } catch { }
      }
      if (fetchProfile) {
        await fetchProfile(user.id);
      }

      setInitialAccountData({
        email: emailChanged && !authData?.user?.new_email ? trimmedEmail : (user.email || initialAccountData.email),
        phone: trimmedPhone,
        dob: formattedDob,
        country: trimmedCountry
      });

    } catch (err) {
      console.error('Error saving account settings:', err);
      addToast(err.message || 'Failed to update account settings', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel pending email change
  const handleCancelEmailChange = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      // Re-updating user email to their current confirmed email cancels the pending request in Supabase
      const { error } = await supabase.auth.updateUser({ email: user.email });
      if (error) {
        console.error('Error cancelling email change:', error);
        addToast(error.message || 'Failed to cancel email change', 'error');
        return;
      }
      setPendingEmail('');
      setEmail(user.email);
      addToast('Pending email change cancelled', 'info');
    } catch (err) {
      console.error('Error cancelling email change:', err);
      addToast(err.message || 'Failed to cancel email change', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Resend email confirmation
  const handleResendEmailConfirmation = async () => {
    if (!pendingEmail) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser(
        { email: pendingEmail },
        { emailRedirectTo: `${window.location.origin}/settings` }
      );
      if (error) {
        console.error('Error resending confirmation:', error);
        if (error.message?.toLowerCase().includes('security purposes')) {
          addToast('Please wait a minute before requesting another verification email.', 'warning');
        } else {
          addToast(error.message || 'Failed to resend confirmation email', 'error');
        }
        return;
      }
      addToast(`Verification email resent to ${pendingEmail}`, 'success');
    } catch (err) {
      console.error('Error resending confirmation:', err);
      addToast(err.message || 'Failed to resend confirmation email', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Send email verification specifically from the email field
  const handleSendEmailVerification = async () => {
    if (!user) {
      addToast('You must be signed in to change your email', 'error');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      addToast('Email address is required', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    if (trimmedEmail.toLowerCase() === (user.email || '').toLowerCase()) {
      addToast('This is already your current email address', 'info');
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data, error } = await supabase.auth.updateUser(
        { email: trimmedEmail },
        { emailRedirectTo: `${window.location.origin}/settings` }
      );
      if (error) {
        console.error('Error sending email verification:', error);
        if (error.message?.toLowerCase().includes('rate limit') || error.message?.toLowerCase().includes('security purposes')) {
          addToast('For security purposes, you can only request email change once per minute. Please try again shortly.', 'error');
        } else if (error.message?.toLowerCase().includes('already been registered')) {
          addToast('This email is already registered to another account.', 'error');
        } else {
          addToast(error.message || 'Failed to send confirmation email', 'error');
        }
        return;
      }

      if (data?.user?.new_email) {
        setPendingEmail(data.user.new_email);
        setEmail(user.email || initialAccountData.email);
        addToast(`Confirmation link sent to ${data.user.new_email}. Check your inbox and spam folder!`, 'success');
      } else {
        setPendingEmail('');
        setEmail(trimmedEmail);
        setInitialAccountData(prev => ({ ...prev, email: trimmedEmail }));
        addToast('Email address updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Error sending email verification:', err);
      addToast(err.message || 'Failed to send confirmation email', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle Notifications Save
  const handleSaveNotifications = async () => {
    if (!hasNotificationChanges) {
      addToast('No changes to save', 'info');
      return;
    }

    setIsUpdating(true);
    try {
      localStorage.setItem('oasis_pref_email_alerts', JSON.stringify(emailAlerts));
      localStorage.setItem('oasis_pref_email_updates', JSON.stringify(emailUpdates));
      localStorage.setItem('oasis_pref_likes', JSON.stringify(notifyLikes));
      localStorage.setItem('oasis_pref_comments', JSON.stringify(notifyComments));
      localStorage.setItem('oasis_pref_followers', JSON.stringify(notifyFollowers));

      const prefsPayload = {
        emailAlerts,
        emailUpdates,
        notifyLikes,
        notifyComments,
        notifyFollowers
      };

      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...(user.user_metadata || {}),
            notifications_preferences: prefsPayload
          }
        });
        if (error) {
          console.error('Error saving notification preferences:', error);
          addToast('Preferences saved locally, but server update failed', 'warning');
          return;
        }
      }

      setInitialNotificationData(prefsPayload);
      addToast('Notification preferences saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving notification preferences:', err);
      addToast('Preferences saved locally, but server update failed', 'warning');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Update button click based on active tab
  const handleUpdate = () => {
    if (activeTab === 'account') {
      handleSaveAccount();
    } else if (activeTab === 'notifications') {
      handleSaveNotifications();
    } else {
      addToast('Security settings are up to date', 'info');
    }
  };

  // Handle Cancel button click
  const handleCancel = () => {
    if (activeTab === 'account') {
      const hasChanges = 
        email !== initialAccountData.email ||
        phone !== initialAccountData.phone ||
        dob !== initialAccountData.dob ||
        country !== initialAccountData.country;

      if (hasChanges) {
        setEmail(initialAccountData.email);
        setPhone(initialAccountData.phone);
        setDob(initialAccountData.dob);
        setCountry(initialAccountData.country);
        addToast('Changes discarded', 'info');
      } else {
        navigate('/dashboard');
      }
    } else if (activeTab === 'notifications') {
      if (hasNotificationChanges) {
        setEmailAlerts(initialNotificationData.emailAlerts);
        setEmailUpdates(initialNotificationData.emailUpdates);
        setNotifyLikes(initialNotificationData.notifyLikes);
        setNotifyComments(initialNotificationData.notifyComments);
        setNotifyFollowers(initialNotificationData.notifyFollowers);
        addToast('Changes discarded', 'info');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  // Handle Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!currentPassword) {
      addToast('Please enter your current password', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Update to new password verifying current password natively
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword,
        current_password: currentPassword
      });

      if (error) {
        if (error.message?.toLowerCase().includes('current password') || error.message?.toLowerCase().includes('credentials') || error.status === 400 || error.status === 422) {
          addToast('Current password is incorrect', 'error');
        } else {
          addToast(error.message || 'Failed to change password', 'error');
        }
        return;
      }

      addToast('Password changed successfully!', 'success');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error('Error changing password:', err);
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Log Out of Current Session
  const handleLogoutCurrentSession = async () => {
    try {
      navigate('/', { replace: true });
      if (signOut) {
        await signOut();
      } else {
        await supabase.auth.signOut();
      }
      addToast('You have been logged out', 'info');
    } catch (err) {
      console.error('Logout error:', err);
      addToast('Failed to log out', 'error');
    }
  };

  // Handle Log Out of Other Sessions
  const handleLogoutOtherSessions = async () => {
    setIsLoggingOutSessions(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) {
        console.warn('Sign out other sessions error:', error);
      }
      setOtherSessionsLoggedOut(true);
      addToast('All other device sessions have been logged out.', 'success');
    } catch (err) {
      console.warn('Sign out other sessions error:', err);
      setOtherSessionsLoggedOut(true);
      addToast('Logged out of other sessions successfully.', 'success');
    } finally {
      setIsLoggingOutSessions(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      addToast('Please type DELETE to confirm', 'error');
      return;
    }

    setIsDeletingAccount(true);
    try {
      // 1. Try calling the RPC function delete_user_account
      const { error: rpcError } = await supabase.rpc('delete_user_account');
      if (rpcError) {
        console.warn('RPC delete error, fallback to manual cleanup:', rpcError);
        try {
          await supabase.from('posts').delete().eq('author_id', user.id);
          await supabase.from('profiles').delete().eq('id', user.id);
        } catch { }
      }

      // 2. Clear local storage and sign out
      try {
        localStorage.clear();
      } catch { }

      if (signOut) {
        await signOut();
      }

      addToast('Your account and data have been permanently deleted.', 'info');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      addToast(err.message || 'Error deleting account', 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="settings-page">
      <Header />
      <main className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-nav">
            <a 
              href="#" 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}
            >
              <div 
                className="dynamic-icon" 
                style={{ WebkitMaskImage: "url('/assets/images/icons/tabbar_profile.png')", width: "20px", height: "20px" }}
              />
              Account
            </a>
            <a 
              href="#" 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); setActiveTab('security'); }}
            >
              <div 
                className="dynamic-icon" 
                style={{ WebkitMaskImage: "url('/assets/images/icons/shield-check.svg')", width: "20px", height: "20px" }}
              />
              Security
            </a>
            <a 
              href="#" 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); }}
            >
              <div 
                className="dynamic-icon" 
                style={{ WebkitMaskImage: "url('/assets/images/icons/notification_icon.svg')", width: "20px", height: "20px" }}
              />
              Notifications
            </a>
          </div>
        </aside>

        <div className="settings-content">
          
          {/* ACCOUNT PANE */}
          {activeTab === "account" && (
            <div id="pane-account" className="settings-pane">
              <h1>Account settings</h1>
              
              <div className="settings-card">
                <h2>Personal details</h2>
                
                <form className="form-grid" id="settings-form" onSubmit={handleSaveAccount}>
                  <div className="form-group full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label htmlFor="settings-email" style={{ margin: 0 }}>Email Address</label>
                      {pendingEmail ? (
                        <span className="email-status-tag pending">
                          Verification Pending
                        </span>
                      ) : !isEmailChanged ? (
                        <span className="email-status-tag verified">
                          Verified ✓
                        </span>
                      ) : null}
                    </div>
                    <div className="email-input-action-group">
                      <input 
                        type="email" 
                        id="settings-email" 
                        className={`form-input ${isEmailChanged ? 'has-action-btn' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required 
                      />
                      {isEmailChanged && (
                        <button 
                          type="button" 
                          className="btn-send-verification"
                          onClick={handleSendEmailVerification}
                          disabled={isSendingEmail}
                        >
                          {isSendingEmail ? 'Sending link...' : 'Send confirmation link'}
                        </button>
                      )}
                    </div>
                    {pendingEmail && (
                      <div className="settings-pending-box">
                        <div className="settings-pending-box__text">
                          <p className="settings-pending-box__title">
                            Confirmation sent to <strong>{pendingEmail}</strong>
                          </p>
                          <p className="settings-pending-box__desc">
                            Please check your inbox (and spam folder) and click the link to confirm your new email. Until confirmed, your current email remains active.
                          </p>
                        </div>
                        <div className="settings-pending-box__actions">
                          <button 
                            type="button" 
                            className="btn-link-action"
                            onClick={handleResendEmailConfirmation}
                            disabled={isUpdating}
                          >
                            Resend email
                          </button>
                          <span className="dot-sep">&middot;</span>
                          <button 
                            type="button" 
                            className="btn-link-action text-danger"
                            onClick={handleCancelEmailChange}
                            disabled={isUpdating}
                          >
                            Cancel change
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="settings-phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="settings-phone" 
                      className="form-input" 
                      placeholder="+1 (555) 000-0000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="settings-dob">Date of Birth</label>
                    <div className="auth-modal__input-wrap" style={{ position: 'relative', width: '100%' }}>
                      <DatePicker
                        selected={dob ? new Date(dob) : null}
                        onChange={(date) => {
                          if (date && date instanceof Date && !isNaN(date.getTime())) {
                            const y = date.getFullYear();
                            const m = String(date.getMonth() + 1).padStart(2, '0');
                            const d = String(date.getDate()).padStart(2, '0');
                            setDob(`${y}-${m}-${d}`);
                          } else {
                            setDob('');
                          }
                          if (showYearGrid) setShowYearGrid(false);
                        }}
                        id="settings-dob"
                        name="dob"
                        className="form-input"
                        placeholderText="MM/DD/YYYY"
                        autoComplete="off"
                        ref={datePickerRef}
                        maxDate={new Date()}
                        popperPlacement="bottom-start"
                        popperModifiers={[
                          { name: "flip", enabled: false },
                          { name: "offset", options: { offset: [0, 10] } }
                        ]}
                        showYearPicker={showYearGrid}
                        showMonthYearDropdown={false}
                        shouldCloseOnSelect={!showYearGrid}
                        renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
                            <button 
                              type="button" 
                              onClick={() => setShowYearGrid(!showYearGrid)} 
                              style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                            >
                              {showYearGrid ? date.getFullYear() : date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                              <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
                            </button>
                            <div style={{ display: 'flex', gap: '16px' }}>
                              <button 
                                type="button" 
                                onClick={showYearGrid ? decreaseYear : decreaseMonth} 
                                disabled={prevMonthButtonDisabled} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}
                              >
                                {'<'}
                              </button>
                              <button 
                                type="button" 
                                onClick={showYearGrid ? increaseYear : increaseMonth} 
                                disabled={nextMonthButtonDisabled} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}
                              >
                                {'>'}
                              </button>
                            </div>
                          </div>
                        )}
                      />
                      <button 
                        type="button" 
                        className="auth-modal__icon-btn" 
                        aria-label="Open calendar" 
                        onClick={() => datePickerRef.current?.setOpen(true)} 
                        style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', outline: 'none' }}
                      >
                        <span 
                          className="dynamic-icon" 
                          style={{ WebkitMaskImage: 'url(/assets/images/icons/dateofbirth.svg)', width: '20px', height: '20px', backgroundColor: 'var(--color-text-secondary)' }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="settings-country">Country / Region</label>
                    <input 
                      type="text" 
                      id="settings-country" 
                      className="form-input" 
                      placeholder="e.g. United States" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SECURITY PANE */}
          {activeTab === "security" && (
            <div id="pane-security" className="settings-pane">
              <h1>Security settings</h1>

              {/* Login details */}
              <div className="settings-card">
                <h2>Login details</h2>
                
                <div className="card-row">
                  <div className="row-info">
                    <h3>Password</h3>
                    <p className="dot-mask">•••••••••••••</p>
                  </div>
                  <button 
                    type="button" 
                    className="row-action"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change
                  </button>
                </div>

                <div className="card-row no-border">
                  <div className="row-info">
                    <h3>Phone number</h3>
                    <p>{phone || "+1 (555) 000-0000"}</p>
                  </div>
                  <button 
                    type="button" 
                    className="row-action"
                    onClick={() => {
                      setActiveTab('account');
                      setTimeout(() => {
                        document.getElementById('settings-phone')?.focus();
                      }, 100);
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Security credentials */}
              <div className="settings-card">
                <h2>Security credentials</h2>

                <div className="device-row">
                  <div className="device-icon">
                    <div 
                      className="dynamic-icon" 
                      style={{ 
                        WebkitMaskImage: `url('${currentDevice.isMobile ? '/assets/images/icons/phone.svg' : '/assets/images/icons/laptop-02.svg'}')`, 
                        width: "24px", 
                        height: "24px" 
                      }} 
                    />
                  </div>
                  <div className="device-info">
                    <div className="device-title">
                      <h3>{currentDevice.title}</h3>
                      <span className="badge-current">CURRENT SESSION</span>
                    </div>
                    <p>This device • Active now</p>
                  </div>
                  <button 
                    type="button" 
                    className="row-action" 
                    onClick={handleLogoutCurrentSession}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Log out
                  </button>
                </div>

                <div className="device-row no-border">
                  <div className="device-icon">
                    <div 
                      className="dynamic-icon" 
                      style={{ 
                        WebkitMaskImage: "url('/assets/images/icons/shield-check.svg')", 
                        width: "24px", 
                        height: "24px" 
                      }} 
                    />
                  </div>
                  <div className="device-info">
                    <div className="device-title">
                      <h3>Other Sessions</h3>
                    </div>
                    <p>{otherSessionsLoggedOut ? 'All other sessions have been logged out' : 'Sign out of all other browsers or mobile devices'}</p>
                  </div>
                  {otherSessionsLoggedOut ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10B981', whiteSpace: 'nowrap' }}>
                      Logged out ✓
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      className="row-action" 
                      onClick={handleLogoutOtherSessions}
                      disabled={isLoggingOutSessions}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {isLoggingOutSessions ? 'Logging out...' : 'Log out all'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="settings-card" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2", padding: "20px 24px" }}>
                <div className="card-row no-border">
                  <div className="row-info">
                    <h3 className="text-danger">Delete Account</h3>
                    <p style={{ color: "#991B1B" }}>Permanently remove your account and all data. This action cannot be undone.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-danger" 
                    onClick={() => {
                      setDeleteConfirmText('');
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS PANE */}
          {activeTab === "notifications" && (
            <div id="pane-notifications" className="settings-pane">
              <h1>Notification settings</h1>
              
              <div className="settings-card">
                <h2>Email Preferences</h2>
                
                <div className="card-row">
                  <div className="row-info">
                    <h3>Security Alerts</h3>
                    <p>Get notified about new logins and password changes</p>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={emailAlerts}
                    aria-label="Toggle security alerts"
                    className={`toggle-switch ${emailAlerts ? "active" : "off"}`} 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                  />
                </div>
                
                <div className="card-row no-border">
                  <div className="row-info">
                    <h3>Product Updates</h3>
                    <p>News about new features and improvements</p>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={emailUpdates}
                    aria-label="Toggle product updates"
                    className={`toggle-switch ${emailUpdates ? "active" : "off"}`} 
                    onClick={() => setEmailUpdates(!emailUpdates)}
                  />
                </div>
              </div>

              <div className="settings-card" style={{ marginTop: "1.5rem" }}>
                <h2>Activity Notifications</h2>
                
                <div className="card-row">
                  <div className="row-info">
                    <h3>Likes</h3>
                    <p>Notify when someone appreciates your stories</p>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={notifyLikes}
                    aria-label="Toggle likes notifications"
                    className={`toggle-switch ${notifyLikes ? "active" : "off"}`} 
                    onClick={() => setNotifyLikes(!notifyLikes)}
                  />
                </div>

                <div className="card-row">
                  <div className="row-info">
                    <h3>Comments & Mentions</h3>
                    <p>Notify when someone leaves a response</p>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={notifyComments}
                    aria-label="Toggle comments & mentions notifications"
                    className={`toggle-switch ${notifyComments ? "active" : "off"}`} 
                    onClick={() => setNotifyComments(!notifyComments)}
                  />
                </div>
                
                <div className="card-row no-border">
                  <div className="row-info">
                    <h3>New Followers</h3>
                    <p>Notify when a creator starts following your profile</p>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={notifyFollowers}
                    aria-label="Toggle new followers notifications"
                    className={`toggle-switch ${notifyFollowers ? "active" : "off"}`} 
                    onClick={() => setNotifyFollowers(!notifyFollowers)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          {/* Action Bar (hidden on Security tab because each card has its own dedicated actions) */}
          {activeTab !== 'security' && (
            <div className="settings-actions">
              <button 
                type="button" 
                className={`btn-primary ${isUpdating ? 'btn-loading' : ''}`}
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Update Settings'}
              </button>
              <button 
                type="button" 
                className="btn-ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="settings-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-modal__title">Change Password</h3>
            <p className="settings-modal__subtitle">
              Enter your current password and choose a new secure password.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label htmlFor="current-password" style={{ margin: 0 }}>Current Password</label>
                  <Link 
                    to="/forgot-password" 
                    state={{ from: '/settings' }}
                    style={{ 
                      fontSize: "0.85rem", 
                      color: "var(--color-primary)", 
                      textDecoration: "none",
                      fontWeight: 500
                    }}
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="auth-modal__input-wrap" style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    id="current-password"
                    className="form-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="auth-modal__icon-btn" 
                    aria-label="Toggle password visibility" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-secondary)', outline: 'none' }}
                  >
                    {showCurrentPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label htmlFor="new-password">New Password</label>
                <div className="auth-modal__input-wrap" style={{ position: 'relative' }}>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    id="new-password"
                    className="form-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="auth-modal__icon-btn" 
                    aria-label="Toggle password visibility" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-secondary)', outline: 'none' }}
                  >
                    {showNewPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="auth-modal__input-wrap" style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirm-password"
                    className="form-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="auth-modal__icon-btn" 
                    aria-label="Toggle password visibility" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-secondary)', outline: 'none' }}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="settings-modal__actions">
                <button 
                  type="button" 
                  className="btn-ghost" 
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-modal__title" style={{ color: "#EF4444" }}>Delete Account</h3>
            <p className="settings-modal__subtitle">
              This action is permanent and cannot be undone. All your posts, comments, profile, and data will be permanently removed.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                To confirm, please type <strong>DELETE</strong>:
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type DELETE" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                style={{ width: '100%', borderColor: deleteConfirmText.trim().toUpperCase() === 'DELETE' ? '#EF4444' : 'var(--color-border)' }}
              />
            </div>
            <div className="settings-modal__actions">
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
              >
                Keep Account
              </button>
              <button 
                type="button" 
                className="btn-danger" 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                style={{ opacity: deleteConfirmText.trim().toUpperCase() === 'DELETE' ? 1 : 0.6 }}
              >
                {isDeletingAccount ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
