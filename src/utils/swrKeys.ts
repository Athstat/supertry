/** provides functions to get keys for different swr fetch keys */

export const swrFetchKeys = {
    getSbrUserMotmVoteKey: (fixtureId: string) => {
        return `user-sbr-fixture-motm-vote/${fixtureId}`;
    },

    getAllFixtureMotmVotesKey: (fixtureId: string) => {
        return `sbr-fixture-motm-votes/${fixtureId}`;
    }
}