import { useCallback, useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDeviceId } from '../useDeviceId';

/** Hook that provides functionality to handle guest login */
export function useGuestLogin(nextRoute?: string) {
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  //const { deviceId } = useDeviceId();

  const deviceId = localStorage.getItem('device_id');

  const handleGuestLogin = useCallback(async () => {
    setError(undefined);

    console.log('window guest login: ', window);
    console.log('deviceId: ', deviceId);

    if (!deviceId) {
      setError('Device ID not available');
      return;
    }

    console.log('handle guest login: ', deviceId);

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
  }, [setAuth, nextRoute, deviceId]);

  return {
    handleGuestLogin,
    isLoading,
    error,
  };
}
