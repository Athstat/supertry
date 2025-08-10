import { useAtom, useAtomValue } from "jotai";
import { fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom } from "../../state/fantasy/fantasyLeagueGroup.atoms";
import { useMemo } from "react";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { useAuth } from "../../contexts/AuthContext";

/** Hook that provides fantasy league group info. Should be used with in the fantasy league group provider */
export function useFantasyLeagueGroup() {
    const {authUser} = useAuth();
    const [league, setLeague] = useAtom(fantasyLeagueGroupAtom);
    const members = useAtomValue(fantasyLeagueGroupMembersAtom);
    const rounds = useAtomValue(fantasyLeagueGroupRoundsAtom);

    const userMemberRecord = useMemo(() => {
        return members.find((m) => {
            return m.user_id === authUser?.kc_id
        })
    }, [authUser, members]);


    const sortedRounds = useMemo(() => {
        return [...rounds].sort((a, b) => {
            const aStart = a.start_round;
            const bStart = b.start_round;

            return (aStart ?? 0) - (bStart ?? 0);
        })
    }, [rounds]);

    const currentRound = useMemo(() => {
        // The first open round we encounter
        // if all rounds are have ended, go to the last round
        // if all rounds are not yet open but they have not ended, use first round

        const openRounds = sortedRounds.filter((r) => {
            return r.is_open === true;
        });

        if (openRounds.length > 0) {
            return openRounds[0];
        }

        const endedRounds = sortedRounds.filter((r) => {
            return r.has_ended === true
        });

        if (endedRounds.length === sortedRounds.length) {
            return endedRounds[endedRounds.length - 1];
        }

        return undefined;
    }, [rounds]);


    const mutateLeague = (newLeague: FantasyLeagueGroup) => {
        setLeague(newLeague);
    }

    return {
        league,
        members,
        rounds,
        userMemberRecord,
        currentRound,
        sortedRounds,
        isMember: userMemberRecord !== undefined,
        isAdminMember: userMemberRecord?.is_admin === true,
        mutateLeague
    }
}