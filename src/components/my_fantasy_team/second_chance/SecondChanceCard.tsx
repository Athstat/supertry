import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import WarningCard from "../../ui/cards/WarningCard"
import { useSeasonRoundFixtures } from "../../../hooks/fixtures/useProFixtures"
import { Link } from "react-router-dom"
import RoundedCard from "../../ui/cards/RoundedCard"

type Props = {
    round: ISeasonRound
}

export default function SecondChanceCard({ round }: Props) {


    const { fixtures, isLoading } = useSeasonRoundFixtures(round.season, round.round_number);

    const liveOrCompleted = fixtures.filter((f) => {
        return f.game_status !== "not_started"
    });


    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[40px] animate-pulse border-none"  />
        )
    }

    return (
        <div className="flex flex-row items-center justify-center" >
            <WarningCard className="w-full flex flex-row text-sm" >


                <div>
                    <p>You can't swap in or out players participating in the following games: </p>

                    <div className="flex flex-row items-center gap-2" >
                        {liveOrCompleted.map((f) => {
                            return (
                                <Link
                                    to={`/fixtures/${f.game_id}`}
                                    className="text-blue-500 underline dark:text-blue-400"
                                >
                                    {f.team?.athstat_name} vs {f.opposition_team?.athstat_name}
                                </Link>
                            )
                        })}
                    </div>

                </div>
            </WarningCard>
        </div>
    )
}
