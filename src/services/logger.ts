/** Service for logging errors. For now it just loggs to the console */

import { analytics } from "./analytics/anayticsService";


function error(message?: any, ...optionalParams: any[]) {
    
    console.log("Error: ", message, optionalParams);
    
    analytics.track("Error_Thrown", {
        message: message
    });
}

/** Prints message to console if app is in local development */
function debug(message: string) {

}

export const logger = {error, debug};

