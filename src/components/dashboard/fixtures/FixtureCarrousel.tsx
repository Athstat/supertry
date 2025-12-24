import { twMerge } from "tailwind-merge";
import { useFantasySeasons } from "../../../hooks/dashboard/useFantasySeasons"
import { useRoundGames } from "../../../hooks/fixtures/useRoundGames";
import { IFixture } from "../../../types/games";
import TeamLogo from "../../team/TeamLogo";
import SecondaryText from "../../shared/SecondaryText";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import { format } from "date-fns";

/** Renders top fixture carrousel */
export default function FixtureCarrousel() {

    const { currentRound } = useFantasySeasons();
    const { games, isLoading } = useRoundGames(currentRound);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2" >
                <div>
                    <h1>{currentRound?.round_title}</h1>
                </div>

                <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar" >
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                    <FixtureItemSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2" >
            <div>
                <h1>{currentRound?.round_title}</h1>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar" >
                {games.map((game) => {
                    return (
                        <FixtureItem
                            fixture={game}
                            key={game.game_id}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type FIxtureItemProps = {
    fixture: IFixture
}

function FixtureItem({ fixture }: FIxtureItemProps) {

    const { kickoff_time, game_status } = fixture;
    const { matchFinal } = fixtureSummary(fixture);

    if (!kickoff_time) {
        return;
    }

    return (
        <div className={twMerge(
            'bg-slate-800/60 p-2 flex flex-col rounded-xl min-w-[100px] max-w-[100px] min-h-[80px] max-h-[80px] ',
            'items-center justify-center gap-2'
        )} >
            <div className="flex flex-row items-center w-full justify-center gap-4" >
                <div>
                    <TeamLogo
                        url={fixture.team?.image_url}
                        className="w-6 h-6"
                    />
                </div>

                <div>
                    <TeamLogo
                        url={fixture.opposition_team?.image_url}
                        className="w-6 h-6"
                    />
                </div>
            </div>

            <div className="text-[10px]" >
                {!matchFinal && <SecondaryText className="text-[10px]" >Final</SecondaryText>}

                {game_status === "completed" && (
                    <div className="flex flex-col items-center justify-center">
                        <SecondaryText className="text-[10px]" >Final</SecondaryText>
                    </div>
                )}

                {game_status === "not_started" && (
                    <div className="flex flex-col items-center justify-center">
                        <SecondaryText className="text-[10px] font-bold" >{format(kickoff_time, "EE dd MMM")}</SecondaryText>
                        <SecondaryText className="text-[10px]" >{format(kickoff_time, "HH:mm")}</SecondaryText>
                    </div>
                )}
            </div>
        </div>
    )
}


function FixtureItemSkeleton() {


    return (
        <div className={twMerge(
            'bg-slate-800/40 p-2 flex flex-col rounded-xl min-w-[100px] max-w-[100px] min-h-[80px] max-h-[80px] ',
            'items-center justify-center gap-2 animate-pulse'
        )} >
            
        </div>
    )
}