/** provides functions to get keys for different swr fetch keys */

export const swrFetchKeys = {
    getSbrUserMotmVoteKey: (fixtureId: string) => {
        return `user-sbr-fixture-motm-vote/${fixtureId}`;
    },

    getAllFixtureMotmVotesKey: (fixtureId: string) => {
        return `sbr-fixture-motm-votes/${fixtureId}`;
    },

    getSbrFixtureKey: (fixtureId: string) => {
        return `sbr-fixture/${fixtureId}`;
    },

    getProFixtureKey: (fixtureId: string) => {
        return `pro-fixture/${fixtureId}`;
    },

    getSbrFixtureEventsKey: (fixtureId: string) => {
        return `sbr-fixture-events/${fixtureId}`;
    },

    getSbrFixtureBoxscoreKey: (fixtureId: string) => {
        return `sbr-fixture-boxscore/${fixtureId}`;
    },

    getUserProPredictionsHistoryKey: (userId: string) => {
        return `/user-pro-prediction-history/${userId}`;
    },

    getAuthUserProfileKey: () => {
        return '/auth-user-profile';
    },

    getAllProAthletesKey: () => {
        return 'pro-athletes';
    }
}