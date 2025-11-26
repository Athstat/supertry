import { atom } from 'jotai';
import { FantasyLeagueGroup, FantasyLeagueGroupMember } from '../../types/fantasyLeagueGroups';
import { authService } from '../../services/authService';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../types/leagueConfig';

/** Holds a fantasy league group */
export const fantasyLeagueGroupAtom = atom<FantasyLeagueGroup>();

/** Holds the members of a fantasy league group */
export const fantasyLeagueGroupMembersAtom = atom<FantasyLeagueGroupMember[]>([]);

/** Holds the currently logged in user's members record */
export const currGroupMemberAtom = atom<FantasyLeagueGroupMember | undefined>(get => {
  const members = get(fantasyLeagueGroupMembersAtom);

  const authUser = authService.getUserInfoSync();

  return members.find(m => m.user_id === authUser?.kc_id);
});

/** Holds the rounds of a fantasy league group */
export const fantasyLeagueGroupRoundsAtom = atom<IFantasyLeagueRound[]>([]);

/** Holds the fantasy league config atom */
export const fantasyLeagueConfigAtom = atom<IGamesLeagueConfig>();