import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analytics } from "../../../services/anayticsService";
import { IFantasyLeague } from "../../../types/fantasyLeague";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { isLeagueLocked } from "../../../utils/leaguesUtils";

type NoTeamPlaceholderProps = {
    league: IFantasyLeague
}

/** Renders placeholder when there is no 'My Team' */
export function LeagueCardNoTeamPlaceholder({ league }: NoTeamPlaceholderProps) {

    const navigate = useNavigate();

    const navigateToLeague = () => {
        navigate(`/league/${league.official_league_id}`, { 
            state: { league } 
        });
    };

    const navigateToTeamCreation = () => {

        analytics.trackTeamCreationStarted(
            league.id,
            league.official_league_id
        );

        navigate(`/${league.official_league_id}/create-team`, {
            state: { league },
        });
    }

    const isLocked = isLeagueLocked(league.join_deadline);

    return (
        <div className="flex items-center justify-center w-full px-10 text-center lg:px-0 py-10 rounded-xl border-[6px] lg:border-[3px] border-slate-100 dark:border-slate-700/40 border-dotted " >

            {!isLocked && <div className="flex flex-col gap-3" >
                <p className="text-slate-700 dark:text-slate-400" >You haven't picked your team for {league.title} yet</p>

                <PrimaryButton onClick={navigateToTeamCreation} className=" gap-1 text-sm lg:base" >
                    Pick Your Team
                    <ArrowRight className="w-4 h-4" />

                </PrimaryButton>
            </div>}

            {isLocked && <div onClick={navigateToLeague} className="flex flex-col gap-3" >
                <p className="text-slate-700 cursor-pointer dark:text-slate-400" >{league.title} is now locked and you can't join the league or edit your team </p>

                {/* <PrimaryButton onClick={navigateToTeamCreation} className=" gap-1 text-sm lg:base" >
                    
                    <ArrowRight className="w-4 h-4" />

                </PrimaryButton> */}
            </div>}


        </div>
    )
}