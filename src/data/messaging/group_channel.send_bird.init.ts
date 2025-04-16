import SendBird from "sendbird";
import { ThrowablePromise } from "../../services/errors";

export async function createOrGetGroupChannel(channelUrl: string, channelName: string , sb: SendBird.SendBirdInstance) : ThrowablePromise<SendBird.GroupChannel> {
    
    try {

        const exisitingChannel = await getExistingGroupChannel(channelUrl, sb);
        
        if (exisitingChannel) {
            return { data: exisitingChannel };
        }
        
        const createChannelParams = new sb.GroupChannelParams();
        createChannelParams.channelUrl = channelUrl;
        createChannelParams.name = channelName;
        createChannelParams.operatorUserIds = ["1"];
        
        const newChannel = await sb.GroupChannel.createChannel(createChannelParams);
        
        return {data: newChannel};
    } catch (error) {

        console.log(error);
        return {error: { message: "Failed to connect to channel" }};

    }
}


export async function getExistingGroupChannel(channelUrl: string, sb: SendBird.SendBirdInstance) : Promise<SendBird.GroupChannel | undefined> {
    
    try {
        return await sb.GroupChannel.getChannel(channelUrl);
    } catch (SendBirdError) {
        return undefined;
    }

}