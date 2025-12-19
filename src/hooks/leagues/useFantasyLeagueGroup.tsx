import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  currGroupMemberAtom,
  fantasyLeagueConfigAtom,
  fantasyLeagueGroupAtom,
  fantasyLeagueGroupLoadingAtom,
  fantasyLeagueGroupMembersAtom,
  fantasyLeagueGroupRoundsAtom,
} from '../../state/fantasy/fantasyLeagueGroup.atoms';
import { useMemo } from 'react';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { useAuth } from '../../contexts/AuthContext';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';

/** Hook that provides fantasy league group info. Should be used with in the fantasy league group provider */
export function useFantasyLeagueGroup() {
  const {authUser} = useAuth();

  const [league, setLeague] = useAtom(fantasyLeagueGroupAtom);
  const members = useAtomValue(fantasyLeagueGroupMembersAtom);
  const rounds = useAtomValue(fantasyLeagueGroupRoundsAtom);
  const userMemberRecord = useAtomValue(currGroupMemberAtom);
  const setRounds = useSetAtom(fantasyLeagueGroupRoundsAtom);

  const leagueConfig = useAtomValue(fantasyLeagueConfigAtom);
  const isLoading = useAtomValue(fantasyLeagueGroupLoadingAtom);

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

  const previousRound = useMemo(() => {
    if (currentRound) {
      const prevRoundNum = (currentRound.start_round || 0) - 1;
      return rounds.find((r) => r.start_round === prevRoundNum);
    }

    return undefined;
  }, [currentRound, rounds]);

  const isMember = useMemo(() => {
    return members.find((r) => {
      return r.user_id === authUser?.kc_id
    })
  }, [members, authUser]);

  const scoringRound = useMemo(() => {
    if (currentRound && isLeagueRoundLocked(currentRound)) {
      return currentRound;
    }

    return previousRound || currentRound;
  }, [currentRound, previousRound]);

  return {
    league,
    members,
    rounds,
    userMemberRecord,
    currentRound,
    sortedRounds,
    isMember,
    isAdminMember: userMemberRecord?.is_admin === true,
    mutateLeague,
    refreshRounds,
    isOfficialLeague,
    leagueConfig,
    isLoading,
    previousRound,
    scoringRound
  };
}
