import WarningCard from "../../ui/cards/WarningCard"
import { useMyTeam } from "../../../hooks/fantasy/my_team/useMyTeam"

type Props = {
    teamCreation?: boolean
}

export default function SecondChanceCard({teamCreation = false} : Props) {

    const { roundGames: fixtures } = useMyTeam();

    const liveOrCompleted = fixtures.filter((f) => {
        return f.game_status !== "not_started"
    });

    if (liveOrCompleted.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-center " >
            <WarningCard className="w-full flex flex-row text-xs mt-0" >

                <div>
                    <p>
                        <span>You can't {teamCreation ? "pick" : "swap in or out"} players participating in (live or completed) games</span>
                    </p>

                </div>
                
            </WarningCard>
        </div>
    )
}
