import { analytics } from "./anayticsService";

export const authAnalytics = {
    trackClaimGuestAccountStarted: () => {
        analytics.track('Claim_Guest_Account_Started')
    },

    trackClaimGuestAccountCompleted: (startTime: Date, endTime: Date) => {

        const duration = startTime && endTime ? new Date(endTime).valueOf() - new Date(startTime).valueOf() : 0;
        const durationMinutes = duration / 1000;

        analytics.track('Claim_Guest_Account_Completed', {
            durationMinutes,
            durationEpoch: duration
        });
    },

    trackClaimGuestAccountCanceled: (startTime: Date, endTime: Date, lastStep: number) => {
        const duration = startTime && endTime ? new Date(endTime).valueOf() - new Date(startTime).valueOf() : 0;
        const durationMinutes = duration / 1000;

        analytics.track('Claim_Guest_Account_Canceled', {
            durationMinutes,
            durationEpoch: duration,
            lastStep: lastStep
        });
    },

    trackClickedClaimAccountCTA: () => {
        analytics.track('Clicked_Claim_Account_CTA');
    }
}