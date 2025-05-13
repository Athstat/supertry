import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analytics } from "../../../services/anayticsService";
import { IFantasyLeague } from "../../../types/fantasyLeague";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

type NoTeamPlaceholderProps = {
    league: IFantasyLeague
}

/** Renders placeholder when there is no 'My Team' */
export function LeagueCardNoTeamPlaceholder({ league }: NoTeamPlaceholderProps) {

    const navigate = useNavigate();

    const navigateToTeamCreation = () => {

        analytics.trackTeamCreationStarted(
            league.id,
            league.official_league_id
        );

        navigate(`/${league.official_league_id}/create-team`, {
            state: { league },
        });
    }

    return (
        <div className="flex items-center justify-center w-full py-10 rounded-xl border-[6px] border-slate-400 dark:border-slate-700/40 border-dotted " >
            <div className="flex flex-col gap-3" >  
                <p className="text-slate-700 dark:text-slate-400" >You haven't picked your team for {league.title} yet</p>
                <PrimaryButton onClick={navigateToTeamCreation} className=" gap-1" >
                    Pick Your Team
                    <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
            </div>
        </div>
    )
}