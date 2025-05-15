/** Service for logging errors. For now it just loggs to the console */

import { analytics } from "./anayticsService";


function error(message: any) {
    
    console.log("Error: ", message);
    
    analytics.track("Error_Thrown", {
        message: message
    });
}

/** Prints message to console if app is in local development */
function debug(message: string) {

}

export const logger = {error, debug};

