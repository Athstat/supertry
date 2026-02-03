import { useCallback, useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useDeviceId } from '../web/useDeviceId';
import { useAuth } from '../../contexts/auth/AuthContext';

/** Hook that provides functionality to handle guest login */
export function useGuestLogin(nextRoute?: string) {
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { deviceId } = useDeviceId();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleGuestLogin = useCallback(async () => {
    setError(undefined);

    console.log('window.deviceId: ', window.deviceId);
    console.log('deviceId: ', deviceId);

    if (!deviceId) {
      setError('Device ID not available');
      return;
    }

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
  }, [deviceId, setAuth, navigate, nextRoute]);

  return {
    handleGuestLogin,
    isLoading,
    error,
  };
}
