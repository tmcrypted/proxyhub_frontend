import { useState } from 'react'

interface Referral {
    id: string;
    email: string;
    joinDate: string;
    purchases: number;
    commission: number;
    status: 'active' | 'inactive';
}

const ProfileReferrals = () => {
    // Sample referral data - replace with API call
    const [referrals, setReferrals] = useState<Referral[]>([
        {
            id: 'ref123',
            email: 'user1@example.com',
            joinDate: '2023-06-05',
            purchases: 3,
            commission: 15,
            status: 'active'
        },
        {
            id: 'ref456',
            email: 'user2@example.com',
            joinDate: '2023-05-20',
            purchases: 1,
            commission: 5,
            status: 'active'
        }
    ]);

    const [referralLink, setReferralLink] = useState('https://proxyhub.com/ref/user123');
    const [referralCode, setReferralCode] = useState('USER123');
    const [totalEarned, setTotalEarned] = useState(20);
    const [commissionRate, setCommissionRate] = useState(10);

    // Copy referral link to clipboard
    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    // Copy referral code to clipboard
    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        alert('Referral code copied to clipboard!');
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Referral Program</h3>
            
            {/* Referral summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Earned</p>
                    <p className="text-3xl font-bold">${totalEarned.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Commission Rate</p>
                    <p className="text-3xl font-bold">{commissionRate}%</p>
                </div>
            </div>
            
            {/* Referral link section */}
            <div className="mb-8">
                <h4 className="font-medium mb-4">Your Referral Link</h4>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-hidden truncate">
                        {referralLink}
                    </div>
                    <button 
                        onClick={copyReferralLink}
                        className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-hidden truncate">
                        Referral Code: {referralCode}
                    </div>
                    <button 
                        onClick={copyReferralCode}
                        className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Copy Code
                    </button>
                </div>
            </div>
            
            {/* Referred users section */}
            <div>
                <h4 className="font-medium mb-4">Referred Users</h4>
                
                {referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-4 py-3 rounded-tl-lg">User</th>
                                    <th className="px-4 py-3">Join Date</th>
                                    <th className="px-4 py-3">Purchases</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Commission</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {referrals.map((referral) => (
                                    <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3">
                                            {referral.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(referral.joinDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {referral.purchases}
                                        </td>
                                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                                            ${referral.commission.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No referrals yet</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Share your referral link to start earning commissions!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileReferrals 