import SendbirdChat, { SendbirdChatParams, SendbirdChatWith } from "@sendbird/chat";
import { ThrowablePromise } from "../../services/errors";
import { AuthUser } from "../../types/auth";
import { OpenChannelModule } from "@sendbird/chat/openChannel";

export const SEND_BIRD_APP_ID = "55A874B7-840A-4219-A096-DBC8109432BA";

const params: SendbirdChatParams<[OpenChannelModule]> = {
    appId: SEND_BIRD_APP_ID,
    modules: [
        new OpenChannelModule()
    ]
}

export type CustomSendBirdInstance = SendbirdChatWith<[OpenChannelModule]>;

const sb = SendbirdChat.init(params);

export async function connectUserToSendBird(user: AuthUser) : ThrowablePromise<SendbirdChatWith<[OpenChannelModule]>> {
    try {
        
        await sb.connect(user.id);
        
        const userNickName = user.firstName + " " + user.lastName;
        sb.updateCurrentUserInfo({
            nickname: userNickName
        });
        
        console.log("SendBird Connection State: ", sb.connectionState);

        return { data: sb };

    } catch (error) {
        console.log(error);
        return {error: { message: "Failed to connect" } };
    }
}