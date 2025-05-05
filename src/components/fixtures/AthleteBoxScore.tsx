import { useState } from "react";
import { IBoxScore } from "../../types/boxScore"
import useSWR from "swr";
import { athleteService } from "../../services/athleteService";
import { LoadingShimmer } from "../ui/LoadingState";
import AthleteFixtureStatsModal from "./AthleteFixtureStatsModal";

type Props = {
    boxScoreRecord: IBoxScore
}

export default function AthleteBoxScore({ boxScoreRecord: record }: Props) {

    
    const [showModal, setShowModal] = useState(false);
    const toogle = () => setShowModal(!showModal);

    const {data: athlete, isLoading, error} = useSWR(record.athlete_id, athleteService.getAthleteById);

    if (isLoading) return <LoadingShimmer />
    if (!athlete || error) return <></>

    const tacklePerc = Math.floor(record.tacklesuccess * 100);

    return (
        <>
            <tr onClick={toogle} className="hover:bg-gray-100 dark:hover:bg-gray-800/50" >
                <td>{record.player_name}</td>
                <td>{record.tries}</td>
                <td>{record.passes}</td>
                <td>{tacklePerc}%</td>
                <td>{record.carries}</td>
            </tr>

            <AthleteFixtureStatsModal onClose={toogle} open={showModal} boxScoreRecord={record} athlete={athlete} />
        </>
    )
}
