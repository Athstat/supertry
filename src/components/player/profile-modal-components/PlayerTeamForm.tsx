import { IProAthlete } from "../../../types/athletes"
import { useTeamLastNFixtures } from "../../../hooks/teams/useTeamLastNFixtures";
import RoundedCard from "../../shared/RoundedCard";
import TeamFormGnatChart from "../../team/TeamFormGnatChart";

type Props = {
    player: IProAthlete
}

export default function PlayerTeamFormCard({ player }: Props) {
    const { team } = player;
    const { fixtures, isLoading } = useTeamLastNFixtures(team?.athstat_id);


    if (isLoading) {
        return (
            <div>
                <p>Loading</p>
            </div>
        )
    }

    if (!team) {
        return null;
    }

    return (
        <RoundedCard className="p-4 border-none " >
            <div>
                <p className="font-bold text-sm" >Team Form</p>
            </div>

            <TeamFormGnatChart 
                fixtures={fixtures}
                team={team}
            />
        </RoundedCard>
    )
}