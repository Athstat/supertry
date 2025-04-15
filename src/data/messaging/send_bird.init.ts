import SendBird from "sendbird";
import { ThrowablePromise } from "../../services/errors";

const SEND_BIRD_APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID || "437A36CF-633F-4200-A54C-39DAB06F3C7F";

const sb = new SendBird({
    appId: SEND_BIRD_APP_ID
});

export async function connectUserToSendBird(userId: string) : ThrowablePromise<SendBird.SendBirdInstance> {
    try {
        await sb.connect(userId);
        return { data: sb };
    } catch (error) {
        return {error: { message: "Failed to connect" } };
    }
}