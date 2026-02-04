import { twMerge } from "tailwind-merge";
import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { IFixture } from "../../../types/games";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";

type Props = {
    fixture: IFixture,
    showLogo?: boolean,
    isHome?: boolean
}

export default function FixtureCardTeam({ fixture, showLogo, isHome = true }: Props) {

    // Use live fixture polling hook
    const { liveFixture } = useLiveFixture({ fixture });

    // Use the live fixture data if available, otherwise use prop fixture
    const displayFixture = liveFixture || fixture;

    const {
        team_score,
        game_status,
        opposition_score,
    } = displayFixture;

    const matchFinal = game_status === 'completed' && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const { gameKickedOff } = fixtureSummary(displayFixture);

    const team = isHome ? fixture.team : fixture.opposition_team;
    const teamScore = isHome ? fixture.team_score : fixture.opposition_score;
    const teamWon = isHome ? homeTeamWon : awayTeamWon;

    const showScore = gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null;
    
    const showScoreOnRight = isHome && showScore;
    const showScoreOnLeft = !isHome && showScore;

    return (
        <div className="flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center">
            <div className="flex flex-row gap-2 items-center w-full justify-start">

                {showScoreOnLeft ? (
                    <div
                        className={twMerge(
                            'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                            teamWon && 'font-bold'
                        )}
                    >
                        {teamScore}
                    </div>
                ) : null}

                <div className="flex flex-col gap-4 items-center w-full justify-start">
                    {showLogo && (
                        <TeamLogo
                            url={team?.image_url}
                            teamName={team?.athstat_name}
                            className="w-10 h-10"
                        />
                    )}

                    <p className={twMerge('text-xs md:text-sm w-fit text-center')}>
                        {team?.athstat_name}
                    </p>
                </div>

                {showScoreOnRight ? (
                    <div
                        className={twMerge(
                            'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                            teamWon && 'font-bold'
                        )}
                    >
                        {teamScore}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
