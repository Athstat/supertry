/** Seasons Service */

import { IFixture, ISeason, ITeam } from "../types/games";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { logger } from "./logger";


export const seasonService = {
    
    getAllSupportedSeasons: async () : Promise<ISeason[]> => {
        try {
            
            const uri = getUri(`/api/v1/entities/seasons`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });
            
            if (res.ok) {
                return (await res.json()) as ISeason[]
            }
            
        } catch (error) {
            logger.error('Error fetching season ', error);
        }
        
        return []
    },
    
    getSeasonsById: async (seasonId: string) : Promise<ISeason | undefined> => {
        try {
            
            const uri = getUri(`/api/v1/entities/seasons/${seasonId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });
            
            if (res.ok) {
                return (await res.json()) as ISeason
            }
            
        } catch (error) {
            logger.error('Error fetching season ', error);
        }
        
        return undefined
    },
    
    getSeasonTeams: async (seasonId: string): Promise<ITeam[]> => {
        try {
            
            const uri = getUri(`/api/v1/entities/seasons/${seasonId}/teams`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });
            
            if (res.ok) {
                return (await res.json()) as ITeam[]
            }
            
        } catch (error) {
            logger.error('Error fetching season ', error);
        }
        
        return []
    },
    
    getSeasonFixtures: async (seasonId: string): Promise<IFixture[]> => {
        try {
            
            const uri = getUri(`/api/v1/entities/seasons/${seasonId}/games`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });
            
            if (res.ok) {
                return (await res.json()) as IFixture[]
            }
            
        } catch (error) {
            logger.error('Error fetching season ', error);
        }
        
        return []
    },
    
    getSeasonAthletes: async (seasonId: string): Promise<RugbyPlayer[]> => {
        try {
            
            const uri = getUri(`/api/v1/entities/seasons/${seasonId}/athletes`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });
            
            if (res.ok) {
                return (await res.json()) as RugbyPlayer[]
            }
            
        } catch (error) {
            logger.error('Error fetching season ', error);
        }
        
        return []
    }
}