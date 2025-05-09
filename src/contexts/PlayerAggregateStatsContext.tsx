import { createContext} from "react";
import { SportAction } from "../types/sports_actions";

type ContextProps = {
  aggregateStats?: SportAction[],
  error?: string
}

export const PlayerAggregateStatsContext = createContext<ContextProps | undefined>(undefined);

