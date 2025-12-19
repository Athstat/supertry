import { useQueryState } from "../../hooks/useQueryState"
import { queryParamKeys } from "../../types/constants"
import PageView from "../PageView"

/** Renders Fantasy Points Rankings Screen */
export default function FantasyPointsRankingsScreen() {

    const [roundNumber, setRoundNumber] = useQueryState(queryParamKeys.ROUND_NUMBER_QUERY_KEY);

    return (
        <PageView>
            <div>
                <p>Fantasy Points Top Scorers</p>
            </div>
        </PageView>
    )
}
