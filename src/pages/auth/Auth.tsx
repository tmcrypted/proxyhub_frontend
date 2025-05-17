import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuthStore } from './store/authStore';
import { authRequests } from '../../shared/api/requests';
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

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { setAuth, isAuthenticated } = useAuthStore();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    // Добавляем ref для отслеживания запущенной аутентификации
    const authInProgressRef = useRef(false);
    
    // Email/password form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
            if (authResponse.accessToken && authResponse.refreshToken) {
                // Сохраняем refresh token в хранилище для долгосрочной авторизации
                const jwtToken: string = authResponse.accessToken; // Use accessToken instead of refreshToken
                try {
                    // Decode the JWT to get the role
                    const decoded = jwtDecode<JwtPayload>(jwtToken);
                    console.log('Decoded token in wallet auth:', decoded);
                    setAuth(jwtToken, address, undefined, decoded.role);
                } catch (e) {
                    console.error('Error decoding JWT:', e);
                    setAuth(jwtToken, address);
                }
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
    
    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setAuthError('Пожалуйста, введите email и пароль');
            return;
        }
        
        setAuthError(null);
        setIsAuthenticating(true);
        
        try {
            const response = await authRequests.loginWithPassword(email, password);
            
            if (response.accessToken && response.refreshToken) {
                // Use accessToken for JWT decoding and authentication
                const jwtToken: string = response.accessToken;
                
                try {
                    // Decode the JWT to get the role
                    const decoded = jwtDecode<JwtPayload>(jwtToken);
                    console.log('Decoded token in email auth:', decoded);
                    setAuth(jwtToken, undefined, email, decoded.role);
                } catch (e) {
                    console.error('Error decoding JWT:', e);
                    setAuth(jwtToken, undefined, email);
                }
                
                navigate('/');
            } else {
                setAuthError(response.message || 'Неверный email или пароль');
            }
        } catch (error) {
            console.error('Login error:', error);
            setAuthError('Ошибка авторизации');
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-5">
            <div className="bg-[rgba(61,61,61,0.8)] rounded-lg p-8 w-full max-w-[600px] shadow-md">
                <h1 className="text-center mb-8 text-white">Авторизация</h1>

                <div className="flex flex-col gap-8">
                    <div className="bg-[rgba(0,0,0,0.05)] rounded-lg p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)]">
                        <h2 className="mb-4 text-xl text-white">Через Web3 кошелек</h2>
                        <div className="flex justify-center mb-4">
                            <ConnectButton
                                chainStatus="full"
                                accountStatus="full"
                                showBalance={false}
                                label='Подключить кошелек'
                            />
                        </div>
                        {isConnected && (
                            <div className="mt-4 p-2.5 rounded bg-[rgba(0,0,0,0.2)] text-center">
                                {isAuthenticating ? (
                                    <p className="m-0 text-sm text-white">Выполняется авторизация...</p>
                                ) : (
                                    <p className="m-0 text-sm text-white">Кошелек подключен. Проверка авторизации...</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-[rgba(0,0,0,0.05)] rounded-lg p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)]">
                        <h2 className="mb-4 text-xl text-white">Google Account</h2>
                        <button 
                            className="w-full py-3 px-3 rounded-md text-white border-none cursor-pointer font-medium transition-colors duration-300 flex items-center justify-center gap-2.5 bg-[#4285F4] hover:bg-[#357ABD] disabled:bg-[#95a5a6] disabled:cursor-not-allowed disabled:opacity-70"
                            onClick={handleGoogleAuth}
                        >
                            Sign in with Google
                        </button>
                    </div>

                    <div className="bg-[rgba(0,0,0,0.05)] rounded-lg p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)]">
                        <h2 className="mb-4 text-xl text-white">Через Email и Пароль</h2>
                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 rounded-md border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] text-white text-base transition-colors duration-300 focus:outline-none focus:border-[#3498db] placeholder:text-[rgba(255,255,255,0.5)]"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-3 rounded-md border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] text-white text-base transition-colors duration-300 focus:outline-none focus:border-[#3498db] placeholder:text-[rgba(255,255,255,0.5)]"
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[rgba(255,255,255,0.7)] cursor-pointer p-1.5 hover:text-white"
                                    onClick={togglePasswordVisibility}
                                >
                                    {isPasswordVisible ? "Скрыть" : "Показать"}
                                </button>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full py-3 px-3 rounded-md text-white border-none cursor-pointer font-medium transition-colors duration-300 bg-[#3498db] hover:bg-[#2980b9] disabled:bg-[#7f8c8d]"
                                disabled={isAuthenticating}
                            >
                                {isAuthenticating ? "Вход..." : "Войти"}
                            </button>
                        </form>
                    </div>
                </div>

                {authError && (
                    <div className="mt-5 text-[#e74c3c] bg-[rgba(231,76,60,0.1)] p-2.5 rounded text-center">
                        {authError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth; 