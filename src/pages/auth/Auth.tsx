import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../config/api';
import './Auth.scss';
import { authRequests } from '../../api/requests';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { setAuth, isAuthenticated } = useAuthStore();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    // Добавляем ref для отслеживания запущенной аутентификации
    const authInProgressRef = useRef(false);

    // Если пользователь уже аутентифицирован, редиректим на главную
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Когда кошелек подключен, автоматически запускаем авторизацию
    useEffect(() => {
        if (isConnected && address && !isAuthenticating && !isAuthenticated && !authInProgressRef.current) {
            handleWalletAuth();
        }
    }, [isConnected, address]);

    const handleWalletAuth = async () => {
        if (!address) {
            setAuthError('Кошелек подключен, но адрес недоступен');
            return;
        }

        if (authInProgressRef.current) {
            console.log('Процесс аутентификации уже запущен');
            return;
        }

        authInProgressRef.current = true;
        setAuthError(null);
        setIsAuthenticating(true);

        try {
            // 1. Запрос нонса с бэкенда
            const response = await api.post('/auth/nonce', {
                address: address
            });

            // Получаем сообщение для подписи из ответа
            const messageToSign: string = response.message;

            // 2. Подписание сообщения - здесь появится стандартный UI ожидания подписи
            const signature = await signMessageAsync({ message: messageToSign });

            // 3. Отправка сигнатуры на бэкенд
            const authResponse = await api.post('/auth/evm', {
                address: address,
                signature: signature,
                message: messageToSign
            });

            // 4. Проверяем успешность аутентификации
            if (authResponse.accessToken) {
                const jwtToken: string = authResponse.refreshToken;
                setAuth(jwtToken, address);
                navigate('/'); // Перенаправляем на главную после успешной авторизации
            } else {
                setAuthError(authResponse.message || 'Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Ошибка в процессе аутентификации:', error);
            setAuthError('Произошла ошибка при авторизации');
        } finally {
            setIsAuthenticating(false);
            authInProgressRef.current = false;
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const response = await authRequests.initiateGoogleAuth();
            // Redirect to backend's Google auth endpoint
            window.location.href = response.url;
        } catch (error) {
            console.error('Google auth error:', error);
            setAuthError('Google authentication failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Авторизация</h1>

                <div className="auth-methods">
                    <div className="auth-method">
                        <h2>Через Web3 кошелек</h2>
                        <div className="rainbow-connect-wrapper">
                            <ConnectButton
                                chainStatus="full"
                                accountStatus="full"
                                showBalance={false}
                                label='Подключить кошелек'
                            />
                        </div>
                        {isConnected && (
                            <div className="auth-status">
                                {isAuthenticating ? (
                                    <p className="auth-message">Выполняется авторизация...</p>
                                ) : (
                                    <p className="auth-message">Кошелек подключен. Проверка авторизации...</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="auth-method">
                        <h2>Google Account</h2>
                        <button 
                            className="auth-button google-button"
                            onClick={handleGoogleAuth}
                        >
                            Sign in with Google
                        </button>
                    </div>

                    <div className="auth-method disabled">
                        <h2>Через Email</h2>
                        <button className="auth-button email-button" disabled>
                            Войти с помощью Email
                        </button>
                        <p className="coming-soon">(Функция скоро появится)</p>
                    </div>
                </div>

                {authError && (
                    <div className="auth-error">
                        {authError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth; 