import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import './Auth.scss';

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
        // Проверяем адрес подключенного кошелька
        if (!address) {
            setAuthError('Кошелек подключен, но адрес недоступен');
            return;
        }

        // Используем ref для предотвращения параллельных запросов
        if (authInProgressRef.current) {
            console.log('Процесс аутентификации уже запущен');
            return;
        }

        authInProgressRef.current = true;
        setAuthError(null);
        setIsAuthenticating(true);

        try {
            // 1. Запрос нонса с бэкенда
            const response = await axios.post('/api/auth/getNonce', {
                address: address
            });

            // Получаем сообщение для подписи из ответа
            const messageToSign: string = response.data.message;

            // 2. Подписание сообщения - здесь появится стандартный UI ожидания подписи
            const signature = await signMessageAsync({ message: messageToSign });

            // 3. Отправка сигнатуры на бэкенд
            const authResponse = await axios.post('/api/auth/web3', {
                address: address,
                signature: signature,
                message: messageToSign
            });

            // 4. Проверяем успешность аутентификации
            if (authResponse.data.success) {
                const jwtToken: string = authResponse.data.token;
                setAuth(jwtToken, address);
                navigate('/'); // Перенаправляем на главную после успешной авторизации
            } else {
                setAuthError(authResponse.data.message || 'Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Ошибка в процессе аутентификации:', error);
            setAuthError('Произошла ошибка при авторизации');
        } finally {
            setIsAuthenticating(false);
            // Сбрасываем флаг процесса аутентификации
            authInProgressRef.current = false;
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