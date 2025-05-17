import { useState } from 'react'

const ProfileSettings = () => {
    // User settings form state
    const [formData, setFormData] = useState({
        email: 'user@example.com',
        notifyOnPurchase: true,
        notifyOnExpiration: true,
        notifyOnPromotion: false,
        telegramNotifications: false,
        telegramUsername: '',
        language: 'en',
        theme: 'system'
    });

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Handle checkbox inputs
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checkbox.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving settings:', formData);
        // Implement API call to save user settings
        alert('Settings saved successfully!');
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Account Settings</h3>
            
            <form onSubmit={handleSubmit}>
                {/* Email settings */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4">Email</h4>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                        />
                    </div>
                </div>
                
                {/* Notifications settings */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4">Notifications</h4>
                    
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="notifyOnPurchase"
                                name="notifyOnPurchase"
                                checked={formData.notifyOnPurchase}
                                onChange={handleInputChange}
                                className="mr-3 h-4 w-4"
                            />
                            <label htmlFor="notifyOnPurchase">Notify on purchase</label>
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="notifyOnExpiration"
                                name="notifyOnExpiration"
                                checked={formData.notifyOnExpiration}
                                onChange={handleInputChange}
                                className="mr-3 h-4 w-4"
                            />
                            <label htmlFor="notifyOnExpiration">Notify before proxy expiration</label>
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="notifyOnPromotion"
                                name="notifyOnPromotion"
                                checked={formData.notifyOnPromotion}
                                onChange={handleInputChange}
                                className="mr-3 h-4 w-4"
                            />
                            <label htmlFor="notifyOnPromotion">Notify about promotions and special offers</label>
                        </div>
                    </div>
                </div>
                
                {/* Telegram settings */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4">Telegram Notifications</h4>
                    
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <input
                                type="checkbox"
                                id="telegramNotifications"
                                name="telegramNotifications"
                                checked={formData.telegramNotifications}
                                onChange={handleInputChange}
                                className="mr-3 h-4 w-4"
                            />
                            <label htmlFor="telegramNotifications">Enable Telegram notifications</label>
                        </div>
                        
                        {formData.telegramNotifications && (
                            <div>
                                <label htmlFor="telegramUsername" className="block text-sm mb-1">Telegram Username</label>
                                <input
                                    type="text"
                                    id="telegramUsername"
                                    name="telegramUsername"
                                    value={formData.telegramUsername}
                                    onChange={handleInputChange}
                                    placeholder="@username"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Preferences settings */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4">Preferences</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="language" className="block text-sm mb-1">Language</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                            >
                                <option value="en">English</option>
                                <option value="ru">Russian</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="theme" className="block text-sm mb-1">Theme</label>
                            <select
                                id="theme"
                                name="theme"
                                value={formData.theme}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                            >
                                <option value="system">System Default</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Submit button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileSettings 