import { SportActionDefinition } from "../types/sports_actions";
import { getAuthHeader, getUri } from "../utils/backendUtils";

export const sportActionsService = {

    /** Returns a sport action definition list */
    getDefinitionList: async () : Promise<SportActionDefinition[]> => {
        try {
            const uri = getUri(`/api/v1/sport-actions`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            })

            if (res.ok) {
                return (await res.json()) as SportActionDefinition[];
            }

        } catch (err) {
            console.log('Erro fetching sport action definitions ', err);
        }

        return [];
    }
}