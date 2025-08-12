import { Binoculars } from "lucide-react";
import { IProAthlete } from "../../../types/athletes"
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    player: IProAthlete
}

export default function CoachScrummyPlayerReport({ player }: Props) {

    const reportText = `
        ${player.player_name} needs no introduction. He is a strong player known for his juke
        moves, crazy no look passes and electric energy. He is the type of player every
        Coach wants in a locker room
    `;

    return (
        <div className="flex flex-col gap-2" >

            <SecondaryText className="flex flex-row items-center gap-2" >
                <Binoculars className="w-4 h-4" />
                <p>Coach Scrummy's Scouting Report</p>
            </SecondaryText>

            <div className="text-xs bg-slate-200 dark:bg-slate-700/80 p-4 rounded-xl" >
                {reportText}
            </div>

        </div>
    )
}
