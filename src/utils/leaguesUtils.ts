import { differenceInDays } from "date-fns";
import { IFantasyLeague } from "../types/fantasyLeague";
import { leagueService } from "../services/leagueService";

/** Filters to only remain with leagues that seven days away */
export function activeLeaguesFilter(leagues: IFantasyLeague[]) {
  return leagues.filter((l) => {
    if (!l.join_deadline) {
      return true;
    }

    const today = new Date();
    const deadline = new Date(l.join_deadline);
    const daysDiff = differenceInDays(deadline, today);

    return daysDiff <= 7;
  });
}

/**
 * Fetches the latest active official league
 * @returns Promise with the latest official league or null if none found
 */
export async function getLatestOfficialLeague(): Promise<IFantasyLeague | null> {
  try {
    // Fetch all leagues
    const allLeagues = await leagueService.getAllLeagues();

    // Filter for official leagues that are open or current
    const officialLeagues = allLeagues.filter(
      (league) =>
        league.type === "official" &&
        (league.status === "open" || league.status === "current")
    );

    if (officialLeagues.length === 0) {
      console.error("No active official leagues found");
      return null;
    }

    // Sort by created date descending (newest first)
    const sortedLeagues = officialLeagues.sort((a, b) => {
      const dateA = new Date(a.created_date || 0);
      const dateB = new Date(b.created_date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Return the most recent one
    return sortedLeagues[0];
  } catch (error) {
    console.error("Error fetching latest official league:", error);
    return null;
  }
}
