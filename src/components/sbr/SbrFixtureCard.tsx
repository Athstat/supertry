import { useNavigate } from "react-router-dom";
import { ISbrFixture } from "../../types/sbr";
import SbrTeamLogo from "./fixtures/SbrTeamLogo";
import { twMerge } from "tailwind-merge";
import SbrFixturePredictionBox from "./predictions/SbrFixturePredictionBox";
import { useAtomValue } from "jotai";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom } from "../../state/sbrFixtureScreen.atoms";
import { ScopeProvider } from "jotai-scope";
import SbrFixtureDataProvider from "./fixture/SbrFixtureDataProvider";
import { Sparkles } from "lucide-react";
import WarningCard from "../shared/WarningCard";
import { format } from "date-fns";
import SbrFixtureStatsStatusCard from "./card/SbrFixtureStatsStatusCard";

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean,
    hideVoting?: boolean
}

export default function SbrFixtureCard({ fixture, showLogos, showCompetition, className, hideVoting, showKickOffTime }: Props) {

    const atoms = [sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom];

    return (
        <ScopeProvider atoms={atoms}>
            <SbrFixtureDataProvider fixture={fixture}>
                <SbrFixtureCardContent
                    showCompetition={showCompetition}
                    showKickOffTime={showKickOffTime}
                    showLogos={showLogos}
                    className={className}
                    hideVoting={hideVoting}
                />
            </SbrFixtureDataProvider>
        </ScopeProvider>
    )
}

type ContentProps = {
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean,
    hideVoting?: boolean
}

function SbrFixtureCardContent({ showCompetition, showLogos, hideVoting, className, showKickOffTime }: ContentProps) {

    const navigate = useNavigate();
    const fixture = useAtomValue(sbrFixtureAtom);
    const boxscore = useAtomValue(sbrFixtureBoxscoreAtom);

    const hasBoxscoreData = boxscore.length > 0;

    if (!fixture) return;

    const { home_score, away_score } = fixture;
    const hasScores = home_score !== null && away_score !== null;

    const handleClick = () => {
        navigate(`/sbr/fixtures/${fixture.fixture_id}`);
    }

    const gameCompleted = fixture.status === "completed";


    return (
        <div
            // onClick={handleClick}
            className={twMerge(
                "dark:bg-slate-800/40 gap-2.5 flex flex-col cursor-pointer bg-white rounded-xl border dark:border-slate-800/60 p-4",
                className
            )}
        >

            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400" >
                {showCompetition && fixture.season && <p className="text-[10px]" >{fixture.season}</p>}
            </div>

            <SbrFixtureStatsStatusCard fixture={fixture} />

            <div
                onClick={handleClick}
                className="flex flex-row"
            >
                {/* Home Team */}
                <div className="flex-1 flex gap-2 flex-col items-center justify-start" >
                    {showLogos && <SbrTeamLogo className="w-10 h-10 lg:w-10 lg:h-10" teamName={fixture.home_team.team_name} />}
                    <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center" >{fixture.home_team.team_name}</p>
                    <p className="text-slate-700 text-xs dark:text-slate-400" >{gameCompleted && home_score !== undefined ? home_score : "-"}</p>
                </div>
                {/* Kick off information */}
                <div className="flex-1 flex flex-col items-center gap-1 justify-center dark:text-slate-400 text-slate-700 " >

                    {!hasScores && !showKickOffTime && fixture.status !== "completed" && <p className="text-sm" >vs</p>}
                    {fixture.status === "completed" && !showKickOffTime && (
                        <div className="flex w-full text-xs flex-row items-center justify-center gap-1" >
                            <div>Final</div>
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center" >
                        {showKickOffTime && fixture.kickoff_time && <p className="text-[10px]" >{format(fixture.kickoff_time, 'HH:mm')}</p>}
                        {showKickOffTime && fixture.kickoff_time && <p className="text-[10px]" >{format(fixture.kickoff_time, 'dd MMMM yyyy')}</p>}
                    </div>
                </div>
                {/* Away Team */}
                <div className="flex-1 flex w-1/3 gap-2 flex-col items-center justify-end" >
                    {showLogos && <SbrTeamLogo className="w-10 h-10 lg:w-10 lg:h-10" teamName={fixture.away_team.team_name} />}
                    <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center" >{fixture.away_team.team_name}</p>
                    <p className="text-slate-700 text-xs dark:text-slate-400" >{gameCompleted && away_score !== undefined ? away_score : "-"}</p>
                </div>
            </div>

            <SbrFixturePredictionBox
                fixture={fixture}
                hide={hideVoting}
            />
        </div>
    )
}