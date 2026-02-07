import { createContext, ReactNode } from "react"
import { IProAthlete } from "../../../types/athletes"
import { IFantasyLeagueTeamSlot, MyTeamSlotType } from "../../../types/fantasyLeagueTeam"

type MyTeamSlotContextProps = {
    slot: IFantasyLeagueTeamSlot,
    athlete?: IProAthlete,
    slotType: MyTeamSlotType
}

export const MyTeamSlotContext = createContext<MyTeamSlotContextProps | null>(null);

type Props = {
    slot: IFantasyLeagueTeamSlot,
    children?: ReactNode
}

/** Provides data for a slot */
export default function MyTeamSlotProvider({slot, children} : Props) {

    const athlete = slot.athlete?.athlete;
    const slotType: MyTeamSlotType = athlete ? "athlete" : "empty"
    
    return (
        <MyTeamSlotContext.Provider
            value={{slot, athlete, slotType}}
        >
            {children}
        </MyTeamSlotContext.Provider>
    )
}