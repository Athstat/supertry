import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTeamHistory } from "../../../hooks/fantasy/useTeamHistory";
import CircleButton from "../../shared/buttons/BackButton";

/** Renders a Team History Bar */
export default function TeamHistoryBar() {
    const { round, moveNextRound, movePreviousRound } = useTeamHistory();

    if (!round) {
        return;
    }

    return (
        <div className="mx-2 mb-3 flex gap-4 flex-row items-center justify-center" >

            <CircleButton onClick={movePreviousRound} >
                <ChevronLeft />
            </CircleButton>

            <div>
                <p>{round?.title}</p>
            </div>

            <CircleButton onClick={moveNextRound} >
                <ChevronRight />
            </CircleButton>
        </div>
    )
}
