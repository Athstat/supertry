import WarningCard from "../../ui/cards/WarningCard"
import { Link } from "react-router-dom"
import { useFantasyTeam } from "../../../hooks/fantasy/useFantasyTeam"


export default function SecondChanceCard() {

    const { roundFixtures: fixtures } = useFantasyTeam();

    const liveOrCompleted = fixtures.filter((f) => {
        return f.game_status !== "not_started"
    });

    return (
        <div className="flex flex-row items-center justify-center" >
            <WarningCard className="w-full flex flex-row text-sm" >

                <div>
                    <p>

                        <span>Second Chance Mode is on, you can edit your team but you can't swap in or out players participating in the following (live or completed) games: </span>

                        {liveOrCompleted.map((f) => {
                            return (
                                // <span>
                                //     {f.team?.athstat_name} vs {f.opposition_team?.athstat_name}
                                // </span>
                                <Link
                                    to={`/fixtures/${f.game_id}`}
                                    className="text-blue-500 underline dark:text-blue-400"
                                >
                                    {f.team?.athstat_name} vs {f.opposition_team?.athstat_name}
                                </Link>
                            )

                        })}

                    </p>

                </div>
                
            </WarningCard>
        </div>
    )
}
