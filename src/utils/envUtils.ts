
/** Returns the current environment */
export function getEnvironment() {
    return import.meta.env.VITE_APP_ENV ?? "development";
}