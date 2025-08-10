import { useAtomValue } from "jotai";
import { currGroupMemberAtom, fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom } from "../../state/fantasy/fantasyLeagueGroup.atoms";

/** Hook that provides fantasy league group info. Should be used with in the fantasy league group provider */
export function useFantasyLeagueGroup() {
    const league = useAtomValue(fantasyLeagueGroupAtom);
    const members = useAtomValue(fantasyLeagueGroupMembersAtom);
    const rounds = useAtomValue(fantasyLeagueGroupRoundsAtom);
    const userMemberRecord = useAtomValue(currGroupMemberAtom);

    return {
        league,
        members,
        rounds,
        userMemberRecord
    }
}