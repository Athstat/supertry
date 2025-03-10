import { UserRepresentation } from "../types/auth";

// The API already includes the /api prefix
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "athstat-frontend";
const KEYCLOAK_URL =
  import.meta.env.VITE_AUTH_KEYCLOAK_URL ||
  "https://keycloak-sandbox.athstat-next.com";
const KEYCLOAK_REALM =
  import.meta.env.VITE_AUTH_KEYCLOAK_REALM || "athstat-games";

export const authService = {
  /**
   * Register a new user with Keycloak
   */
  async registerUser(userData: UserRepresentation): Promise<any> {
    try {
      // Use the full URL in production, relative URL in development
      const baseUrl = import.meta.env.PROD
        ? "https://qa-games-app.athstat-next.com"
        : "";

      const response = await fetch(
        `${baseUrl}/api/v1/unauth/create-keycloak-user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Get the text response for better debugging
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Please check server configuration."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Login with Keycloak
   */
  async login(username: string, password: string): Promise<any> {
    try {
      // Use the token URL directly if available, otherwise construct it
      const tokenUrl =
        import.meta.env.VITE_KEYCLOAK_TOKEN_URL ||
        `${KEYCLOAK_URL}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

      console.log("Using token URL:", tokenUrl);

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: import.meta.env.VITE_GRANT_TYPE || "password",
          client_id: CLIENT_ID,
          username,
          password,
          scope: import.meta.env.VITE_SCOPE || "openid",
        }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || "Login failed");
      }

      const data = await response.json();

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated by verifying token existence and validity
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      // Basic validation - check if token is expired
      // This is a simple check, for production you might want to validate with the server
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds

      if (Date.now() >= expiry) {
        // Token is expired, try to refresh
        this.refreshToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  /**
   * Attempt to refresh the token using the refresh token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const tokenUrl =
        import.meta.env.VITE_KEYCLOAK_TOKEN_URL ||
        `${KEYCLOAK_URL}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: CLIENT_ID,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        // If refresh fails, clear tokens
        this.logout();
        return false;
      }

      const data = await response.json();

      // Store new tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      return false;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  /**
   * Get user info from the token
   */
  getUserInfo(): {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  } | null {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        email: payload.email || "",
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        username: payload.preferred_username || "",
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },
};
