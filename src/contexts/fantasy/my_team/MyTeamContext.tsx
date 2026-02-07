import { createContext, ReactNode, useState } from "react"
import { DjangoUserMinimal } from "../../../types/auth"
import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { getSlotsFromTeam } from "../../../utils/fantasy/myteamUtils"

type MyTeamContextProps = {
    team: IFantasyLeagueTeam,
    manager: DjangoUserMinimal,
    round?: ISeasonRound,
    slots: IFantasyLeagueTeamSlot[],
    setSlots: (val: IFantasyLeagueTeamSlot[]) => void
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

    return (
        <MyTeamContext.Provider
            value={{team, manager, round, slots, setSlots}}
        >
            {children}
        </MyTeamContext.Provider>
    )
}