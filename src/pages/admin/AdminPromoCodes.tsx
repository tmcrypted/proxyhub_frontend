import { useState } from 'react'
import { Plus, RefreshCw, Edit, Trash, X, Calendar, Copy } from 'lucide-react'

interface PromoCode {
    id: string;
    code: string;
    discountPercent: number;
    validFrom: string;
    validUntil: string;
    usageLimit: number;
    usageCount: number;
    isActive: boolean;
}

const AdminPromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
        {
            id: 'promo-1',
            code: 'SUMMER2023',
            discountPercent: 20,
            validFrom: '2023-06-01',
            validUntil: '2023-08-31',
            usageLimit: 100,
            usageCount: 45,
            isActive: true
        },
        {
            id: 'promo-2',
            code: 'WELCOME10',
            discountPercent: 10,
            validFrom: '2023-01-01',
            validUntil: '2023-12-31',
            usageLimit: 0, // unlimited
            usageCount: 120,
            isActive: true
        },
        {
            id: 'promo-3',
            code: 'FLASH50',
            discountPercent: 50,
            validFrom: '2023-05-15',
            validUntil: '2023-05-20',
            usageLimit: 50,
            usageCount: 50,
            isActive: false
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // New promo code form state
    const [newPromoCode, setNewPromoCode] = useState<Omit<PromoCode, 'id' | 'usageCount'>>({
        code: '',
        discountPercent: 10,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 0,
        isActive: true
    });

    // Handle form input change
    const handleInputChange = (field: keyof typeof newPromoCode, value: string | number | boolean) => {
        setNewPromoCode({
            ...newPromoCode,
            [field]: value
        });
    };

    // Add new promo code
    const handleAddPromoCode = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newId = `promo-${Math.floor(Math.random() * 1000)}`;
            
            const promoToAdd: PromoCode = {
                id: newId,
                ...newPromoCode,
                usageCount: 0
            };
            
            setPromoCodes([...promoCodes, promoToAdd]);
            
            // Reset form
            setNewPromoCode({
                code: '',
                discountPercent: 10,
                validFrom: new Date().toISOString().split('T')[0],
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                usageLimit: 0,
                isActive: true
            });
            
            setShowAddForm(false);
            setIsLoading(false);
        }, 600);
    };

    // Delete promo code
    const handleDeletePromoCode = (id: string) => {
        if (window.confirm('Are you sure you want to delete this promo code?')) {
            setPromoCodes(promoCodes.filter(code => code.id !== id));
        }
    };

    // Toggle promo code active status
    const handleToggleActive = (id: string) => {
        setPromoCodes(promoCodes.map(code => 
            code.id === id ? { ...code, isActive: !code.isActive } : code
        ));
    };

    // Copy promo code to clipboard
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Edit promo code
    const handleEditPromoCode = (id: string) => {
        const codeToEdit = promoCodes.find(code => code.id === id);
        if (codeToEdit) {
            setEditingCodeId(id);
            setNewPromoCode({
                code: codeToEdit.code,
                discountPercent: codeToEdit.discountPercent,
                validFrom: codeToEdit.validFrom,
                validUntil: codeToEdit.validUntil,
                usageLimit: codeToEdit.usageLimit,
                isActive: codeToEdit.isActive
            });
            setShowAddForm(true);
        }
    };

    // Save edited promo code
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCodeId) return;
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setPromoCodes(promoCodes.map(code => 
                code.id === editingCodeId ? { 
                    ...code, 
                    code: newPromoCode.code,
                    discountPercent: newPromoCode.discountPercent,
                    validFrom: newPromoCode.validFrom,
                    validUntil: newPromoCode.validUntil,
                    usageLimit: newPromoCode.usageLimit,
                    isActive: newPromoCode.isActive
                } : code
            ));
            
            // Reset form
            setNewPromoCode({
                code: '',
                discountPercent: 10,
                validFrom: new Date().toISOString().split('T')[0],
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                usageLimit: 0,
                isActive: true
            });
            
            setShowAddForm(false);
            setEditingCodeId(null);
            setIsLoading(false);
        }, 600);
    };

    // Cancel form
    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingCodeId(null);
        
        // Reset form
        setNewPromoCode({
            code: '',
            discountPercent: 10,
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            usageLimit: 0,
            isActive: true
        });
    };

    // Get status of promo code
    const getPromoStatus = (promo: PromoCode) => {
        const now = new Date();
        const validFrom = new Date(promo.validFrom);
        const validUntil = new Date(promo.validUntil);
        const isExpired = validUntil < now;
        const isNotStarted = validFrom > now;
        const isLimitReached = promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit;
        
        if (!promo.isActive) return 'inactive';
        if (isExpired) return 'expired';
        if (isNotStarted) return 'scheduled';
        if (isLimitReached) return 'depleted';
        return 'active';
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = '';
        
        switch (status) {
            case 'active':
                bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
                break;
            case 'expired':
                bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
                break;
            case 'scheduled':
                bgColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
                break;
            case 'depleted':
                bgColor = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
                break;
            case 'inactive':
                bgColor = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
                break;
            default:
                bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Promo Codes Management</h3>
                
                <button 
                    onClick={() => {
                        if (!showAddForm) {
                            setShowAddForm(true);
                            setEditingCodeId(null);
                        } else {
                            handleCancelForm();
                        }
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add Promo Code'}
                </button>
            </div>

            {/* Add/Edit Promo Code Form */}
            {showAddForm && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-4">
                        {editingCodeId ? 'Edit Promo Code' : 'Add New Promo Code'}
                    </h4>
                    
                    <form onSubmit={editingCodeId ? handleSaveEdit : handleAddPromoCode}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="code" className="block text-sm mb-1">Promo Code</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={newPromoCode.code}
                                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                    placeholder="e.g. SUMMER2023"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="discountPercent" className="block text-sm mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    id="discountPercent"
                                    min="1"
                                    max="100"
                                    value={newPromoCode.discountPercent}
                                    onChange={(e) => handleInputChange('discountPercent', parseInt(e.target.value))}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="validFrom" className="block text-sm mb-1">Valid From</label>
                                <input
                                    type="date"
                                    id="validFrom"
                                    value={newPromoCode.validFrom}
                                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="validUntil" className="block text-sm mb-1">Valid Until</label>
                                <input
                                    type="date"
                                    id="validUntil"
                                    value={newPromoCode.validUntil}
                                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="usageLimit" className="block text-sm mb-1">Usage Limit (0 for unlimited)</label>
                                <input
                                    type="number"
                                    id="usageLimit"
                                    min="0"
                                    value={newPromoCode.usageLimit}
                                    onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                />
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={newPromoCode.isActive}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="isActive">Active</label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                {isLoading ? 'Saving...' : editingCodeId ? 'Save Changes' : 'Add Promo Code'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Promo Codes Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Validity</th>
                            <th className="px-4 py-3">Usage</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {promoCodes.map((promo) => {
                            const status = getPromoStatus(promo);
                            
                            return (
                                <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-medium">{promo.code}</span>
                                            <button 
                                                onClick={() => handleCopyCode(promo.code)}
                                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                title="Copy code"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            {copiedCode === promo.code && (
                                                <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {promo.discountPercent}%
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{new Date(promo.validFrom).toLocaleDateString()} - {new Date(promo.validUntil).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {promo.usageCount} / {promo.usageLimit > 0 ? promo.usageLimit : '∞'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditPromoCode(promo.id)}
                                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                                title="Edit promo code"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleActive(promo.id)}
                                                className={`p-1 rounded ${
                                                    promo.isActive 
                                                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                                        : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                }`}
                                                title={promo.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {promo.isActive ? (
                                                    <X className="w-4 h-4" />
                                                ) : (
                                                    <div className="w-4 h-4 flex items-center justify-center">✓</div>
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePromoCode(promo.id)}
                                                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                title="Delete promo code"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {promoCodes.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-4">
                        <p className="text-gray-500 dark:text-gray-400">No promo codes found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPromoCodes; 