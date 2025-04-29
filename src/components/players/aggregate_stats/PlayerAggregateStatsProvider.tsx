import { ReactNode, useCallback } from "react";
import { useAsync } from "../../../hooks/useAsync";
import { athleteSportActionsService } from "../../../services/athleteSportsActions";
import { AthleteSportsActionAggregated } from "../../../types/sports_actions";
import { PlayerAggregateStatsContext } from "../../../contexts/PlayerAggregateStatsContext";
import { RugbyPlayer } from "../../../types/rugbyPlayer";


type Props = {
  children?: ReactNode,
  player: RugbyPlayer
}

export default function PlayerAggregateStatsProvider({children, player} : Props) {
  
  const fetchData = useCallback(async () => {
    return athleteSportActionsService.getByAthlete(player.tracking_id ?? "");
  }, []);

  const { data: aggregateStats, error } = useAsync<AthleteSportsActionAggregated[]>(fetchData);

  return (
    <PlayerAggregateStatsContext.Provider value={{aggregateStats, error}}>
      {children}
    </PlayerAggregateStatsContext.Provider>
  )
}

