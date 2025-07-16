// Wallet provider conflict resolution utility
export const handleWalletProviderConflicts = () => {
  // Check if ethereum provider is already defined
  if (typeof window !== 'undefined' && window.ethereum) {
    console.log('Ethereum provider already detected:', {
      isMetaMask: window.ethereum.isMetaMask,
      isWalletConnect: window.ethereum.isWalletConnect,
      providers: window.ethereum.providers || [],
    });
  }

  // Add error handler for provider conflicts
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj: any, prop: PropertyKey, descriptor: PropertyDescriptor) {
    if (obj === window && prop === 'ethereum') {
      try {
        return originalDefineProperty.call(this, obj, prop, descriptor);
      } catch (error) {
        console.warn('Wallet provider conflict detected:', error);
        // Don't throw, just log the warning
        return obj;
      }
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
};

// Initialize wallet provider handling
if (typeof window !== 'undefined') {
  handleWalletProviderConflicts();
} 