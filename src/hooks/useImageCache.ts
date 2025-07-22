import { useCallback, useRef, useState } from 'react';

interface ImageCacheEntry {
  url: string;
  blob: string;
  timestamp: number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached images

class ImageCache {
  private cache = new Map<string, ImageCacheEntry>();

  get(url: string): string | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(url);
      URL.revokeObjectURL(entry.blob);
      return null;
    }

    return entry.blob;
  }

  set(url: string, blob: string): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        const oldEntry = this.cache.get(oldestKey);
        if (oldEntry) {
          URL.revokeObjectURL(oldEntry.blob);
          this.cache.delete(oldestKey);
        }
      }
    }

    this.cache.set(url, {
      url,
      blob,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.forEach(entry => URL.revokeObjectURL(entry.blob));
    this.cache.clear();
  }
}

// Global cache instance
const globalImageCache = new ImageCache();

export interface UseImageCacheReturn {
  loadImage: (url: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearCache: () => void;
}

export const useImageCache = (): UseImageCacheReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadImage = useCallback(async (url: string): Promise<string> => {
    // Check cache first
    const cachedUrl = globalImageCache.get(url);
    if (cachedUrl) {
      return cachedUrl;
    }

    setIsLoading(true);
    setError(null);

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'public, max-age=31536000', // 1 year
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Cache the result
      globalImageCache.set(url, objectUrl);

      setIsLoading(false);
      return objectUrl;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't set error
        return url; // Return original URL as fallback
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearCache = useCallback(() => {
    globalImageCache.clear();
  }, []);

  return {
    loadImage,
    isLoading,
    error,
    clearCache,
  };
};
