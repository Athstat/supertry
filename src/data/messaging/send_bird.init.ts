import SendBird from "sendbird";
import { ThrowablePromise } from "../../services/errors";
import { AuthUser } from "../../types/auth";


export const SEND_BIRD_APP_ID = import.meta.env.VITE_SEND_BIRD_APP_ID ?? "";

const sb = new SendBird({
    appId: SEND_BIRD_APP_ID
});

export async function connectUserToSendBird(user: AuthUser) : ThrowablePromise<SendBird.SendBirdInstance> {
    try {
        await sb.connect(user.id);
        sb.updateCurrentUserInfo(user.firstName + " " + user.lastName, "");

        return { data: sb };
    } catch (error) {
        console.log(error);
        return {error: { message: "Failed to connect" } };
    }
}