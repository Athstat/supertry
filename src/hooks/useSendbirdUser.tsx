import { useEffect, useState } from "react";
import { AuthUser } from "../types/auth";
import { connectUserToSendBird } from "../data/messaging/send_bird.init";
import { logger } from "../services/logger";

/** Hook that connects a user to sendbird */
export function useSendbirdUser(authUser: AuthUser) {
    
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string>()
    
    useEffect(() => {
        
        const fetcher = async () => {
            
            try {   
                setLoading(true);
                await connectUserToSendBird(authUser);
            } catch (e) {
                
                setError("Failed to load chat")
                logger.error(`Error with sendbird ${error}`);

            } finally {
                setLoading(false);
            }
        };

        fetcher();
    }, [authUser]);

    return {isLoading, error};
}