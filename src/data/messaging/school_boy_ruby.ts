import SendBird from "sendbird";
import { createOrGetGroupChannel } from "./group_channel.send_bird.init";

export const SCHOOL_BOY_RUGBY_CHANNEL_URL = "school-boy-rugby-channel";
export const SCHOOL_BOY_RUGBY_CHANNEL_NAME = "School Boy Rugby";

/** Returns an instance of the School Boy Rugby Channel */
export async function getSbrGroupChat(sb: SendBird.SendBirdInstance) {
    return await createOrGetGroupChannel(
        SCHOOL_BOY_RUGBY_CHANNEL_URL,
        SCHOOL_BOY_RUGBY_CHANNEL_NAME,
        sb
    )
}