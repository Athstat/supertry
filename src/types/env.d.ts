/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_AUTH_KEYCLOAK_URL: string;
  readonly VITE_AUTH_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_TOKEN_URL: string;
  readonly VITE_GRANT_TYPE: string;
  readonly VITE_SCOPE: string;
  readonly VITE_SEND_BIRD_APP_ID: string;
  readonly VITE_APP_ENV: "production" | "qa" | "development";
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    deviceId?: string;
  }
}

export {}; // This file needs to be a module
