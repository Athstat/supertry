import { ThrowablePromise } from "../../services/errors";

export async function createOrGetChannel(channelUrl: string, channelName: string , sb: SendBird.SendBirdInstance) : ThrowablePromise<SendBird.OpenChannel> {
    
    try {

        const exisitingChannel = await sb.OpenChannel.getChannel(channelUrl);
        
        if (exisitingChannel) {
            return { data: exisitingChannel };
        }
        
        const createChannelParams = new sb.OpenChannelParams();
        createChannelParams.channelUrl = channelUrl;
        createChannelParams.name = channelName;
        createChannelParams.coverUrlOrImage = "";
        createChannelParams.data = "";
        createChannelParams.customType = "";
        createChannelParams.operatorUserIds = [];
        
        const newChannel = await sb.OpenChannel.createChannel(createChannelParams);
        
        return {data: newChannel};
    } catch (error) {

        console.log(error);
        return {error: { message: "Failed to connect to channel" }};

    }
}