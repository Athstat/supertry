import { useEffect, useState } from "react";
import { AsyncError } from "../services/errors";
import { authService } from "../services/authService";
import { connectUserToSendBird, CustomSendBirdInstance } from "../data/messaging/send_bird.init";
import { createOrGetOpenChannel } from "../data/messaging/open_channel.init";
import { OpenChannel } from "@sendbird/chat/openChannel";

export function useOpenChat(channelUrl: string, channelName: string) {

    const authUser = authService.getUserInfo();
    const [sbInstance, setSbInstance] = useState<CustomSendBirdInstance>();
    const [channel, setChannel] = useState<OpenChannel>();
    const [error, setError] = useState<AsyncError>();


    useEffect(() => {
        const init = async () => {
            if (!authUser) {

                setError({ message: "User not authenticated" });

                return;
            } else {
                const { data: sb, error: sbError } = await connectUserToSendBird(authUser);
                if (sbError) setError(sbError);

                if (sb) {
                    setSbInstance(sb);
                    const { data: channel, error: channelError } = await createOrGetOpenChannel(channelUrl, channelName, sb);

                    if (channel) setChannel(channel);
                    else if (channelError) setError(channelError);
                }
            }
        }

        init();

    }, []);

    return { channel, error, sbInstance, authUser };
}