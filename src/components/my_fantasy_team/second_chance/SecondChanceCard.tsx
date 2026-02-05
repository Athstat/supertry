import WarningCard from "../../ui/cards/WarningCard"
import { Link } from "react-router-dom"
import { useFantasyTeam } from "../../../hooks/fantasy/useFantasyTeam"

type Props = {
    teamCreation?: boolean
}

export default function SecondChanceCard({teamCreation = false} : Props) {

    const { roundFixtures: fixtures } = useFantasyTeam();

    const liveOrCompleted = fixtures.filter((f) => {
        return f.game_status !== "not_started"
    });

    if (liveOrCompleted.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-center " >
            <WarningCard className="w-full flex flex-row text-sm mt-0" >

                <div>
                    <p>

                        <span>You can't {teamCreation ? "pick" : "swap in or out"} players participating in the following (live or completed) games: </span>

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
