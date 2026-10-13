import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';


export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();

    const addToast = useToast();
    const { fetchProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (step === 2 && !username.trim()) return;
        if (step === 4 && !avatar) return;

        if (step < 4) {
            setStep(step + 1);
        } else {
            await handleFinishSetup();
        }
    };

    const handleFinishSetup = async () => {
        try {
            setIsSubmitting(true);
            
            // 1. Get current logged in user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                addToast("User not found. Please log in again.", "error");
                setIsSubmitting(false);
                return;
            }

            // 2. Upload avatar to Supabase Storage in high quality
            const fileExt = avatar.name ? avatar.name.split('.').pop() : 'jpg';
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatar, {
                    upsert: true
                });

            if (uploadError) {
                addToast(uploadError.message, "error");
                setIsSubmitting(false);
                return;
            }

            // 3. Get the public URL of the uploaded avatar
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 4. Save username, bio, and avatar URL to the profiles table
            let savedDob = null;
            try {
                savedDob = localStorage.getItem('oasis_registration_dob');
            } catch { }
            savedDob = savedDob || user.user_metadata?.dob || user.user_metadata?.date_of_birth || null;

            const profilePayload = {
                id: user.id,
                username: username,
                bio: bio,
                avatar_url: publicUrl
            };
            if (savedDob) {
                profilePayload.date_of_birth = savedDob;
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profilePayload);

            // Also ensure user_metadata has it
            if (savedDob && (!user.user_metadata?.dob || !user.user_metadata?.date_of_birth)) {
                try {
                    await supabase.auth.updateUser({
                        data: {
                            ...(user.user_metadata || {}),
                            dob: savedDob,
                            date_of_birth: savedDob
                        }
                    });
                } catch { }
            }

            if (profileError) {
                addToast(profileError.message, "error");
                setIsSubmitting(false);
                return;
            }

            await fetchProfile(user.id);

            addToast("Profile setup complete!", "success");
            navigate('/discover');
        } catch (error) {
            console.error(error);
            addToast(error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = async () => {
        try {
            let savedDob = null;
            try {
                savedDob = localStorage.getItem('oasis_registration_dob');
            } catch { }
            if (savedDob) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        date_of_birth: savedDob
                    });
                    await supabase.auth.updateUser({
                        data: {
                            ...(user.user_metadata || {}),
                            dob: savedDob,
                            date_of_birth: savedDob
                        }
                    });
                }
            }
        } catch { }
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
        3: "Tell us about yourself",
        4: "Add a profile picture"
    };

    const subtitles = {
        1: "Let's personalize your profile so the community can get to know you.",
        2: "This is how you'll appear to other readers and writers on the platform.",
        3: "Add a short bio to let others know who you are and what you do.",
        4: "Upload a photo to make your profile stand out. Square images work best."
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
                        <textarea 
                            className="onboarding-input" 
                            placeholder="I'm a Medientechnik designer and front-end developer..." 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            style={{ height: '120px', resize: 'none', padding: '16px' }}
                        />
                    )}

                    {step === 4 && (
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
                    {[1, 2, 3, 4].map(i => (
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
                        <>
                            <button className="onboarding-btn" onClick={handleNext}>Next Step</button>
                            <button className="onboarding-skip" onClick={handleNext}>Skip</button>
                        </>
                    )}
                    {step === 4 && (
                        <button 
                            className="onboarding-btn" 
                            onClick={handleNext}
                            disabled={!avatar || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Finish setup'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
