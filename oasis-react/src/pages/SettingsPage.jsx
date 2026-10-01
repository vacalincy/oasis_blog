import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/settings.css';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const addToast = useToast();
  const navigate = useNavigate();

  const handleUpdate = () => {
    setIsUpdating(true);
    addToast('Settings saved successfully!', 'success');
    
    // Simulate network delay before redirecting
    setTimeout(() => {
      setIsUpdating(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="settings-page">
      <Header />
      <main className="settings-layout">
        <aside className="settings-sidebar">
            <div className="settings-nav">
                <a href="#" className={`nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}>
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/tabbar_profile.png')", width: "20px", height: "20px" }}></div>
                    Account
                </a>
                <a href="#" className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('security'); }}>
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/shield-check.svg')", width: "20px", height: "20px" }}></div>
                    Security
                </a>

                <a href="#" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); }}>
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/notification_icon.svg')", width: "20px", height: "20px" }}></div>
                    Notifications
                </a>
            </div>
        </aside>
        <div className="settings-content">
            
            {/* ACCOUNT PANE */}
            {activeTab === "account" && (<div id="pane-account" className="settings-pane">
                <h1>Account settings</h1>
                
                <div className="settings-card">
                    <h2>Personal details</h2>
                    
                    <form className="form-grid" id="settings-form">
                        <div className="form-group full-width">
                            <label htmlFor="settings-email">Email Address</label>
                            <input type="email" id="settings-email" className="form-input" value="jane@example.com" required />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="settings-phone">Phone Number</label>
                            <input type="tel" id="settings-phone" className="form-input" placeholder="+1 (555) 000-0000" pattern="[\+0-9\-\(\)\s]+" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="settings-dob">Date of Birth</label>
                            <input type="date" id="settings-dob" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="settings-country">Country / Region</label>
                            <input type="text" id="settings-country" className="form-input" placeholder="e.g. United States" />
                        </div>
                    </form>
                </div>
            </div>

            )}
            {/* SECURITY PANE */}
            {activeTab === "security" && (<div id="pane-security" className="settings-pane" >
                <h1>Security settings</h1>

                {/* Card 1 */}
                <div className="settings-card">
                    <h2>Login details</h2>
                    
                    <div className="card-row">
                        <div className="row-info">
                            <h3>Current password</h3>
                            <p className="dot-mask">•••••••••••••</p>
                        </div>
                        <button className="row-action">Change</button>
                    </div>

                    <div className="card-row no-border">
                        <div className="row-info">
                            <h3>Phone number</h3>
                            <p>+1 (555) 000-0000</p>
                        </div>
                        <button className="row-action">Update</button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="settings-card">
                    <h2>Security credentials</h2>

                    <div className="device-row">
                        <div className="device-icon">
                            <div className="dynamic-icon" style={{ WebkitMaskImage: "url('../assets/images/icons/laptop-02.svg')", width: "24px", height: "24px" }}></div>
                        </div>
                        <div className="device-info">
                            <div className="device-title">
                                <h3>Mac OS Safari 15.1</h3>
                                <span className="badge-current">CURRENT SESSION</span>
                            </div>
                            <p>New York, USA • Active now</p>
                        </div>
                    </div>

                    <div className="device-row no-border">
                        <div className="device-icon">
                            <div className="dynamic-icon" style={{ WebkitMaskImage: "url('../assets/images/icons/phone.svg')", width: "24px", height: "24px" }}></div>
                        </div>
                        <div className="device-info">
                            <div className="device-title">
                                <h3>iPhone 13 Pro</h3>
                            </div>
                            <p>New York, USA • Last active 2 hours ago</p>
                        </div>
                        <button className="row-action">Log out</button>
                    </div>
                </div>
                
                {/* Danger Zone */}
                <div className="settings-card" style={{ backgroundColor: "#FEF2F2", padding: "16px 24px" }}>
                    <div className="card-row no-border">
                        <div className="row-info">
                            <h3 className="text-danger">Delete Account</h3>
                            <p style={{ color: "#991B1B" }}>Permanently remove your account and all data. This action cannot be undone.</p>
                        </div>
                        <button className="btn-danger" onClick={() => addToast('Account scheduled for deletion.', 'error')}>Delete Account</button>
                    </div>
                </div>
            </div>

            )}
            {/* NOTIFICATIONS PANE */}
            {activeTab === "notifications" && (<div id="pane-notifications" className="settings-pane">
                <h1>Notification settings</h1>
                
                <div className="settings-card">
                    <h2>Email Preferences</h2>
                    
                    <div className="card-row">
                        <div className="row-info">
                            <h3>Security Alerts</h3>
                            <p>Get notified about new logins and password changes</p>
                        </div>
                        <div className={`toggle-switch ${emailAlerts ? "active" : ""}`} onClick={() => setEmailAlerts(!emailAlerts)}></div>
                    </div>
                    
                    <div className="card-row no-border">
                        <div className="row-info">
                            <h3>Product Updates</h3>
                            <p>News about new features and improvements</p>
                        </div>
                        <div className={`toggle-switch ${emailUpdates ? "active" : ""}`} onClick={() => setEmailUpdates(!emailUpdates)}></div>
                    </div>
                </div>
            </div>

            )}

            {/* Action Bar */}
            <div className="settings-actions">
                <button 
                  type="button" 
                  className={`btn-primary ${isUpdating ? 'btn-loading' : ''}`}
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  Update Settings
                </button>
                <Link to="/dashboard" className="btn-ghost">Cancel</Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
