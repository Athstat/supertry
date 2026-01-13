import { useSetAtom } from 'jotai'
import { seasonAthletesAtoms, seasonAtom, seasonFixtutesAtoms, seasonTeamsAtoms } from '../../state/season.atoms'
import { ReactNode, useEffect } from 'react'
import useSWR from 'swr'
import { seasonService } from '../../services/seasonsService'
import { LoadingIndicator } from '../ui/LoadingIndicator'
import { IProSeason } from '../../types/season'
import { useSeasonTeams } from '../../hooks/seasons/useSeasonTeams'

type Props = {
  season: IProSeason,
  children?: ReactNode
}

/** Provides data for a season */
export default function SeasonDataProvider({ season, children }: Props) {

  const setSeason = useSetAtom(seasonAtom);
  const setSeasonTeams = useSetAtom(seasonTeamsAtoms);
  const setSeasonFixtures = useSetAtom(seasonFixtutesAtoms);
  const setSeasonAthletes = useSetAtom(seasonAthletesAtoms);

  const seasonAthletesKey = `seasons-athletes/${season.id}`;
  const seasonFixutesKey = `seasons-fixtures/${season.id}`;
  const { teams, isLoading: loadingTeams } = useSeasonTeams();
  const { data: fixtures, isLoading: loadingFixtures } = useSWR(seasonFixutesKey, () => seasonService.getSeasonFixtures(season.id));
  const { data: athletes, isLoading: loadingAthletes } = useSWR(seasonAthletesKey, () => seasonService.getSeasonAthletes(season.id));

  const isLoading = loadingTeams || loadingAthletes || loadingFixtures;

  useEffect(() => {
    if (season) setSeason(season);
    if (teams) setSeasonTeams(teams);
    if (fixtures) setSeasonFixtures(fixtures);
    if (athletes) setSeasonAthletes(athletes);
  }, [season, teams, athletes, fixtures, setSeason, setSeasonTeams, setSeasonFixtures, setSeasonAthletes]);

  if (isLoading) return <LoadingIndicator />


  return (
    <>
      {children}
    </>
  )
}
