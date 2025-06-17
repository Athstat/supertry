import { getAuthHeader, getUri } from '../utils/backendUtils';

/**
 * Simple API wrapper for making HTTP requests
 */
export const api = {
  /**
   * Make a GET request
   */
  get: async (endpoint: string, params?: Record<string, string>) => {
    let url = getUri(endpoint);

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    return await response.json();
  },

  /**
   * Make a POST request
   */
  post: async (endpoint: string, data: any) => {
    const response = await fetch(getUri(endpoint), {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    return await response.json();
  },

  /**
   * Make a PUT request
   */
  put: async (endpoint: string, data: any) => {
    const response = await fetch(getUri(endpoint), {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    return await response.json();
  },

  /**
   * Make a DELETE request
   */
  delete: async (endpoint: string) => {
    const response = await fetch(getUri(endpoint), {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    return await response.json();
  },
};
