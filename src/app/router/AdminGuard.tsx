import { type ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore, useIsAdmin, useAuthLoading } from '@/shared/api/authStore';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isLoading = useAuthLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to auth page
      if (!isAuthenticated) {
        navigate({ to: '/auth' });
        return;
      }

      // If authenticated but not admin, redirect to home
      if (!isAdmin) {
        navigate({ to: '/' });
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, show loading (will redirect)
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If user is admin, render the protected content
  return <>{children}</>;
} 