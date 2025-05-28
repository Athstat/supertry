import { useState, useCallback } from 'react';
import { isBridgeAvailable, requestPushPermissions } from '../utils/bridgeUtils';

export interface PushNotificationState {
  isRequesting: boolean;
  hasPermission: boolean;
  isSupported: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isRequesting: false,
    hasPermission: !!localStorage.getItem('onesignal_id'),
    isSupported: isBridgeAvailable(),
  });

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      console.log('Push notifications not supported (not in mobile app)');
      return false;
    }

    if (state.hasPermission) {
      console.log('Push notifications already granted');
      return true;
    }

    setState(prev => ({ ...prev, isRequesting: true }));

    try {
      const granted = await requestPushPermissions();
      
      setState(prev => ({
        ...prev,
        hasPermission: granted,
        isRequesting: false,
      }));

      return granted;
    } catch (error) {
      console.error('Error requesting push permissions:', error);
      setState(prev => ({ ...prev, isRequesting: false }));
      return false;
    }
  }, [state.isSupported, state.hasPermission]);

  const checkPermissionStatus = useCallback(() => {
    const hasPermission = !!localStorage.getItem('onesignal_id');
    setState(prev => ({ ...prev, hasPermission }));
    return hasPermission;
  }, []);

  return {
    ...state,
    requestPermissions,
    checkPermissionStatus,
  };
}
