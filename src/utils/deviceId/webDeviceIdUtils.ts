import { DeviceIdPair } from "../../types/device";

/** Returns web device id */
export function getWebDeviceId() : DeviceIdPair {
    let webDeviceId = localStorage.getItem('device_id');

    if (!webDeviceId) {
        // Generate a new device ID
        if (
            typeof crypto !== 'undefined' &&
            (crypto as Crypto & { randomUUID?: () => string }).randomUUID
        ) {
            webDeviceId = (crypto as Crypto & { randomUUID: () => string }).randomUUID();
        } else {
            // Fallback for older browsers
            webDeviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        }

        localStorage.setItem('device_id', webDeviceId);
        console.log('New device ID for web: ', webDeviceId);
    }

    console.log('deviceId exists in local storage: ', webDeviceId);

    return {storedDeviceId: webDeviceId, realDeviceId: webDeviceId}
}