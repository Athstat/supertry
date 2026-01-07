import { Binoculars } from "lucide-react";
import { IProAthlete } from "../../../types/athletes"
import SecondaryText from "../../ui/typography/SecondaryText";

type Props = {
    player: IProAthlete
}

export default function CoachScrummyPlayerReport({ player }: Props) {

    if (!player.scouting_report) return;

    const reportText = player.scouting_report;

    return (
        <div className="flex flex-col gap-2" >

            <SecondaryText className="flex flex-row items-center gap-2" >
                <Binoculars className="w-4 h-4" />
                <p>Coach Scrummy's Scouting Report</p>
            </SecondaryText>

            <div className="text-xs bg-slate-200 dark:text-white dark:bg-slate-700/80 p-4 rounded-xl" >
                {reportText}
            </div>

        </div>
    )
}
