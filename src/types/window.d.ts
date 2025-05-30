// Type definitions for window extensions
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    ScrummyBridge?: {
      requestPushPermission(userData?: any): Promise<{
        granted: boolean;
        onesignal_id?: string;
      }>;
      login(
        tokens: { accessToken: string; refreshToken: string },
        userData: any
      ): Promise<{ success: boolean }>;
      logout(): Promise<{ success: boolean }>;
      getAuthStatus(): Promise<{
        isAuthenticated: boolean;
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          onesignal_id?: string;
        };
      }>;
      getDeviceId(): Promise<string>;
      postMessage(type: string, payload?: any): void;
      log(message: any): void;
    };
    scrummyBridge?: {
      requestPushPermission(userData?: any): Promise<{
        granted: boolean;
        onesignal_id?: string;
      }>;
      login(
        tokens: { accessToken: string; refreshToken: string },
        userData: any
      ): Promise<{ success: boolean }>;
      logout(): Promise<{ success: boolean }>;
      getAuthStatus(): Promise<{
        isAuthenticated: boolean;
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          onesignal_id?: string;
        };
      }>;
      getDeviceId(): Promise<string>;
      postMessage(type: string, payload?: any): void;
      log(message: any): void;
    };
  }
}

export {};
