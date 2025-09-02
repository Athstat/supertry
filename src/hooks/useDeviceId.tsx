import { useEffect, useState } from 'react';
import { getDeviceId } from '../utils/deviceIdUtils';

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string>();

  useEffect(() => {

    const fetcher = async () => {
      setDeviceId(await getDeviceId());
    };

    fetcher();
  }, []);

  return { deviceId };
}
