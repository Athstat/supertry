import { useEffect } from 'react';
import { useImageCache } from './useImageCache';
import { IProAthlete } from '../../types/athletes';

interface UseImagePreloaderProps {
  players: IProAthlete[];
  enabled?: boolean;
}

export const useImagePreloader = ({ players, enabled = true }: UseImagePreloaderProps) => {
  const { loadImage } = useImageCache();

  useEffect(() => {
    if (!enabled || players.length === 0) return;

    // Preload images in the background
    const preloadImages = async () => {
      const imageUrls = players
        .map(player => player.image_url)
        .filter(Boolean) as string[];

      // Load images with a small delay to avoid overwhelming the network
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, i * 100)); // 100ms delay between each
          await loadImage(imageUrls[i]);
        } catch (error) {
          // Silently fail for preloading - images will load normally when needed
          console.debug(`Failed to preload image: ${imageUrls[i]}`);
        }
      }
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 1000); // Wait 1 second before preloading
    }
  }, [players, enabled, loadImage]);
};
