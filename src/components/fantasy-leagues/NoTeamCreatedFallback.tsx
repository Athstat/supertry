import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import { useTabView } from "../shared/tabs/TabView";
import PitchViewLoadingSkeleton from "./my-team/PitchViewLoadingSkeleton";

type Props = {
    perspective?: "first-person" | "third-person",
    hideViewStandingsOption?: boolean
}

/** Renders a list of rounds */
export default function NoTeamCreatedFallback({perspective = "first-person", hideViewStandingsOption} : Props) {

    const { round, jumpToRound, manager } = useTeamHistory();
    const { currentRound } = useFantasyLeagueGroup();

    const {navigate} = useTabView();
    const managerAlias = manager?.username || manager?.first_name || manager?.last_name || "User";

    const isOldLeague = round && currentRound && ((round?.start_round ?? 0) < (currentRound?.start_round ?? 0));
    const missedDeadline = round && currentRound && (round?.id === currentRound?.id);

    const jumpToCurrentRound = () => {
        if (isOldLeague) {
            jumpToRound(currentRound);
        }
    }

    const handleViewStandings = () => {
        navigate("standings")
    }

    const oldLeagueDidNotCreateTeamWording = perspective === "first-person" ?
        `You didn't create a team for ${round?.title}` : `${managerAlias} didn't create a team for ${round?.title}`

    const missedDeadlineWording = perspective === "first-person" ?
        `You missed the deadline for ${round?.title}. You can pick your team on the next round` :
        `${managerAlias} didn't create a team for ${round?.title}`;

    return (
        <div className="relative flex overflow-hidden flex-col items-center justify-center w-full h-full" >
            
            <div className="opacity-20 w-full" >
                <PitchViewLoadingSkeleton hideHistoryBar />
            </div>

            <div className="absolute top-0 gap-2 w-full h-[400px] left-0 flex flex-col items-center justify-center" >
                {isOldLeague && <div className="font flex flex-col gap-2" >
                    <p>{oldLeagueDidNotCreateTeamWording}</p>

                    {isOldLeague && (
                        <div>
                            <PrimaryButton onClick={jumpToCurrentRound} >Jump to {currentRound.title}</PrimaryButton>
                        </div>
                    )}
                </div>}

                {missedDeadline && <div className="font w-2/3 flex flex-col gap-2 items-center justify-center text-center" >
                    
                    <p>
                        {missedDeadlineWording}
                    </p>

                    <p className="text-sm" ></p>

                    {isOldLeague && !hideViewStandingsOption && (
                        <div>
                            <PrimaryButton onClick={handleViewStandings} >View Standings</PrimaryButton>
                        </div>
                    )}
                </div>}
            </div>
        </div>
    );

}
