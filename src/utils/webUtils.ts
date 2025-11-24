export const launchDate = new Date("2025-05-12T00:00");

/** returns true if app in production */
export function isInProduction() {
    return import.meta.env.VITE_APP_ENV === 'production';
}

/** returns true if app in production or in QA */
export function isInProductionOrQA() {
    return import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.VITE_APP_ENV === 'qa';
}

/** Gets the users device info */
export function getDeviceInfo() {
    const agent = navigator.userAgent;
    return { agent };
}

/** Returns week number since Srummy Launch
 * `Week 1` would be the first week scrummy was launched
 */
export function getWeekFromLaunch() {

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    const weekEpoch = 1000 * 60 * 60 * 24 * 7;
    const diff = dateNow.valueOf() - launchDate.valueOf();

    const weeks = diff / weekEpoch;

    return Math.floor(weeks) + 1;

}

