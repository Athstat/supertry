import { DeviceIdPair } from "../../types/device";
import { isInProduction } from "../webUtils";
import { DeviceIdUnavailableError } from "./exceptions";



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
    console.log('Mobile detected...');

    const storedDeviceId = localStorage.getItem('device_id') || '';
    const realDeviceId = window.deviceId || '';

    console.log('Stored device ID: ', storedDeviceId);
    console.log('Real device ID: ', realDeviceId);

    if (!storedDeviceId && !realDeviceId) {
        throw new DeviceIdUnavailableError('Unable to obtain mobile device ID');
    }

    return { realDeviceId, storedDeviceId };
}

/** Handles getting the mobile device id on prod, and defaults incase no device id is found */
function getProdMobileDeviceId(): DeviceIdPair {
    
    console.log("Retrieving mobile device ID using prod solution")
    let mobileDeviceId = window.deviceId ?? localStorage.getItem('device_id');

    console.log('Mobile device ID: ', mobileDeviceId);

    if (!mobileDeviceId) {
        // throw new DeviceIdUnavailableError('Unable to obtain mobile device ID');
        console.log('Unable to obtain mobile device ID, defaulting to random UUID');
        mobileDeviceId = `mobile_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    }

    localStorage.setItem('mobile device_id', mobileDeviceId);

    return {storedDeviceId: mobileDeviceId, realDeviceId: mobileDeviceId};
}