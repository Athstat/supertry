import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom'
import { analytics } from '../../services/anayticsService';

const reffererIdKey = "rfr";

/** Tracks page visits */
export default function PageVisitsTracker() {

    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        analytics.trackPageVisit(location.pathname);

        if (searchParams.has(reffererIdKey)) {
            const reffer = searchParams.get(reffererIdKey) ?? "";
            const refferId = atob(reffer) as string;

            console.log("Actual user id ", refferId)

            analytics.trackFriendInvitesReceived("Link", refferId);
        }

    }, [location, searchParams]);

    return (
        <></>
    )
}
