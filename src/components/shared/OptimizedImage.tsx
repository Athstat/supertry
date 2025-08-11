import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { twMerge } from 'tailwind-merge';
import { useImageCache } from '../../hooks/useImageCache';
import ScrummyLogo from '../branding/scrummy_logo';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  lazy?: boolean;
  threshold?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  onLoad,
  onError,
  lazy = true,
  threshold = 0.1,
}: OptimizedImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { loadImage } = useImageCache();
  const imgRef = useRef<HTMLImageElement>(null);

  const [error, setError] = useState<boolean>(false);

  // Intersection observer for lazy loading
  const { ref: inViewRef, inView } = useInView({
    threshold,
    triggerOnce: true,
    skip: !lazy,
  });

  // Combine refs
  const setRefs = (element: HTMLImageElement | null) => {
    if (imgRef.current !== element) {
      (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = element;
    }
    inViewRef(element);
  };

  // Load image when in view or immediately if lazy loading is disabled
  useEffect(() => {
    if (!src || (lazy && !inView)) return;

    let isMounted = true;

    const loadImageAsync = async () => {
      try {
        setImageState('loading');
        const cachedSrc = await loadImage(src);
        
        if (isMounted) {
          setImageSrc(cachedSrc);
          setImageState('loaded');
          onLoad?.();
        }
      } catch (error) {
        if (isMounted) {
          setImageState('error');
          const errorMessage = error instanceof Error ? error.message : 'Failed to load image';
          onError?.(errorMessage);
        }
      }
    };

    loadImageAsync();

    return () => {
      isMounted = false;
    };
  }, [src, inView, lazy, loadImage, onLoad, onError]);

  // Render loading placeholder
  if (imageState === 'loading' || !imageSrc) {
    return (
      <div
        ref={setRefs}
        className={twMerge(
          'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800',
          'animate-pulse',
          className
        )}
      />
    );
  }

  if (error) {
    return (
      <div>
        <ScrummyLogo />
      </div>
    )
  }

  // Render loaded image
  return (
    <img
      ref={setRefs}
      src={imageSrc}
      alt={alt}
      className={twMerge(
        'transition-opacity duration-300 ease-in-out opacity-0',
        imageState === 'loaded' && 'opacity-100',
        className
      )}
      onLoad={() => {
        setImageState('loaded');
        onLoad?.();
      }}
      onError={() => {
        setError(error)
      }}
    />
  );
};

export default OptimizedImage;
