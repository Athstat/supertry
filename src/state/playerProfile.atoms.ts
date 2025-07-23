import { atom } from "jotai";
import { IAthleteSeasonStarRatings, IProAthlete } from "../types/athletes";
import { SportAction } from "../types/sports_actions";
import { IProSeason } from "../types/season";

// Optional default if profile is not loaded yet
export const playerProfilePlayerAtom = atom<IProAthlete>();

// All Time Stats
export const playerProfileCareerStatsAtom = atom<SportAction[]>([]);
export const playerProfileCareerStarRatings = atom<IAthleteSeasonStarRatings[]>([]);

export const playerProfileCareerSeasons = atom<IProSeason[]>((get) => {
  const stats = get(playerProfileCareerStatsAtom);
  const seasonMap = new Map<string, IProSeason>();

  stats.forEach((s) => {
    if (!seasonMap.has(s.season.id)) {
      seasonMap.set(s.season.id, s.season);
    }
  });

  return Array.from(seasonMap.values());
});

// Current Season
export const playerProfileCurrSeason = atom<IProSeason | undefined>((get) => {
  const sorted = [...get(playerProfileCareerSeasons)].sort((a, b) =>
    new Date(b.end_date).valueOf() - new Date(a.end_date).valueOf()
  );

  return sorted.length > 0 ? sorted[0] : undefined;
});

// Current Season Stats
export const playerProfileCurrStatsAtom = atom<SportAction[]>((get) => {
  const stats = get(playerProfileCareerStatsAtom);
  const currSeason = get(playerProfileCurrSeason);
  return stats.filter((s) => s.season.id === currSeason?.id);
});

// Current Season Star Ratings
export const playerProfileCurrStarRatings = atom<IAthleteSeasonStarRatings | undefined>((get) => {
  const currSeason = get(playerProfileCurrSeason);
  return get(playerProfileCareerStarRatings).find((sr) => sr.season_id === currSeason?.id);
});

export const playerProfileStatsLoadingAtom = atom<boolean>(false);


export const playerProfileAtomsGroup = {
    playerProfilePlayerAtom,
    playerProfileCareerStarRatings,
    playerProfileCareerStatsAtom,
    playerProfileCareerSeasons,
    playerProfileCurrSeason,
    playerProfileCurrStatsAtom,
    playerProfileCurrStarRatings,
    playerProfileStatsLoadingAtom
}