import { useAthletes } from "../../contexts/AthleteContext";

/** 
 * Hook that reads and filters for supported athletes from
 * the Athlete Context
*/
export function useSupportedAthletes() {
    return useAthletes();
}