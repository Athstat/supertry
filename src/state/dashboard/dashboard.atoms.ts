import { atom } from 'jotai';
import { IFantasySeason, ISeasonRound } from '../../types/fantasy/fantasySeason';

/** Holds the current season Atom */
const currentSeasonAtom = atom<IFantasySeason>();
const currentSeasonRoundAtom = atom<ISeasonRound>();
const seasonRoundsAtom = atom<ISeasonRound[]>([]);
const isDashboardLoadingAtom = atom<boolean>(false);

/** Holds the selected competition/season on the dashboard */
const selectedDashboardSeasonAtom = atom<IFantasySeason | undefined>(undefined);

export const fantasySeasonsAtoms = {
  currentSeasonAtom,
  currentSeasonRoundAtom,
  isDashboardLoadingAtom,
  seasonRoundsAtom,
  selectedDashboardSeasonAtom,
};
