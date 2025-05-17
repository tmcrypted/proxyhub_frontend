import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { api } from '../../shared/config/api';
import { jwtDecode } from 'jwt-decode';

// JWT payload interface
interface JwtPayload {
    sub: number;
    address?: string;
    email?: string;
    role: string;
    exp: number;
}

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
                    // Use accessToken for JWT decoding and authentication
                    const jwtToken: string = response.accessToken;
                    
                    try {
                        // Decode the JWT to get the role and other information
                        const decoded = jwtDecode<JwtPayload>(jwtToken);
                        console.log('Decoded token in Google auth:', decoded);
                        setAuth(jwtToken, decoded.address, decoded.email, decoded.role);
                    } catch (e) {
                        console.error('Error decoding JWT:', e);
                        setAuth(jwtToken);
                    }
                    
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