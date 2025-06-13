import { athleteService } from "../../services/athleteService";
import { RugbyPlayer } from "../../types/rugbyPlayer"
import WarningCard from "../shared/WarningCard"
import { useFetch } from "../../hooks/useFetch";
import { Info } from "lucide-react";
import { useAtomValue } from "jotai";
import { fantasyLeagueAtom } from "../../state/fantasyLeague.atoms";
import { fantasyTeamAthletesAtom } from "../../state/myTeam.atoms";

type Props = {

}

export default function AthletesAvailabilityWarning({}: Props) {
    
    const league = useAtomValue(fantasyLeagueAtom);
    const athletes = useAtomValue(fantasyTeamAthletesAtom);
    
    const athleteIds = athletes.map((a) => a.athlete_id);

    const leagueEnded = league?.has_ended;

    const {data, isLoading} = useFetch("team-athletes-refetch", athleteIds, fetcher);

    if (isLoading) return;
    if (leagueEnded) return;

    const teamAthletes = data ?? [];
    const unAvailableAthletes = teamAthletes.filter(a => {
        return !a.available;
    });

    if (unAvailableAthletes.length === 0) return;

    let messageStr = leagueEnded ? "The following players were not confirmed to have been available: " : "The following players have not yet been confirmed to be available: "  ;
    let secondPart = "";

    for (let x = 0; x < unAvailableAthletes.length; x++) {
        const athlete = unAvailableAthletes[x];

        if (x === unAvailableAthletes.length - 1) {
            secondPart += `${athlete.player_name}.`;
        } else {
            secondPart += `${athlete.player_name}, `
        }

    }

    return (
        <div>
            <WarningCard className="items-center p-3 gap-2" >
                <Info className="w-10 h-4" />
               <p className="text-xs md:text-sm" >{messageStr} <strong>{secondPart}</strong></p>
            </WarningCard>
        </div>
    )
}

async function fetcher(athleteIds: string[]) {
    const athletes: RugbyPlayer[] = [];

    const promises = athleteIds.map((id) => {
        return athleteService.getRugbyAthleteById(id);
    });

    const res = await Promise.all(promises);
    res.forEach((a) => {
        if (a) {
            athletes.push(a);
        }
    });

    return athletes;
}