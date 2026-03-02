import { authTokenService } from '../services/auth/authTokenService';

const DEV = import.meta.env.DEV;

/** Falls back to local dev to prevent unintentional production backend calls */
const FALLBACK_BACKEND_SERVER_URL = "http://localhost:8000";
const BACKEND_SERVER_URL = import.meta.env.VITE_API_BASE_URL || FALLBACK_BACKEND_SERVER_URL;

/** Completes an api url */
export function getUri(endPoint: string) {
  // In dev, return a relative path so Vite's proxy forwards to Django (avoids CORS and emulator host issues)
  if (DEV) return endPoint;
  return `${BACKEND_SERVER_URL}${endPoint}`;
}

export function getUriLocal(endPoint: string) {
  return `http://localhost:8000${endPoint}`; // Updated to Django port
}

export function getAuthHeader(accessTokenFromParams?: string) {
  const accessToken = accessTokenFromParams ?? authTokenService.getAccessToken();

  const authHeader = {
    Authorization: `Token ${accessToken}`,
  };

  return {
    'Content-Type': 'application/json',
    ...(accessToken ? authHeader : {}),
  };
}

export function getAuthHeaderFormMultipart(accessTokenFromParams?: string) {
  const accessToken = accessTokenFromParams ?? authTokenService.getAccessToken();

  const authHeader = {
    Authorization: `Token ${accessToken}`,
  };

  return {
    ...(accessToken ? authHeader : {}),
  };
}

export function applicationJsonHeader() {
  return {
    'Content-Type': 'application/json',
  };
}

export async function pingServer() {
  try {
    const uri = getUri(`/api/v1/ping`);
    const res = await fetch(uri);

    if (res.ok) {
      return (await res.json()) as { ping: string };
    }
  } catch (err) {
    console.log(
      'Failed to reach server at ',
      DEV ? '(dev relative via Vite proxy)' : getUri(''),
      err
    );
  }

  return undefined;
}
