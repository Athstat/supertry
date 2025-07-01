import { useSetAtom } from 'jotai'
import { ISeason } from '../../types/games'
import { seasonAthletesAtoms, seasonAtom, seasonFixtutesAtoms, seasonTeamsAtoms } from '../../state/season.atoms'
import { ReactNode, useEffect } from 'react'
import useSWR from 'swr'
import { getSeasonAthletes, getSeasonFixtures, getSeasonTeams } from '../../services/seasonsService'
import { LoadingState } from '../ui/LoadingState'

type Props = {
    season: ISeason,
    children?: ReactNode
}

/** Provides data for a season */
export default function SeasonDataProvider({season, children}: Props) {

    const setSeason = useSetAtom(seasonAtom);
    const setSeasonTeams = useSetAtom(seasonTeamsAtoms);
    const setSeasonFixtures = useSetAtom(seasonFixtutesAtoms);
    const setSeasonAthletes = useSetAtom(seasonAthletesAtoms);

    const seasonTeamsKey = `seasons-teams/${season.id}`;
    const {data: teams, isLoading: loadingTeams} = useSWR(seasonTeamsKey, () => getSeasonTeams(season.id));
    const {data: fixtures, isLoading: loadingFixtures} = useSWR(seasonTeamsKey, () => getSeasonFixtures(season.id));
    const {data: athletes, isLoading: loadingAthletes} = useSWR(seasonTeamsKey, () => getSeasonAthletes(season.id));

    const isLoading = loadingTeams || loadingAthletes || loadingFixtures;

    useEffect(() => {
        if (season) setSeason(season);
        if (teams) setSeasonTeams(teams);
        if (fixtures) setSeasonFixtures(fixtures);
        if (athletes) setSeasonAthletes
    }, [season, teams, athletes, fixtures]);

    if (isLoading) return <LoadingState />

  return (
    <>
        {children}
    </>
  )
}
