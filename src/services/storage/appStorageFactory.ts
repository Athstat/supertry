import { AppStorage } from "./appStorage.interface";
import { WebAppStorage } from "./webAppStorage";
import { MobileAppStorage } from "./mobileAppStorage";
import { isBridgeAvailable } from "../../utils/bridgeUtils";

/**
 * Factory function that returns the appropriate app storage implementation
 * based on the current environment.
 * 
 * - If running in a mobile app with bridge available: returns MobileAppStorage
 * - Otherwise: returns WebAppStorage (for web browsers)
 */
function createAppStorage(): AppStorage {
    if (isBridgeAvailable()) {
        console.log('AppStorageFactory: Using MobileAppStorage (bridge available)');
        return new MobileAppStorage();
    } else {
        console.log('AppStorageFactory: Using WebAppStorage (no bridge available)');
        return new WebAppStorage();
    }
}

/**
 * Singleton instance of the app storage
 * This ensures we use the same storage instance throughout the app
 */
let appStorageInstance: AppStorage | null = null;

/**
 * Get the singleton app storage instance
 * This is the recommended way to access app storage throughout the application
 */
export function getAppStorage(): AppStorage {
    if (!appStorageInstance) {
        appStorageInstance = createAppStorage();
    }
    return appStorageInstance;
}

/**
 * Reset the app storage instance (useful for testing or environment changes)
 */
export function resetAppStorageInstance(): void {
    appStorageInstance = null;
}
