import { DeviceIdPair } from '../../types/device';
import { isInProduction } from '../webUtils';
import { DeviceIdUnavailableError } from './exceptions';

/** Returns the mobile device id */
export function getMobileDeviceId(): DeviceIdPair {
  const isProd = isInProduction();

  if (isProd) {
    return getProdMobileDeviceId();
  }

  return getQaMobileDeviceId();
}

/** On QA the test flight app is always guarenteed to return a real device id */
function getQaMobileDeviceId(): DeviceIdPair {
  console.log('Retrieving mobile device ID using QA method');

  const storedDeviceId = localStorage.getItem('device_id') || '';
  const realDeviceId = window.deviceId || '';

  console.log('Stored device ID: ', storedDeviceId);
  console.log('Real device ID: ', realDeviceId);

  if (!storedDeviceId && !realDeviceId) {
    throw new DeviceIdUnavailableError('Unable to obtain mobile device ID');
  }

  return { realDeviceId, storedDeviceId };
}

/** Fix we have on QA to solve 'Device Id not found issue'*/
function getProdMobileDeviceId(): DeviceIdPair {
  console.log('Retrieving mobile device ID using prod method');

  let storedDeviceId = localStorage.getItem('device_id') || '';
  let realDeviceId = window.deviceId || '';

  console.log('Stored device ID: ', storedDeviceId);
  console.log('Real device ID: ', realDeviceId);

  if (!storedDeviceId && !realDeviceId) {
    // throw new DeviceIdUnavailableError('Unable to obtain mobile device ID');
    console.log('Unable to obtain mobile device ID, defaulting to random UUID');
    storedDeviceId = `mobile_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  localStorage.setItem('device_id', storedDeviceId);

  return { storedDeviceId: storedDeviceId, realDeviceId: realDeviceId };
}
