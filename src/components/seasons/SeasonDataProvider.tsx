import { useSetAtom } from 'jotai'
import { ISeason } from '../../types/games'
import { seasonAtom, seasonTeamsAtoms } from '../../state/season.atoms'
import { ReactNode, useEffect } from 'react'
import useSWR from 'swr'
import { getSeasonTeams } from '../../services/seasonsService'
import { LoadingState } from '../ui/LoadingState'

type Props = {
    season: ISeason,
    children?: ReactNode
}

/** Provides data for a season */
export default function SeasonDataProvider({season, children}: Props) {

    const setSeason = useSetAtom(seasonAtom);
    const setSeasonTeams = useSetAtom(seasonTeamsAtoms)

    const seasonTeamsKey = `seasons-teams/${season.id}`;
    const {data: teams, isLoading: loadingTeams} = useSWR(seasonTeamsKey, () => getSeasonTeams(season.id));

    const isLoading = loadingTeams;

    useEffect(() => {
        if (season) setSeason(season);
        if (teams) setSeasonTeams(teams);
    }, [season]);

    if (isLoading) return <LoadingState />

  return (
    <>
        {children}
    </>
  )
}
