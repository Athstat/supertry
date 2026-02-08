import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { DjangoUserMinimal } from "../../../types/auth"
import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyLeagueTeamSlot, MyTeamSwapState } from "../../../types/fantasyLeagueTeam"
import { getSlotsFromTeam } from "../../../utils/fantasy/myteamUtils"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { IFixture } from "../../../types/games"
import { KeyedMutator } from "swr"

type MyTeamContextProps = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    slots: IFantasyLeagueTeamSlot[],
    setSlots: Dispatch<SetStateAction<IFantasyLeagueTeamSlot[]>>,
    selectedPlayer?: IFantasyTeamAthlete,
    setSelectedPlayer: (val?: IFantasyTeamAthlete) => void,
    roundGames: IFixture[],
    isReadOnly: boolean,
    onUpdateTeam?: KeyedMutator<IFantasyLeagueTeam | undefined>,
    swapState: MyTeamSwapState,
    setSwapState: Dispatch<SetStateAction<MyTeamSwapState>>
}

export const MyTeamContext = createContext<MyTeamContextProps | null>(null);

type Props = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    children?: ReactNode,
    isReadOnly?: boolean,
    roundGames: IFixture[],
    onUpdateTeam?: KeyedMutator<IFantasyLeagueTeam | undefined>
}

export default function MyTeamProvider({team, manager, round, children, isReadOnly = false, roundGames = [], onUpdateTeam} : Props) {
    const [slots, setSlots] = useState<IFantasyLeagueTeamSlot[]>(getSlotsFromTeam(team));
    const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete | undefined>(undefined);
    const [swapState, setSwapState] = useState<MyTeamSwapState>({slot: undefined});
    
    return (
        <MyTeamContext.Provider
            value={{
                team, manager, round, slots, 
                setSlots, setSelectedPlayer, selectedPlayer,
                isReadOnly, roundGames, onUpdateTeam, swapState,
                setSwapState
            }}
        >
            {children}
        </MyTeamContext.Provider>
    )
}