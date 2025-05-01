import { useMemo } from 'react';

interface AvailableTeam {
  id: string;
  name: string;
  logo: string;
}

/**
 * Hook to extract all unique teams from players array
 * 
 * @param players List of all players
 * @returns List of teams for filtering
 */
export const useAvailableTeams = (players: any[]): AvailableTeam[] => {
  return useMemo(() => {
    // Use all players to ensure all teams are always visible
    const teams = players
      ? [...new Set(players.map(p => p.team_id))]
        .filter(Boolean)
        .map(teamId => {
          const player = players.find(p => p.team_id === teamId);
          return {
            id: teamId,
            name: player?.team_name || 'Unknown Team',
            logo: player?.team_logo || ''
          };
        })
      : [];
    console.log("Available teams:", teams.length);
    return teams;
  }, [players]);
};

export default useAvailableTeams;
