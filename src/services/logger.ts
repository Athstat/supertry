/** Service for logging errors. For now it just loggs to the console */


function error(message: string) {
    console.log("Error: ", message);
}

/** Prints message to console if app is in local development */
function debug(message: string) {

}

export const logger = {error, debug};

