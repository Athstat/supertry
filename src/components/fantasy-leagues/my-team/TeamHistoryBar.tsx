import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTeamHistory } from "../../../hooks/fantasy/useTeamHistory";
import CircleButton from "../../shared/buttons/BackButton";

type Props = {
    lock?: boolean
}

/** Renders a Team History Bar */
export default function TeamHistoryBar({lock}: Props) {
    const { round, moveNextRound, movePreviousRound } = useTeamHistory();

    if (!round) {
        return;
    }

    return (
        <div className="mx-2 mb-3 flex gap-4 flex-row items-center justify-center" >

            {!lock && <CircleButton onClick={movePreviousRound} >
                <ChevronLeft />
            </CircleButton>}

            <div>
                <p>{round?.title}</p>
            </div>

            {!lock && <CircleButton onClick={moveNextRound} >
                <ChevronRight />
            </CircleButton>}
        </div>
    )
}
