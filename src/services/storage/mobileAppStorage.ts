import { AppStorage } from "./appStorage.interface";

/** Mobile Implementation of app storage using the ScrummyBridge */
export class MobileAppStorage implements AppStorage {
    private getBridge() {
        return window.ScrummyBridge || window.scrummyBridge;
    }

    private isBridgeStorageAvailable(): boolean {
        const bridge = this.getBridge();
        return !!(bridge?.setStorageItem && bridge?.getStorageItem && bridge?.removeStorageItem);
    }

    public async setItem(key: string, value: string): Promise<void> {
        if (!this.isBridgeStorageAvailable()) {
            console.warn('MobileAppStorage: Bridge storage not available, falling back to localStorage');
            localStorage.setItem(key, value);
            return;
        }

        try {
            const bridge = this.getBridge();
            await bridge!.setStorageItem!(key, value);
        } catch (error) {
            console.error('MobileAppStorage: Error setting item via bridge, falling back to localStorage:', error);
            localStorage.setItem(key, value);
        }
    }

    public async getItem(key: string): Promise<string | null> {
        if (!this.isBridgeStorageAvailable()) {
            console.warn('MobileAppStorage: Bridge storage not available, falling back to localStorage');
            return localStorage.getItem(key);
        }

        try {
            const bridge = this.getBridge();
            return await bridge!.getStorageItem!(key);
        } catch (error) {
            console.error('MobileAppStorage: Error getting item via bridge, falling back to localStorage:', error);
            return localStorage.getItem(key);
        }
    }

    public async removeItem(key: string): Promise<void> {
        if (!this.isBridgeStorageAvailable()) {
            console.warn('MobileAppStorage: Bridge storage not available, falling back to localStorage');
            localStorage.removeItem(key);
            return;
        }

        try {
            const bridge = this.getBridge();
            await bridge!.removeStorageItem!(key);
        } catch (error) {
            console.error('MobileAppStorage: Error removing item via bridge, falling back to localStorage:', error);
            localStorage.removeItem(key);
        }
    }
}
