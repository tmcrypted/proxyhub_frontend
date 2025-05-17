import { useState } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'

interface PricingTier {
    id: string;
    name: string;
    basePrice: number;
    minQuantity: number;
    maxQuantity: number;
    discountPercent: number;
}

interface CountryPricing {
    id: string;
    countryCode: string;
    countryName: string;
    priceMultiplier: number;
}

const AdminPricing = () => {
    // Pricing tiers
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
        {
            id: 'tier-1',
            name: 'Standard',
            basePrice: 10,
            minQuantity: 1,
            maxQuantity: 9,
            discountPercent: 0
        },
        {
            id: 'tier-2',
            name: 'Bulk',
            basePrice: 9,
            minQuantity: 10,
            maxQuantity: 49,
            discountPercent: 10
        },
        {
            id: 'tier-3',
            name: 'Enterprise',
            basePrice: 7.5,
            minQuantity: 50,
            maxQuantity: 999,
            discountPercent: 25
        }
    ]);

    // Country pricing
    const [countryPricing, setCountryPricing] = useState<CountryPricing[]>([
        {
            id: 'country-us',
            countryCode: 'US',
            countryName: 'United States',
            priceMultiplier: 1.0
        },
        {
            id: 'country-uk',
            countryCode: 'UK',
            countryName: 'United Kingdom',
            priceMultiplier: 1.2
        },
        {
            id: 'country-de',
            countryCode: 'DE',
            countryName: 'Germany',
            priceMultiplier: 1.1
        },
        {
            id: 'country-fr',
            countryCode: 'FR',
            countryName: 'France',
            priceMultiplier: 1.1
        },
        {
            id: 'country-ca',
            countryCode: 'CA',
            countryName: 'Canada',
            priceMultiplier: 1.0
        }
    ]);

    // Global pricing settings
    const [globalSettings, setGlobalSettings] = useState({
        promotionDiscount: 0,
        promotionActive: false,
        promotionCode: '',
        taxRate: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle pricing tier change
    const handleTierChange = (id: string, field: keyof PricingTier, value: number | string) => {
        setPricingTiers(tiers => 
            tiers.map(tier => 
                tier.id === id ? { ...tier, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value } : tier
            )
        );
    };

    // Handle country pricing change
    const handleCountryPriceChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setCountryPricing(countries => 
            countries.map(country => 
                country.id === id ? { ...country, priceMultiplier: numValue } : country
            )
        );
    };

    // Handle global settings change
    const handleGlobalSettingChange = (field: keyof typeof globalSettings, value: string | boolean) => {
        if (field === 'promotionDiscount' || field === 'taxRate') {
            const numValue = typeof value === 'string' ? parseFloat(value) : 0;
            if (isNaN(numValue)) return;
            
            setGlobalSettings({
                ...globalSettings,
                [field]: numValue
            });
        } else {
            setGlobalSettings({
                ...globalSettings,
                [field]: value
            });
        }
    };

    // Save pricing settings
    const handleSavePricing = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        // Validate tiers are properly ordered
        for (let i = 0; i < pricingTiers.length - 1; i++) {
            if (pricingTiers[i].maxQuantity >= pricingTiers[i + 1].minQuantity) {
                setErrorMessage('Pricing tier quantities must not overlap');
                setIsLoading(false);
                return;
            }
        }

        // Simulate API call
        setTimeout(() => {
            // Here you would make an API call to save the pricing settings
            console.log('Saving pricing tiers:', pricingTiers);
            console.log('Saving country pricing:', countryPricing);
            console.log('Saving global settings:', globalSettings);
            
            setSuccessMessage('Pricing settings updated successfully');
            setIsLoading(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 800);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">Pricing Management</h3>
            
            {successMessage && (
                <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-md">
                    {successMessage}
                </div>
            )}
            
            {errorMessage && (
                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-md flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>{errorMessage}</div>
                </div>
            )}
            
            <form onSubmit={handleSavePricing}>
                {/* Pricing Tiers Section */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4 pb-2 border-b">Pricing Tiers</h4>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full mb-4">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-4 py-3">Tier Name</th>
                                    <th className="px-4 py-3">Base Price ($)</th>
                                    <th className="px-4 py-3">Min Quantity</th>
                                    <th className="px-4 py-3">Max Quantity</th>
                                    <th className="px-4 py-3">Discount (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pricingTiers.map((tier) => (
                                    <tr key={tier.id}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={tier.name}
                                                onChange={(e) => handleTierChange(tier.id, 'name', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={tier.basePrice}
                                                onChange={(e) => handleTierChange(tier.id, 'basePrice', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={tier.minQuantity}
                                                onChange={(e) => handleTierChange(tier.id, 'minQuantity', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min={tier.minQuantity}
                                                value={tier.maxQuantity}
                                                onChange={(e) => handleTierChange(tier.id, 'maxQuantity', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={tier.discountPercent}
                                                onChange={(e) => handleTierChange(tier.id, 'discountPercent', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Pricing tiers determine the base price per proxy based on the quantity purchased.
                    </p>
                </div>
                
                {/* Country Pricing Section */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4 pb-2 border-b">Country Pricing Multipliers</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {countryPricing.map((country) => (
                            <div 
                                key={country.id} 
                                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex-grow">
                                    <div className="font-medium">{country.countryName}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{country.countryCode}</div>
                                </div>
                                <div className="flex-shrink-0 w-24">
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={country.priceMultiplier}
                                        onChange={(e) => handleCountryPriceChange(country.id, e.target.value)}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Country multipliers adjust the final price based on region. A multiplier of 1.0 means standard pricing.
                    </p>
                </div>
                
                {/* Global Settings Section */}
                <div className="mb-8">
                    <h4 className="font-medium mb-4 pb-2 border-b">Global Pricing Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="promotionActive"
                                    checked={globalSettings.promotionActive}
                                    onChange={(e) => handleGlobalSettingChange('promotionActive', e.target.checked)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="promotionActive" className="font-medium">
                                    Enable Promotion
                                </label>
                            </div>
                            
                            {globalSettings.promotionActive && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="promotionDiscount" className="block text-sm mb-1">
                                            Promotion Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            id="promotionDiscount"
                                            min="0"
                                            max="100"
                                            value={globalSettings.promotionDiscount}
                                            onChange={(e) => handleGlobalSettingChange('promotionDiscount', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="promotionCode" className="block text-sm mb-1">
                                            Promotion Code (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="promotionCode"
                                            value={globalSettings.promotionCode}
                                            onChange={(e) => handleGlobalSettingChange('promotionCode', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div>
                            <div className="mb-4">
                                <label htmlFor="taxRate" className="block text-sm mb-1">
                                    Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    id="taxRate"
                                    min="0"
                                    value={globalSettings.taxRate}
                                    onChange={(e) => handleGlobalSettingChange('taxRate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Set to 0 if tax is not applicable. This will be added to the final price.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'Saving...' : 'Save Pricing Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPricing; 