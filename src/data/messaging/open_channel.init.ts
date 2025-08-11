import { OpenChannel, OpenChannelCreateParams } from "@sendbird/chat/openChannel";
import { ThrowablePromise } from "../../services/errors";
import { CustomSendBirdInstance } from "./send_bird.init";

export async function createOrGetOpenChannel(channelUrl: string, channelName: string , sb: CustomSendBirdInstance) : ThrowablePromise<OpenChannel> {
    
    try {

        const exisitingChannel = await getExistingOpenChannel(channelUrl, sb);
        
        if (exisitingChannel) {
            return { data: exisitingChannel };
        }
        
        const params: OpenChannelCreateParams = {
            name: channelName,
            channelUrl: channelUrl,
            operatorUserIds: ['1'],
        };

        console.log("Params ", params);
        
        const newChannel = await sb.openChannel.createChannel(params);
        
        return {data: newChannel};
    } catch (error) {

        console.log(error);
        return {error: { message: "Failed to connect to channel" }};

    }
}


export async function getExistingOpenChannel(channelUrl: string, sb: CustomSendBirdInstance) : Promise<OpenChannel | undefined> {
    
    try {
        return await sb.openChannel.getChannel(channelUrl);
    } catch (error) {
        return undefined;
    }

}