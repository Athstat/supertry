import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function useAuthUser() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, authUser: user} = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, redirect to signin
    if (!isLoading && !isAuthenticated) {
      console.log('[useAuthUser] User not authenticated, redirecting to signin');
      navigate('/signin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If still loading, return null
  if (isLoading) {
    return null;
  }

  // If not authenticated, return null (navigation will happen in useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return user;
}
