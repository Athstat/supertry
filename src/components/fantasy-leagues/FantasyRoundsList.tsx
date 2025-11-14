import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import { useTabView } from "../shared/tabs/TabView";
import PitchViewLoadingSkeleton from "./my-team/PitchViewLoadingSkeleton";


/** Renders a list of rounds */
export default function NoTeamCreatedFallback() {

    const { round, jumpToRound } = useTeamHistory();
    const { currentRound } = useFantasyLeagueGroup();

    const {navigate} = useTabView();

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

    return (
        <div className="relative flex overflow-hidden max-h-[400px] flex-col items-center justify-center w-full h-full" >
            <div className="opacity-20 w-full mt-40" >
                <PitchViewLoadingSkeleton />
            </div>

            <div className="absolute top-0 gap-2 w-full h-[400px] left-0 flex flex-col items-center justify-center" >
                {isOldLeague && <div className="font flex flex-col gap-2" >
                    <p>You didn't create a team for {round?.title}</p>

                    {isOldLeague && (
                        <div>
                            <PrimaryButton onClick={jumpToCurrentRound} >Jump to {currentRound.title}</PrimaryButton>
                        </div>
                    )}
                </div>}

                {missedDeadline && <div className="font w-2/3 flex flex-col gap-2 items-center justify-center text-center" >
                    <p>
                        You missed the deadline for {round.title}. You can pick your team on the next round
                    </p>
                    <p className="text-sm" ></p>

                    {isOldLeague && (
                        <div>
                            <PrimaryButton onClick={handleViewStandings} >View Standings</PrimaryButton>
                        </div>
                    )}
                </div>}
            </div>
        </div>
    );

}
