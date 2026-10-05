import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 2 && !username.trim()) return;
        if (step === 3 && !avatar) return;

        if (step < 3) {
            setStep(step + 1);
        } else {
            navigate('/discover');
        }
    };

    const handleSkip = () => {
        navigate('/discover');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    const titles = {
        1: "Welcome to OASIS!",
        2: "Choose your username",
        3: "Add a profile picture"
    };

    const subtitles = {
        1: "Let's personalize your profile so the community can get to know you.",
        2: "This is how you'll appear to other readers and writers on the platform.",
        3: "Upload a photo to make your profile stand out. Square images work best."
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                
                {/* Header (Always exactly the same space) */}
                <div key={`header-${step}`} className="onboarding-header-anim">
                    <h1 className="onboarding-title">{titles[step]}</h1>
                    <p className="onboarding-subtitle">{subtitles[step]}</p>
                </div>

                {/* Middle Area (Fixed 240px height to fit the dropzone perfectly and center the input) */}
                <div key={`middle-${step}`} className="onboarding-middle-area">
                    {step === 2 && (
                        <input 
                            type="text" 
                            className="onboarding-input" 
                            placeholder="@username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && username.trim()) handleNext(); }}
                        />
                    )}

                    {step === 3 && (
                        <label htmlFor="avatar-upload" className="onboarding-dropzone">
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                hidden 
                                accept="image/*"
                                onChange={handleAvatarChange} 
                            />
                            {avatarPreview ? (
                                <>
                                    <img src={avatarPreview} alt="Preview" className="onboarding-avatar-preview" />
                                    <div className="onboarding-dropzone-overlay">Click to change picture</div>
                                </>
                            ) : (
                                <>
                                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                                    </svg>
                                    <p>Click or drag your image here (max 5MB)</p>
                                </>
                            )}
                        </label>
                    )}
                </div>

                {/* Persistent Indicators */}
                <div className="onboarding-indicators">
                    {[1, 2, 3].map(i => (
                        <div 
                            key={i} 
                            className={`indicator-dot ${step === i ? 'active' : ''} ${i < step ? 'clickable' : ''}`}
                            onClick={() => {
                                if (i < step) setStep(i);
                            }}
                        ></div>
                    ))}
                </div>

                {/* Buttons */}
                <div key={`buttons-${step}`} className="onboarding-footer-anim">
                    {step === 1 && (
                        <>
                            <button className="onboarding-btn" onClick={handleNext}>Get Started</button>
                            <button className="onboarding-skip" onClick={handleSkip}>Skip for now</button>
                        </>
                    )}
                    {step === 2 && (
                        <button 
                            className="onboarding-btn" 
                            onClick={handleNext}
                            disabled={!username.trim()}
                        >
                            Next Step
                        </button>
                    )}
                    {step === 3 && (
                        <button 
                            className="onboarding-btn" 
                            onClick={handleNext}
                            disabled={!avatar}
                        >
                            Finish setup
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
