import { useAtomValue } from "jotai";
import { fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom } from "../../state/fantasy/fantasyLeagueGroup.atoms";

/** Hook that provides fantasy league group info. Should be used with in the fantasy league group provider */
export function useFantasyLeagueGroup() {
    const league = useAtomValue(fantasyLeagueGroupAtom);
    const members = useAtomValue(fantasyLeagueGroupMembersAtom);
    const rounds = useAtomValue(fantasyLeagueGroupRoundsAtom);

    return {
        league,
        members,
        rounds
    }
}