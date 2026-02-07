import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { DjangoUserMinimal } from "../../../types/auth"
import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { getSlotsFromTeam } from "../../../utils/fantasy/myteamUtils"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"

type MyTeamContextProps = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    slots: IFantasyLeagueTeamSlot[],
    setSlots: Dispatch<SetStateAction<IFantasyLeagueTeamSlot[]>>,
    selectedPlayer?: IFantasyTeamAthlete,
    setSelectedPlayer: (val?: IFantasyTeamAthlete) => void,

}

export const MyTeamContext = createContext<MyTeamContextProps | null>(null);

type Props = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    children?: ReactNode
}

export default function MyTeamProvider({team, manager, round, children} : Props) {
    const [slots, setSlots] = useState<IFantasyLeagueTeamSlot[]>(getSlotsFromTeam(team));
    const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete | undefined>(undefined);

    return (
        <MyTeamContext.Provider
            value={{
                team, manager, round, slots, 
                setSlots, setSelectedPlayer, selectedPlayer
            }}
        >
            {children}
        </MyTeamContext.Provider>
    )
}