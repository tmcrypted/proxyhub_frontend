import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../config/api';

const GoogleCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // Get the code from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (!code) {
                    throw new Error('No code provided');
                }

                // Exchange the code for tokens
                const response = await api.get(`/auth/google/callback?code=${code}`);

                if (response.accessToken) {
                    setAuth(response.accessToken);
                    navigate('/');
                } else {
                    throw new Error('No access token received');
                }
            } catch (error) {
                console.error('Google callback error:', error);
                navigate('/auth?error=google_auth_failed');
            }
        };

        handleGoogleCallback();
    }, [navigate, setAuth]);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Completing Authentication</h1>
                <p>Please wait while we complete your authentication...</p>
            </div>
        </div>
    );
};

export default GoogleCallback; 