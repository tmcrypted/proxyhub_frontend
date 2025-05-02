import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useDisconnect } from 'wagmi'
import axios from 'axios'
import './layout.scss'; // Импорт стилей
import proxyhub from '../../assets/proxyhub.png'

const Header = () => {
    const { isAuthenticated, logout } = useAuthStore()
    const { disconnect } = useDisconnect()

    // Функция для выхода - отключает кошелек и очищает состояние аутентификации
    const handleLogout = async () => {
        try {
            // Отправляем запрос на выход на сервер для инвалидации HTTP-only cookie
            await axios.post('/api/auth/logout')

            // После успешного ответа от сервера
            disconnect() // Отключаем кошелек
            logout()     // Очищаем состояние аутентификации
        } catch (error) {
            console.error('Ошибка при выходе из аккаунта:', error)

            // Даже если запрос не удался, все равно выполняем локальный выход
            disconnect()
            logout()
        }
    }

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__logo">
                    <Link to="/" className="header__logo-link">
                        <h2>ProxyHub</h2>
                    </Link>
                </div>
                <nav className="header__nav">
                    <Link to="/proxies">Proxies</Link>
                    <Link to="/pricing">Pricing</Link>
                    {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
                </nav>

                <div className="header__actions">
                    {isAuthenticated ? (
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    ) : (
                        <Link to="/auth" className="login-button">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header 