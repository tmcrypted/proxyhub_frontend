import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Header />
            <main className="flex-grow container mx-auto p-4 splash-cursor-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout 