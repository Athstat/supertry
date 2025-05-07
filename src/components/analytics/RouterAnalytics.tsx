import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { analytics } from '../../services/anayticsService';

/** Tracks page visits */
export default function PageVisitsTracker() {

    const location = useLocation();

    useEffect(() => {
        analytics.trackPageVisit(location.pathname);
    }, [location]);

    return (
        <></>
    )
}
