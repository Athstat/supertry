
/** Gets storage key for saving team in local storage */
export function getMyTeamStorageKey(leagueRoundId: string, authUserId: string) {
    return `local-team-save-for-user-${authUserId}-for-round-${leagueRoundId}`;
}