import { AppStorage } from "./appStorage.interface";

/** Web Implementation of app storage */
export class WebAppStorage implements AppStorage {
    public async setItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
    }

    public async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }

    public async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

}