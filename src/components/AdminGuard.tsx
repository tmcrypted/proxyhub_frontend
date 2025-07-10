import { type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/authStore';
import useIsAdmin from '../hooks/useIsAdmin';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    navigate({ to: '/auth' });
    return null;
  }

  // If authenticated but not admin, redirect to home
  if (!isAdmin) {
    navigate({ to: '/' });
    return null;
  }

  // If user is admin, render the protected content
  return <>{children}</>;
} 