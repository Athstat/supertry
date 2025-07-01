import { useSetAtom } from 'jotai'
import { ISeason } from '../../types/games'
import { seasonAtom } from '../../state/season.atoms'
import { ReactNode, useEffect } from 'react'

type Props = {
    season: ISeason,
    children?: ReactNode
}

/** Provides data for a season */
export default function SeasonDataProvider({season, children}: Props) {

    const setSeason = useSetAtom(seasonAtom);

    useEffect(() => {
        if (season) setSeason(season);
    }, [season]);

  return (
    <>
        {children}
    </>
  )
}
