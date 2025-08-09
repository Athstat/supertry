import { RugbyPlayer, IFantasyAthlete } from '../../types/rugbyPlayer';
import { getUri, getAuthHeader, getUriLocal } from '../../utils/backendUtils';
import { logger } from '../logger';
import { SportAction } from '../../types/sports_actions';

/** Athlete Service for fetching rugby players and athletes */
export const athleteService = {
  /**
   * Get rugby athletes by competition/season ID
   * This is the main method used by team creation to fetch available players
   */
  getRugbyAthletesByCompetition: async (competitionId: string): Promise<RugbyPlayer[]> => {
    try {
      logger.debug(`Fetching rugby athletes for competition: ${competitionId}`);

      const uri = getUri(`/api/v1/athletes/rugby/season/${competitionId}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const athletes = (await res.json()) as (IFantasyAthlete & { team?: any })[];

        console.log('Athletes: ', athletes);

        // Transform IFantasyAthlete to RugbyPlayer format expected by frontend
        // Filter out players with invalid prices (null, undefined, or 0)
        const rugbyPlayers: RugbyPlayer[] = athletes
          .filter(athlete => {
            // Only include players with valid prices (greater than 0)
            const hasValidPrice = athlete.price && athlete.price > 0;
            // if (!hasValidPrice) {
            //   console.log(
            //     `Filtering out player ${athlete.player_name} - invalid price:`,
            //     athlete.price
            //   );
            // }
            return hasValidPrice;
          })
          .map(athlete => ({
            id: athlete.tracking_id,
            tracking_id: athlete.tracking_id,
            player_name: athlete.player_name,
            team_name: athlete.team?.athstat_name || athlete.team?.name || 'Unknown Team',
            position_class: athlete.position_class,
            position: athlete.position,
            price: athlete.price, // No need for fallback since we filtered out invalid prices
            power_rank_rating: athlete.power_rank_rating || 0,
            image_url: athlete.image_url,
            height: athlete.height,
            weight: athlete.weight,
            date_of_birth: athlete.date_of_birth,
            team_id: athlete.team_id,
            form: athlete.form,
            available:
              typeof athlete.available === 'boolean'
                ? athlete.available
                : athlete.available === 'true',

            // Use actual rugby stats from API response
            kicking: athlete.kicking || 0, // Replace scoring with kicking as requested
            defence: athlete.defence || 0,
            attacking: athlete.attacking || 0,
            is_starting: true,

            // Include all rugby stats for detailed player view
            points_kicking: athlete.points_kicking || 0,
            tackling: athlete.tackling || 0,
            infield_kicking: athlete.infield_kicking || 0,
            strength: athlete.strength || 0,
            playmaking: athlete.playmaking || 0,
            ball_carrying: athlete.ball_carrying || 0,
            lineout: athlete.lineout || 0,
            receiving: athlete.receiving || 0,
            scoring: athlete.scoring || 0, // Keep scoring for internal use
          }));

        logger.debug(`Successfully fetched ${rugbyPlayers.length} rugby athletes`);
        return rugbyPlayers;
      } else {
        logger.error(`Failed to fetch rugby athletes: ${res.status} ${res.statusText}`);
        throw new Error(`Failed to fetch athletes: ${res.status}`);
      }
    } catch (err) {
      logger.error('Error fetching rugby athletes by competition:', err);
      throw err;
    }
  },

  /**
   * Get all athletes (fallback method)
   */
  getAllAthletes: async (): Promise<RugbyPlayer[]> => {
    try {
      const uri = getUri('/api/v1/athletes');
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const athletes = (await res.json()) as (IFantasyAthlete & { team?: any })[];

        // Transform to RugbyPlayer format
        const rugbyPlayers: RugbyPlayer[] = athletes.map(athlete => ({
          id: athlete.tracking_id,
          tracking_id: athlete.tracking_id,
          player_name: athlete.player_name,
          team_name: athlete.team?.athstat_name || athlete.team?.name || 'Unknown Team',
          position_class: athlete.position_class,
          position: athlete.position,
          price: athlete.price || 0,
          power_rank_rating: athlete.power_rank_rating || 0,
          image_url: athlete.image_url,
          height: athlete.height,
          weight: athlete.weight,
          date_of_birth: athlete.date_of_birth,
          team_id: athlete.team_id,
          form: athlete.form,
          available:
            typeof athlete.available === 'boolean'
              ? athlete.available
              : athlete.available === 'true',

          // Default values for required fields
          scoring: 0,
          defence: 0,
          attacking: 0,
          is_starting: true,
        }));

        return rugbyPlayers;
      } else {
        logger.error(`Failed to fetch all athletes: ${res.status} ${res.statusText}`);
        throw new Error(`Failed to fetch athletes: ${res.status}`);
      }
    } catch (err) {
      logger.error('Error fetching all athletes:', err);
      throw err;
    }
  },

  /**
   * Get athlete by ID
   */
  getAthleteById: async (id: string): Promise<RugbyPlayer | undefined> => {
    try {
      const uri = getUri(`/api/v1/athletes/${id}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const athlete = (await res.json()) as IFantasyAthlete & { team?: any };

        // Transform to RugbyPlayer format
        const rugbyPlayer: RugbyPlayer = {
          id: athlete.tracking_id,
          tracking_id: athlete.tracking_id,
          player_name: athlete.player_name,
          team_name: athlete.team?.athstat_name || athlete.team?.name || 'Unknown Team',
          position_class: athlete.position_class,
          position: athlete.position,
          price: athlete.price || 0,
          power_rank_rating: athlete.power_rank_rating || 0,
          image_url: athlete.image_url,
          height: athlete.height,
          weight: athlete.weight,
          date_of_birth: athlete.date_of_birth,
          team_id: athlete.team_id,
          form: athlete.form,
          available:
            typeof athlete.available === 'boolean'
              ? athlete.available
              : athlete.available === 'true',

          // Default values for required fields
          scoring: 0,
          defence: 0,
          attacking: 0,
          is_starting: true,
        };

        return rugbyPlayer;
      }
    } catch (err) {
      logger.error('Error fetching athlete by ID:', err);
    }

    return undefined;
  },
};

/**
 * Group sport actions by category for display in stats components
 */
export const groupSportActions = (sportActions: SportAction[]) => {
  const categorizedStats = {
    general: [] as any[],
    attack: [] as any[],
    defense: [] as any[],
    setpiece: [] as any[],
    discipline: [] as any[],
  };

  // Group actions by category based on action name
  sportActions.forEach(action => {
    const stat = {
      label: action.action,
      displayValue: action.action_count,
      rawValue: action.action_count,
    };

    // Categorize based on action type
    const actionName = action.action.toLowerCase();

    if (
      actionName.includes('try') ||
      actionName.includes('assist') ||
      actionName.includes('break') ||
      actionName.includes('offload') ||
      actionName.includes('carry')
    ) {
      categorizedStats.attack.push(stat);
    } else if (
      actionName.includes('tackle') ||
      actionName.includes('turnover') ||
      actionName.includes('steal') ||
      actionName.includes('intercept')
    ) {
      categorizedStats.defense.push(stat);
    } else if (
      actionName.includes('lineout') ||
      actionName.includes('scrum') ||
      actionName.includes('kickoff') ||
      actionName.includes('restart')
    ) {
      categorizedStats.setpiece.push(stat);
    } else if (
      actionName.includes('penalty') ||
      actionName.includes('card') ||
      actionName.includes('yellow') ||
      actionName.includes('red')
    ) {
      categorizedStats.discipline.push(stat);
    } else {
      categorizedStats.general.push(stat);
    }
  });

  return {
    categorizedStats,
    totalActions: sportActions.length,
  };
};
