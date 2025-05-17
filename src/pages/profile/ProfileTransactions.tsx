import { useState } from 'react'

interface Transaction {
    id: string;
    date: string;
    type: 'topup' | 'withdraw' | 'purchase';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    description: string;
}

const ProfileTransactions = () => {
    // Sample transactions data - replace with API call
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 'tx123',
            date: '2023-05-15',
            type: 'topup',
            amount: 100,
            status: 'completed',
            description: 'Account balance top-up'
        },
        {
            id: 'tx456',
            date: '2023-05-10',
            type: 'purchase',
            amount: -45,
            status: 'completed',
            description: 'Proxy purchase - 5 USA proxies'
        },
        {
            id: 'tx789',
            date: '2023-05-01',
            type: 'withdraw',
            amount: -25,
            status: 'pending',
            description: 'Withdrawal to wallet'
        }
    ]);

    // Function to determine transaction row style based on type
    const getTransactionTypeStyle = (type: Transaction['type']) => {
        switch (type) {
            case 'topup':
                return 'text-green-600 dark:text-green-400';
            case 'withdraw':
                return 'text-red-600 dark:text-red-400';
            case 'purchase':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return '';
        }
    };

    // Function to format status badge
    const getStatusBadge = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">Completed</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">Pending</span>;
            case 'failed':
                return <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">Failed</span>;
            default:
                return null;
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Transactions</h3>
            
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                <th className="px-4 py-3 rounded-tl-lg">Date</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3 rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">{transaction.description}</td>
                                    <td className={`px-4 py-3 ${getTransactionTypeStyle(transaction.type)}`}>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} USD
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                </div>
            )}
        </div>
    )
}

export default ProfileTransactions 