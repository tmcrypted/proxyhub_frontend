const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 mt-auto">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold">ProxyHub</h3>
                        <p className="text-sm">Best proxy service for your needs</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-300">Terms</a>
                        <a href="#" className="hover:text-gray-300">Privacy</a>
                        <a href="#" className="hover:text-gray-300">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer 