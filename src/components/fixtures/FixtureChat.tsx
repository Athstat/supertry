import { SendBirdProvider } from "@sendbird/uikit-react"
import { IFixture } from "../../types/games"
import { SEND_BIRD_APP_ID } from "../../data/messaging/send_bird.init"
import { authService } from "../../services/authService"
import AuthUsersOnlyError from "../auth/AuthUsersOnlyError"
import { getFixtureChannelName, getFixtureChannelUrl } from "../../data/messaging/messaging.utils"
import { useTheme } from "../../contexts/ThemeContext"
import { useOpenChat } from "../../hooks/useOpenChat"
import DelayedView from "../shared/containers/DelayedView"
import { OpenChannelProvider } from "@sendbird/uikit-react/OpenChannel/context"
import OpenChannelUI from "@sendbird/uikit-react/OpenChannel/components/OpenChannelUI"
import { ErrorState } from "../ui/ErrorState"

type Props = {
    fixture: IFixture
}

/** Renders a fixture chat */
export default function FixtureChat({ fixture }: Props) {

    const user = authService.getUserInfo();
    const channelUrl = getFixtureChannelUrl(fixture);
    const channelName = getFixtureChannelName(fixture);

    console.log('Channel Url ', channelUrl)
    console.log('Channel Name ', channelName)

    const { theme } = useTheme()

    const { error} = useOpenChat(channelUrl, channelName, user ?? undefined)



    if (error) {
        return <ErrorState error={error} />
    }

    if (!user) {
        return <AuthUsersOnlyError />
    }

    return (
        <DelayedView className='h-[600px]' >
            <SendBirdProvider
                appId={SEND_BIRD_APP_ID}
                userId={user.id}
                theme={theme}
            >
                <OpenChannelProvider channelUrl={channelUrl} >
                    <OpenChannelUI />
                </OpenChannelProvider>

            </SendBirdProvider>
        </DelayedView>
    )
}
