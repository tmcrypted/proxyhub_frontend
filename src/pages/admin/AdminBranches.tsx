import { useState } from 'react'
import { Plus, Edit, Trash, X, RefreshCw } from 'lucide-react'

interface Branch {
    id: string;
    name: string;
    proxyCount: number;
    createdAt: string;
}

const AdminBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([
        {
            id: 'br-1',
            name: 'Main',
            proxyCount: 15,
            createdAt: '2023-03-10'
        },
        {
            id: 'br-2',
            name: 'Secondary',
            proxyCount: 8,
            createdAt: '2023-04-05'
        },
        {
            id: 'br-3',
            name: 'Premium',
            proxyCount: 20,
            createdAt: '2023-05-15'
        }
    ]);
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    // Simulate adding new branch
    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const newBranch: Branch = {
                id: `br-${Math.floor(Math.random() * 1000)}`,
                name: newBranchName,
                proxyCount: 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
            
            setBranches([...branches, newBranch]);
            setNewBranchName('');
            setShowAddForm(false);
            setIsLoading(false);
        }, 600);
    };

    // Start editing branch
    const startEditingBranch = (branch: Branch) => {
        setEditingBranchId(branch.id);
        setEditingName(branch.name);
    };

    // Cancel editing branch
    const cancelEditing = () => {
        setEditingBranchId(null);
        setEditingName('');
    };

    // Save edited branch
    const saveBranchEdit = (id: string) => {
        setBranches(branches.map(branch => 
            branch.id === id ? { ...branch, name: editingName } : branch
        ));
        setEditingBranchId(null);
        setEditingName('');
    };

    // Delete branch
    const handleDeleteBranch = (id: string) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            setBranches(branches.filter(branch => branch.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Branch Management</h3>
                
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add Branch'}
                </button>
            </div>
            
            {/* Add Branch Form */}
            {showAddForm && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-4">Add New Branch</h4>
                    
                    <form onSubmit={handleAddBranch}>
                        <div className="mb-4">
                            <label htmlFor="branchName" className="block text-sm mb-1">Branch Name</label>
                            <input
                                type="text"
                                id="branchName"
                                value={newBranchName}
                                onChange={(e) => setNewBranchName(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                            />
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {isLoading ? 'Adding...' : 'Add Branch'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Branches list */}
            <div className="space-y-4">
                {branches.length > 0 ? (
                    branches.map((branch) => (
                        <div 
                            key={branch.id} 
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex justify-between items-center"
                        >
                            <div>
                                {editingBranchId === branch.id ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                                        autoFocus
                                    />
                                ) : (
                                    <h4 className="font-medium">{branch.name}</h4>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {branch.proxyCount} {branch.proxyCount === 1 ? 'proxy' : 'proxies'}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {editingBranchId === branch.id ? (
                                    <>
                                        <button 
                                            onClick={() => saveBranchEdit(branch.id)}
                                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEditing}
                                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => startEditingBranch(branch)}
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteBranch(branch.id)}
                                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No branches found</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Create a branch to organize your proxies
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBranches; 