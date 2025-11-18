// ATOMS for Predictions Comparison

import { atom } from 'jotai';
import { LeaguePredictionRanking } from '../types/fantasyLeagueGroups';

export type PredictionsCompareMode = 'none' | 'picking' | 'modal';

/** Holds the users to compare */
export const compareUsersAtom = atom<LeaguePredictionRanking[]>([]);

/** Holds a string representing the state of the predictions compare
 * which can either be none, picking and modal */
export const compareModePredictionsAtom = atom<PredictionsCompareMode>('none');

/** Holds a boolean value that flags whether the compare mode
 * is on picking */
export const isCompareModePredictionsPicking = atom<boolean>(get => {
  return get(compareModePredictionsAtom) === 'picking';
});

/** Holds a boolean value that flags whether the compare mode
 * is on modal */
export const isCompareModePredictionsModal = atom<boolean>(get => {
  return get(compareModePredictionsAtom) === 'modal';
});

/** A map of user id and the user object itself as a map */
export const compareUsersMapAtom = atom<Map<string, LeaguePredictionRanking>>(get => {
  const users = get(compareUsersAtom);
  const map: Map<string, LeaguePredictionRanking> = new Map();

  users.forEach(u => {
    map.set(u.user_id, u);
  });

  return map;
});

/** Object that holds all compare predictions feature atoms */
export const comparePredictionsAtomGroup = {
  compareUsersAtom,
  compareModePredictionsAtom,
  isCompareModePredictionsPicking,
  isCompareModePredictionsModal,
  compareUsersMapAtom,
};
