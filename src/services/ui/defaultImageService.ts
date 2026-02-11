import { DefaultImage } from "../../types/ui";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

export const defaultImageService = {

    /** Fetches default images by library */
    getLibraryImages: async (library: string) : Promise<DefaultImage[]> => {
        try {
            const uri = getUri(`/api/v1/images/defaults/${library}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res) {
                return (await res.json()) as DefaultImage[];
            }
        } catch (err) {
            logger.error('Error fetching default images ', err);
        }
        return [];
    }
}