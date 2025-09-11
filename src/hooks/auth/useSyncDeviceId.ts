import { useEffect, useRef } from 'react';
import { useDeviceId } from '../../hooks/useDeviceId';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

/**
 * Syncs the current device's realDeviceId/storedDeviceId to the backend
 * once per app session when both the deviceId and authentication are ready.
 */
export function useSyncDeviceId() {
  const { deviceId } = useDeviceId();
  const { isAuthenticated } = useAuth();
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (didSyncRef.current) return;
    if (!isAuthenticated || !deviceId) return;

    didSyncRef.current = true;

    authService.updateUserDeviceId(deviceId).catch(() => {
      // best-effort, ignore errors
    });
  }, [isAuthenticated, deviceId]);
}
