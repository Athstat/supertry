/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode } from "react"
import { SportAction } from "../types/sports_actions"

type ContextProps = {
    seasonStats: SportAction[],
    isLoading?: boolean
}

export const PlayerSeasonStatsContext = createContext<ContextProps | null>(null);

type Props = {
    seasonStats: SportAction[],
    isLoading?: boolean,
    children?: ReactNode
}

export default function PlayerSeasonStatsProvider({seasonStats, isLoading, children} : Props) {
  return (
    <PlayerSeasonStatsContext.Provider
        value={{seasonStats, isLoading}}
    >
        {children}
    </PlayerSeasonStatsContext.Provider>
  )
}
