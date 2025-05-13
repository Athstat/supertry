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
  return {
    "Content-Type": "application/json",
    // Add authorization if needed
    ...(localStorage.getItem("access_token") && {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    }),
  };
}
