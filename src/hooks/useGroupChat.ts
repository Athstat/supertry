import { useEffect, useState } from "react";
import { AsyncError } from "../services/errors";
import { authService } from "../services/authService";
import { connectUserToSendBird } from "../data/messaging/send_bird.init";
import { createOrGetGroupChannel } from "../data/messaging/group_channel.send_bird.init";

export function useGroupChat(channelUrl: string, channelName: string) {

    const authUser = authService.getUserInfo();
    const [sbInstance, setSbInstance] = useState<SendBird.SendBirdInstance>();
    const [channel, setChannel] = useState<SendBird.GroupChannel>();
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
                    const { data: channel, error: channelError } = await createOrGetGroupChannel(channelUrl, channelName, sb);

                    if (channel) setChannel(channel);
                    if (channelError) setError(channelError);
                }
            }
        }

        init();

    }, []);

    return { channel, error, sbInstance, authUser };
}