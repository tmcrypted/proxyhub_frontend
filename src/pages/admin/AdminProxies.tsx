import { useEffect, useState } from 'react'
import { Plus, Search, RefreshCw, Edit, Trash, X } from 'lucide-react'
import ProxyService, { Proxy, CreateProxyDto, ProxyCountry, Branch } from '../../services/ProxyService'

const AdminProxies = () => {
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [countries, setCountries] = useState<ProxyCountry[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof Proxy>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showAddForm, setShowAddForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // New proxy form state
    const [newProxy, setNewProxy] = useState<Partial<CreateProxyDto>>({
        ip: '',
        port: '',
        login: '',
        password: '',
        countryId: 0,
        branchId: undefined,
        proxyStatus: 'ACTIVE',
        proxyType: 'DATACENTER',
        proxyFormat: 'USERNAME_PASSWORD',
        proxyProtocol: 'HTTP',
        expiryDays: 30
    });

    // Fetch proxies, countries, and branches on component mount
    useEffect(() => {
        fetchProxies();
        fetchCountries();
        fetchBranches();
    }, []);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    // Fetch proxies from API
    const fetchProxies = async () => {
        setIsLoading(true);
        try {
            const fetchedProxies = await ProxyService.getProxies();
            setProxies(fetchedProxies);
        } catch (error) {
            console.error('Error fetching proxies:', error);
            setErrorMessage('Failed to load proxies');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch countries from API
    const fetchCountries = async () => {
        try {
            const fetchedCountries = await ProxyService.getCountries();
            setCountries(fetchedCountries);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setErrorMessage('Failed to load countries');
        }
    };

    // Fetch branches from API
    const fetchBranches = async () => {
        try {
            const fetchedBranches = await ProxyService.getBranches();
            setBranches(fetchedBranches);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setErrorMessage('Failed to load branches');
        }
    };

    // Filter proxies based on search term
    const filteredProxies = proxies.filter(proxy => 
        proxy.ip.includes(searchTerm) || 
        (proxy.proxyCountry?.countryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proxy.branch?.comment || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort proxies based on sort field and direction
    const sortedProxies = [...filteredProxies].sort((a, b) => {
        if (sortField === 'ip') {
            const fieldA = a[sortField] || '';
            const fieldB = b[sortField] || '';
            
            if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        } else if (sortField === 'createdAt' || sortField === 'expiresAt') {
            const fieldA = a[sortField] ? new Date(a[sortField] as string).getTime() : 0;
            const fieldB = b[sortField] ? new Date(b[sortField] as string).getTime() : 0;
            
            if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        } else {
            const fieldA = String(a[sortField] || '');
            const fieldB = String(b[sortField] || '');
            
            if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        }
    });

    // Handle sort header click
    const handleSort = (field: keyof Proxy) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'countryId' || name === 'branchId' || name === 'expiryDays' 
            ? parseInt(value) 
            : value;
            
        setNewProxy({
            ...newProxy,
            [name]: parsedValue
        });
    };

    // Handle adding a new proxy
    const handleAddProxy = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (!newProxy.countryId) {
                setErrorMessage('Please select a country');
                return;
            }
            
            const proxyToAdd: CreateProxyDto = {
                ip: newProxy.ip || '',
                port: newProxy.port || '',
                login: newProxy.login || '',
                password: newProxy.password || '',
                branchId: newProxy.branchId,
                countryId: newProxy.countryId || 0,
                proxyStatus: newProxy.proxyStatus || 'ACTIVE',
                proxyType: newProxy.proxyType || 'DATACENTER',
                proxyFormat: newProxy.proxyFormat || 'USERNAME_PASSWORD',
                proxyProtocol: newProxy.proxyProtocol || 'HTTP',
                expiryDays: newProxy.expiryDays
            };
            
            await ProxyService.createProxy(proxyToAdd);
            setSuccessMessage('Proxy added successfully');
            
            // Reset form and refresh list
            setNewProxy({
                ip: '',
                port: '',
                login: '',
                password: '',
                countryId: 0,
                branchId: undefined,
                proxyStatus: 'ACTIVE',
                proxyType: 'DATACENTER',
                proxyFormat: 'USERNAME_PASSWORD',
                proxyProtocol: 'HTTP',
                expiryDays: 30
            });
            setShowAddForm(false);
            fetchProxies();
        } catch (error) {
            console.error('Error adding proxy:', error);
            setErrorMessage('Failed to add proxy');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete proxy
    const handleDeleteProxy = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this proxy?')) {
            try {
                await ProxyService.deleteProxy(id);
                setSuccessMessage('Proxy deleted successfully');
                fetchProxies();
            } catch (error) {
                console.error('Error deleting proxy:', error);
                setErrorMessage('Failed to delete proxy');
            }
        }
    };

    return (
        <div>
            {/* Success and error messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                    {successMessage}
                </div>
            )}
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                    {errorMessage}
                </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Proxy Management</h3>
                
                <div className="flex gap-3">
                    <button 
                        onClick={fetchProxies}
                        disabled={isLoading}
                        className="px-4 py-2 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showAddForm ? 'Cancel' : 'Add Proxy'}
                    </button>
                </div>
            </div>
            
            {/* Add Proxy Form */}
            {showAddForm && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-4">Add New Proxy</h4>
                    
                    <form onSubmit={handleAddProxy}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="ip" className="block text-sm mb-1">IP Address</label>
                                <input
                                    type="text"
                                    id="ip"
                                    name="ip"
                                    value={newProxy.ip || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="port" className="block text-sm mb-1">Port</label>
                                <input
                                    type="text"
                                    id="port"
                                    name="port"
                                    value={newProxy.port || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="login" className="block text-sm mb-1">Login</label>
                                <input
                                    type="text"
                                    id="login"
                                    name="login"
                                    value={newProxy.login || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm mb-1">Password</label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    value={newProxy.password || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="countryId" className="block text-sm mb-1">Country</label>
                                <select
                                    id="countryId"
                                    name="countryId"
                                    value={newProxy.countryId || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                >
                                    <option value="">Select a country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>
                                            {country.countryName} ({country.countryTicker})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="branchId" className="block text-sm mb-1">Branch</label>
                                <select
                                    id="branchId"
                                    name="branchId"
                                    value={newProxy.branchId || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                >
                                    <option value="">Select a branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.comment || `Branch ${branch.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="proxyStatus" className="block text-sm mb-1">Status</label>
                                <select
                                    id="proxyStatus"
                                    name="proxyStatus"
                                    value={newProxy.proxyStatus || 'ACTIVE'}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="proxyType" className="block text-sm mb-1">Type</label>
                                <select
                                    id="proxyType"
                                    name="proxyType"
                                    value={newProxy.proxyType || 'DATACENTER'}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                >
                                    <option value="DATACENTER">Data Center</option>
                                    <option value="RESIDENTIAL">Residential</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="proxyProtocol" className="block text-sm mb-1">Protocol</label>
                                <select
                                    id="proxyProtocol"
                                    name="proxyProtocol"
                                    value={newProxy.proxyProtocol || 'HTTP'}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                >
                                    <option value="HTTP">HTTP</option>
                                    <option value="HTTPS">HTTPS</option>
                                    <option value="SOCKS4">SOCKS4</option>
                                    <option value="SOCKS5">SOCKS5</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="expiryDays" className="block text-sm mb-1">Expiry Days</label>
                                <input
                                    type="number"
                                    id="expiryDays"
                                    name="expiryDays"
                                    value={newProxy.expiryDays || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {isSubmitting ? 'Adding...' : 'Add Proxy'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Search and filter */}
            <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by IP, country or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                />
            </div>
            
            {/* Proxies table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                            <th 
                                onClick={() => handleSort('ip')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                IP:Port {sortField === 'ip' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                onClick={() => handleSort('proxyCountry')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Country {sortField === 'proxyCountry' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                onClick={() => handleSort('proxyType')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Type {sortField === 'proxyType' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                onClick={() => handleSort('branch')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Branch {sortField === 'branch' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                onClick={() => handleSort('proxyStatus')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Status {sortField === 'proxyStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                onClick={() => handleSort('expiresAt')}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Expires {sortField === 'expiresAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                                    <p className="mt-2 text-gray-500">Loading proxies...</p>
                                </td>
                            </tr>
                        ) : sortedProxies.length > 0 ? (
                            sortedProxies.map((proxy) => (
                                <tr key={proxy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-mono text-sm">
                                        {proxy.ip}:{proxy.port}
                                    </td>
                                    <td className="px-4 py-3">
                                        {proxy.proxyCountry?.countryName || 'Unknown'} ({proxy.proxyCountry?.countryTicker || '?'})
                                    </td>
                                    <td className="px-4 py-3">
                                        {proxy.proxyType === 'DATACENTER' ? 'Data Center' : 'Residential'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {proxy.branch?.comment || 'None'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {proxy.proxyStatus === 'ACTIVE' ? (
                                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                                                Active
                                            </span>
                                        ) : proxy.proxyStatus === 'EXPIRED' ? (
                                            <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                                                Expired
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {proxy.expiresAt ? new Date(proxy.expiresAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProxy(proxy.id)}
                                                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center">
                                    <p className="text-gray-500">No proxies found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProxies; 