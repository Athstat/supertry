import { useEffect } from 'react';

/**
 * Hook to manage body scroll locking when modal is visible
 * 
 * @param visible Whether the modal is currently visible
 */
export const useModalEffects = (visible: boolean) => {
  // Disable scrolling on the main page when modal is open
  useEffect(() => {
    if (visible) {
      // Save current scroll position and disable scrolling on body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      
      // Cleanup function to re-enable scrolling when modal is closed
      return () => {
        // Restore scroll position and enable scrolling
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [visible]);
};

export default useModalEffects;
