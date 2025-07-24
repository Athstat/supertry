/** Defines a contract for how app storage should work */
export interface AppStorage {
    setItem(key: string, value: string) : Promise<void>,
    getItem(key: string) : Promise<string | null>,
    removeItem(key: string) : Promise<void>
}