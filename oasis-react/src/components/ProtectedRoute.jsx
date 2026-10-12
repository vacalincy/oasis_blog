import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // While checking session state, show a minimal loading placeholder
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            </div>
        );
    }

    // If no user is logged in, redirect to the landing page (which has the login form)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the protected component
    return children;
}
