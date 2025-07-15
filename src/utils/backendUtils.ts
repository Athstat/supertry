import { authTokenService } from "../services/auth/authTokenService";

const BACKEND_SERVER_URL =
  import.meta.env.VITE_API_BASE_URL || "https://athstat-games-server.onrender.com";

/** Completes an api url */
export function getUri(endPoint: string) {
  return `${BACKEND_SERVER_URL}${endPoint}`;
}

export function getUriLocal(endPoint: string) {
  return `http://localhost:5005${endPoint}`;
}

export function getAuthHeader() {

  const accessToken = authTokenService.getAccessToken();

  const authHeader = {
    'Authorization': `Token ${accessToken}`
  };

  return {
    "Content-Type": "application/json",
    ... (accessToken ? authHeader : {})
  };
}

export function applicationJsonHeader() {
  return {
    "Content-Type": "application/json",
  };
}
