import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WalletErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console but don't crash the app
    console.warn('Wallet error caught by boundary:', error, errorInfo);
    
    // Only set error state for wallet-related errors
    if (error.message.includes('ethereum') || 
        error.message.includes('provider') || 
        error.message.includes('wallet')) {
      this.setState({ hasError: true, error });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Wallet Connection Issue
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
            There was an issue with your wallet connection. This might be due to multiple wallet extensions.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WalletErrorBoundary; 