import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  currGroupMemberAtom,
  fantasyLeagueGroupAtom,
  fantasyLeagueGroupMembersAtom,
  fantasyLeagueGroupRoundsAtom,
} from '../../state/fantasy/fantasyLeagueGroup.atoms';
import { useMemo } from 'react';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';

/** Hook that provides fantasy league group info. Should be used with in the fantasy league group provider */
export function useFantasyLeagueGroup() {
  const [league, setLeague] = useAtom(fantasyLeagueGroupAtom);
  const members = useAtomValue(fantasyLeagueGroupMembersAtom);
  const rounds = useAtomValue(fantasyLeagueGroupRoundsAtom);
  const userMemberRecord = useAtomValue(currGroupMemberAtom);
  const setRounds = useSetAtom(fantasyLeagueGroupRoundsAtom);

  const sortedRounds = useMemo(() => {
    return [...rounds].sort((a, b) => {
      const aStart = a.start_round;
      const bStart = b.start_round;

      return (aStart ?? 0) - (bStart ?? 0);
    });
  }, [rounds]);

  const currentRound = useMemo(() => {
    // The first open round we encounter
    // if all rounds are have ended, go to the last round
    // if all rounds are not yet open but they have not ended, use first round


    const openRounds = sortedRounds.filter(r => {
      return r.is_open === true;
    });

    if (openRounds.length > 0) {
      return openRounds[0];
    }

    const endedRounds = sortedRounds.filter(r => {
      return r.has_ended === true;
    });

    if (endedRounds.length === sortedRounds.length) {
      return endedRounds[endedRounds.length - 1];
    }

    // TODO: Change this Back

    return undefined;
  }, [sortedRounds]);

  const mutateLeague = (newLeague: FantasyLeagueGroup) => {
    setLeague(newLeague);
  };

  const refreshRounds = async (targetLeagueId?: string) => {
    const id = targetLeagueId ?? league?.id;
    if (!id) return;
    const fetched = await fantasyLeagueGroupsService.getGroupRounds(id);
    setRounds(fetched);
    return fetched;
  };

  const isOfficialLeague = useMemo(() => {
    return league?.type === 'official_league';
  }, [league]);

  return {
    league,
    members,
    rounds,
    userMemberRecord,
    currentRound,
    sortedRounds,
    isMember: userMemberRecord !== undefined,
    isAdminMember: userMemberRecord?.is_admin === true,
    mutateLeague,
    refreshRounds,
    isOfficialLeague
  };
}
