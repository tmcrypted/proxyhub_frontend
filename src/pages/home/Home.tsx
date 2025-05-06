import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

const Home = () => {
    const { isAuthenticated } = useAuthStore()

    return (
        <div className="py-12">
            <h1 className="text-4xl font-bold text-center mb-8">
                Welcome to ProxyHub
            </h1>
            <div className="max-w-3xl mx-auto text-center">
                <p className="text-xl mb-8">
                    Premium proxy services for all your needs
                </p>
                <div className="space-x-4">
                    <Link
                        to="/proxies"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                    >
                        View Proxies
                    </Link>

                    {!isAuthenticated && (
                        <Link
                            to="/auth"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home 