
/** Returns the current environment */
export function getEnvironment() {
    return import.meta.env.VITE_APP_ENV ?? "development";
}

export type EnvsDict = {

    /** The base URL of the backend server */
    apiBaseUrl: string | undefined,

    /** The environment the app is running on */
    appEnvironment: "production" | "development" | "qa" | undefined | string,

    /** API Key for Amplitude */
    amplitudeApiKey: string | undefined,

    /** The ID of the featured League group used on the onboarding flow etc */
    featureLeagueGroupId: string | undefined,

    /** The Apps Flyter One Link Base Url */
    appsFlyerOneLinkBaseUrl: string | undefined    
}

/** Function when called checks that validates environment variables.
 * The function will throw an exception if there is any issue
  */
export function validateEnvironmentVariables(dict: EnvsDict) {

    // AppsFlyer VITE_AF_ONELINK_BASE_URL is optional, not in this check

    if (!dict.apiBaseUrl) {
        throw Error("'VITE_API_BASE_URL', env variable is missing");
    }

    if (!dict.apiBaseUrl.startsWith("http")) {
        throw Error("Value for 'VITE_API_BASE_URL' is invalid as it doen't start with http protocol")
    }

    if (!dict.amplitudeApiKey) {
        throw Error("'VITE_AMPLITUDE_API_KEY', env variable is missing")
    }

    if (!dict.featureLeagueGroupId) {
        throw Error("'VITE_FEATURE_LEAGUE_GROUP_ID', env variable is missing. Refer to README.md for more information");
    }

    if (!dict.appEnvironment) {
        throw new Error("'VITE_APP_ENV', env variable is missing. You need to specify which environment the app is running in. Refer to README.md for more information")
    }
    
}