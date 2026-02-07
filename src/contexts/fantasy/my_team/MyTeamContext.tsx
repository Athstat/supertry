import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { DjangoUserMinimal } from "../../../types/auth"
import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { getSlotsFromTeam } from "../../../utils/fantasy/myteamUtils"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { IFixture } from "../../../types/games"

type MyTeamContextProps = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    slots: IFantasyLeagueTeamSlot[],
    setSlots: Dispatch<SetStateAction<IFantasyLeagueTeamSlot[]>>,
    selectedPlayer?: IFantasyTeamAthlete,
    setSelectedPlayer: (val?: IFantasyTeamAthlete) => void,
    roundGames: IFixture[],
    isReadOnly: boolean

}

export const MyTeamContext = createContext<MyTeamContextProps | null>(null);

type Props = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    children?: ReactNode,
    isReadOnly?: boolean,
    roundGames: IFixture[]
}

export default function MyTeamProvider({team, manager, round, children, isReadOnly = false, roundGames = []} : Props) {
    const [slots, setSlots] = useState<IFantasyLeagueTeamSlot[]>(getSlotsFromTeam(team));
    const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete | undefined>(undefined);



    return (
        <MyTeamContext.Provider
            value={{
                team, manager, round, slots, 
                setSlots, setSelectedPlayer, selectedPlayer,
                isReadOnly, roundGames
            }}
        >
            {children}
        </MyTeamContext.Provider>
    )
}