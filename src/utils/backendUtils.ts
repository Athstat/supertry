import { authTokenService } from '../services/auth/authTokenService';

// Updated to use Django server instead of Node.js server
const BACKEND_SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Django default port

/** Completes an api url */
export function getUri(endPoint: string) {
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
      return (await res.json()) as {ping: string}
    }

  } catch (err) {
    console.log("Failed to reach server at ", getUri(''), err);
  }

  return undefined;
}