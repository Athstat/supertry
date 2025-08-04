import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export function useAuthUser() {
  const user = authService.getUserInfoSync();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, redirect to signin
    if (!loading && !isAuthenticated) {
      console.log('[useAuthUser] User not authenticated, redirecting to signin');
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  // If still loading, return null
  if (loading) {
    return null;
  }

  // If not authenticated, return null (navigation will happen in useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return user;
}
