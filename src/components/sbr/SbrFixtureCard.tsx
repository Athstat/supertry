import { useNavigate } from "react-router-dom";
import { ISbrFixture } from "../../types/sbr";
import SbrTeamLogo from "./fixtures/SbrTeamLogo";
import { twMerge } from "tailwind-merge";
import SbrFixturePredictionBox from "./predictions/SbrFixturePredictionBox";
import { useAtomValue } from "jotai";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureEventsAtom } from "../../state/sbrFixtureScreen.atoms";
import { ScopeProvider } from "jotai-scope";
import SbrFixtureDataProvider from "./fixture/SbrFixtureDataProvider";
import { Sparkles } from "lucide-react";
import WarningCard from "../shared/WarningCard";

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean,
    hideVoting?: boolean
}

export default function SbrFixtureCard({ fixture, showLogos, showCompetition, className, hideVoting, showKickOffTime }: Props) {

    const atoms = [sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureEventsAtom];

    return (
        <ScopeProvider atoms={atoms}>
            <SbrFixtureDataProvider fixtureId={fixture.fixture_id}>
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

function SbrFixtureCardContent({ showCompetition, showLogos, hideVoting, className }: ContentProps) {

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
                "dark:bg-slate-800/40 gap-2 flex flex-col cursor-pointer bg-white rounded-xl border dark:border-slate-800/60 p-4",
                className
            )}
        >

            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400" >
                {showCompetition && fixture.season && <p>{fixture.season}</p>}
            </div>

            {hasBoxscoreData &&
                <WarningCard className="flex flex-row items-center justify-center" >
                    <Sparkles className="w-4 h-4" />
                    <p>Stats are available for this game</p>
                </WarningCard>

            }

            <div
                onClick={handleClick}
                className="flex flex-row"
            >
                {/* Home Team */}
                <div className="flex-1 flex gap-2 flex-col items-center justify-start" >
                    {showLogos && <SbrTeamLogo className="w-14 h-14 lg:w-14 lg:h-14" teamName={fixture.home_team} />}
                    <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center" >{fixture.home_team}</p>
                    <p className="text-slate-700 dark:text-slate-400" >{gameCompleted && home_score !== undefined ? home_score : "-"}</p>
                </div>
                {/* Kick off information */}
                <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-400 text-slate-700 " >

                    {!hasScores && fixture.status !== "completed" && <p className="text-sm" >VS</p>}
                    {fixture.status === "completed" && (
                        <div className="flex w-full flex-row items-center justify-center gap-1" >
                            <div>Final</div>
                        </div>
                    )}
                </div>
                {/* Away Team */}
                <div className="flex-1 flex w-1/3 gap-2 flex-col items-center justify-end" >
                    {showLogos && <SbrTeamLogo className="w-14 h-14 lg:w-14 lg:h-14" teamName={fixture.away_team} />}
                    <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center" >{fixture.away_team}</p>
                    <p className="text-slate-700 dark:text-slate-400" >{gameCompleted && away_score !== undefined ? away_score : "-"}</p>
                </div>
            </div>

            <SbrFixturePredictionBox
                fixture={fixture}
                hide={hideVoting}
            />
        </div>
    )
}