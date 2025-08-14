import { useCallback, useState } from 'react';
import { useDeviceId } from '../useDeviceId';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/** Hook that provides functionality to handle guest login */
export function useGuestLogin(nextRoute?: string) {
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { deviceId } = useDeviceId();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleGuestLogin = useCallback(async () => {
    setError(undefined);

    if (!deviceId) return;

    try {
      setLoading(true);
      const { data, error } = await authService.authenticateAsGuestUser(deviceId);

      if (data) {
        const accessToken = data.token;
        const authUser = data.user;

        setAuth(accessToken, authUser);
        await authService.updateUserInfo();
        navigate(nextRoute ?? '/dashboard');
      } else {
        setError(error?.message);
      }
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Failed to sign in as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [deviceId, setAuth, nextRoute]);

  return {
    handleGuestLogin,
    isLoading,
    error,
    deviceId,
  };
}
