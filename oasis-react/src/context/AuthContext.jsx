import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

const CACHED_PROFILE_KEY = 'oasis_cached_profile';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(() => {
        try {
            const cached = localStorage.getItem(CACHED_PROFILE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes (login, logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                try {
                    localStorage.removeItem(CACHED_PROFILE_KEY);
                } catch { }
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (!error && data) {
                setProfile(data);
                try {
                    localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(data));
                } catch { }
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            localStorage.removeItem(CACHED_PROFILE_KEY);
        } catch { }
        setProfile(null);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

