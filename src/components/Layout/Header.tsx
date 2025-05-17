import { Link } from 'react-router-dom'
import { useAuthStore } from '../../pages/auth/store/authStore'
import { useDisconnect } from 'wagmi'
import { User, Moon, Sun, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import useIsAdmin from '../../hooks/useIsAdmin'

const Header = () => {
    const { isAuthenticated } = useAuthStore()
    const { disconnect } = useDisconnect()
    const userBalance = 42 // Replace with actual balance from state/API
    const { theme, toggleTheme } = useTheme()
    const [language, setLanguage] = useState<'en' | 'ru'>('en')
    const isAdmin = useIsAdmin();

    // Toggle language between English and Russian
    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'ru' : 'en'
        setLanguage(newLanguage)
        // Here you would typically update your i18n context/state
    }

    return (
        <header className="flex justify-center items-center m-0 p-0 w-screen bg-gray-800 dark:bg-gray-900">
            <div className="flex justify-between items-center h-[65px] w-[40%] min-w-[700px] max-w-[1500px]">
                <div className="flex items-start text-2xl text-white">
                    <Link to="/" className="flex items-center">
                        <h2>ProxyHub</h2>
                    </Link>
                </div>
                <nav className="flex gap-5 justify-start">
                    {!isAdmin && <Link to="/proxies" className="text-white no-underline hover:text-blue-300">Proxies</Link>}
                    {!isAdmin && isAuthenticated && <Link to="/dashboard" className="text-white no-underline hover:text-blue-300">Dashboard</Link>}
                    {isAdmin && <Link to="/profile/admin/proxies" className="text-white no-underline hover:text-blue-300">Admin Panel</Link>}
                </nav>

                <div className="ml-5 flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {!isAdmin && (
                                <div className="text-white">
                                    Balance: ${userBalance}
                                </div>
                            )}
                            <Link to="/profile" className="bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
                                <User className="w-5 h-5" />
                            </Link>
                        </>
                    ) : (
                        <Link to="/auth" className="inline-block bg-blue-500 text-white border-none py-2.5 px-5 rounded-md cursor-pointer font-medium transition-colors duration-300 hover:bg-blue-600">
                            Войти
                        </Link>
                    )}
                    
                    {/* Theme toggle button */}
                    <button 
                        onClick={toggleTheme}
                        className="bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" 
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    
                    {/* Language toggle button */}
                    <button 
                        onClick={toggleLanguage}
                        className="bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" 
                        aria-label="Toggle language"
                    >
                        <Globe className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header 