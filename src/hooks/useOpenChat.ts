import { useEffect, useState } from "react";
import { connectUserToSendBird, CustomSendBirdInstance } from "../data/messaging/send_bird.init";
import { createOrGetOpenChannel } from "../data/messaging/open_channel.init";
import { OpenChannel } from "@sendbird/chat/openChannel";
import { AuthUser } from "../types/auth";

/** Connects a user to sendbird and the open channel specified */
export function useOpenChat(channelUrl: string, channelName: string, authUser: AuthUser) {
    
    const [sbInstance, setSbInstance] = useState<CustomSendBirdInstance>();
    const [channel, setChannel] = useState<OpenChannel>();
    const [error, setError] = useState<string>();
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        const init = async () => {
            setLoading(true);

            const { data: sb, error: sbError } = await connectUserToSendBird(authUser);
            if (sbError) setError(`Failed to connect to ${channelName}.`);

            if (sb) {
                setSbInstance(sb);
                const { data: channel, error: channelError } = await createOrGetOpenChannel(channelUrl, channelName, sb);

                if (channel) setChannel(channel);
                else if (channelError) {
                    console.log("Sendbird chat error ", channelError);
                    setError(`Failed to connect to ${channelName}.`)
                };
                
            }

            setLoading(false);
        }

        init();

    }, []);

    return { channel, error, sbInstance, authUser, isLoading };
}