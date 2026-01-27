import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useUserAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
