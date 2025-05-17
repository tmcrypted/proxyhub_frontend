import { useState } from 'react'
import { Search, Eye, MailIcon, WalletIcon } from 'lucide-react'

interface User {
    id: string;
    email: string;
    wallet: string;
    balance: number;
    status: 'active' | 'suspended' | 'inactive';
    role: 'user' | 'admin';
    lastActive: string;
    totalSpent: number;
    proxyCount: number;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: 'usr-1',
            email: 'user1@example.com',
            wallet: '0x1234567890abcdef1234567890abcdef12345678',
            balance: 120,
            status: 'active',
            role: 'user',
            lastActive: '2023-06-15',
            totalSpent: 450,
            proxyCount: 8
        },
        {
            id: 'usr-2',
            email: 'user2@example.com',
            wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
            balance: 50,
            status: 'active',
            role: 'user',
            lastActive: '2023-06-10',
            totalSpent: 200,
            proxyCount: 3
        },
        {
            id: 'usr-3',
            email: 'admin@example.com',
            wallet: '0x7890abcdef1234567890abcdef1234567890abcd',
            balance: 500,
            status: 'active',
            role: 'admin',
            lastActive: '2023-06-18',
            totalSpent: 0,
            proxyCount: 0
        },
        {
            id: 'usr-4',
            email: 'suspended@example.com',
            wallet: '0xdef1234567890abcdef1234567890abcdef123456',
            balance: 10,
            status: 'suspended',
            role: 'user',
            lastActive: '2023-05-05',
            totalSpent: 100,
            proxyCount: 1
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all');
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

    // Filter users
    const filteredUsers = users.filter(user => {
        // Filter by search term
        const matchesSearch = 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.wallet.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by status
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        // Filter by role
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesStatus && matchesRole;
    });

    // Status badge component
    const StatusBadge = ({ status }: { status: User['status'] }) => {
        let bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'; // Default
        
        if (status === 'active') {
            bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
        } else if (status === 'suspended') {
            bgColor = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
        }
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Role badge component
    const RoleBadge = ({ role }: { role: User['role'] }) => {
        const bgColor = role === 'admin' 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    // Handle view user details
    const handleViewUser = (userId: string) => {
        console.log(`View user details for ${userId}`);
        // Navigate to user detail page or show modal
    };

    // Handle send email to user
    const handleContactUser = (email: string) => {
        console.log(`Contact user: ${email}`);
        // Open email composition modal or link
    };

    // Handle view user balance details
    const handleViewBalance = (userId: string) => {
        console.log(`View balance details for ${userId}`);
        // Navigate to user's balance page or show modal
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">User Management</h3>

            {/* Filter and search controls */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by email or wallet address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    />
                </div>
                
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                
                <div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            
            {/* Users table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-4 py-3">Email / Wallet</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Balance</th>
                            <th className="px-4 py-3">Proxies</th>
                            <th className="px-4 py-3">Last Active</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="font-medium">{user.email}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                            {user.wallet}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={user.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-4 py-3">
                                    ${user.balance.toFixed(2)}
                                </td>
                                <td className="px-4 py-3">
                                    {user.proxyCount}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(user.lastActive).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleViewUser(user.id)}
                                            title="View User"
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleContactUser(user.email)}
                                            title="Contact User"
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <MailIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleViewBalance(user.id)}
                                            title="View Balance"
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <WalletIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-4">
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers; 