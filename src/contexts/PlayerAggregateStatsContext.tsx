import { createContext} from "react";
import { AthleteSportsActionAggregated } from "../types/sports_actions";

type ContextProps = {
  aggregateStats?: AthleteSportsActionAggregated[],
  error?: string
}

export const PlayerAggregateStatsContext = createContext<ContextProps | undefined>(undefined);

