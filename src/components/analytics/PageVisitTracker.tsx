import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { analytics } from '../../services/analytics/anayticsService';
import { logger } from '../../services/logger';
import { useAppState } from '../../contexts/app_state/AppStateContext';

const reffererIdKey = 'rfr';

/** Tracks page visits */
export default function PageVisitsTracker() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isActive } = useAppState();

  // Track page visits when location changes or when app becomes active
  useEffect(() => {
    try {
      // Track page visit with error handling
      analytics.trackPageVisit(location.pathname);

      // Handle referrer tracking with error handling
      if (searchParams.has(reffererIdKey)) {
        try {
          const reffer = searchParams.get(reffererIdKey) ?? '';
          const refferId = atob(reffer);

          analytics.trackFriendInvitesReceived('Link', refferId);
        } catch (error) {
          console.error('Failed to process referrer ID:', error);
          // Continue execution even if referrer processing fails
        }
      }
    } catch (error) {
      console.error('Error in page visit tracking:', error);
      // Prevent the error from bubbling up and potentially causing UI issues
    }
  }, [location, searchParams]);

    // Track page visits when the app becomes active
    // This is now managed by the AppStateContext, but we still want to track page visits
    // when the app becomes active for analytics purposes
    useEffect(() => {
        if (isActive) {
            try {
                analytics.trackPageVisit(location.pathname);
                // console.log('PageVisitsTracker: Tracked page visit after app became active');
            } catch (error) {
                logger.error("Error tracking page visit after app became active:", error);
            }
        }
    }, [isActive, location.pathname]);

  return <></>;
}
