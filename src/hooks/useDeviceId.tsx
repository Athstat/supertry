import { useEffect, useState } from 'react';
import { getDeviceId } from '../utils/deviceId/deviceIdUtils';

type DeviceIdData = {
  realDeviceId: string;
  storedDeviceId: string;
};

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<DeviceIdData>();

  useEffect(() => {
    const fetcher = async () => {
      const idData = await getDeviceId();
      setDeviceId(idData);
    };

    fetcher();
  }, []);

  return { deviceId };
}
