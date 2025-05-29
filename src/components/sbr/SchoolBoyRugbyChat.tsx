import { SendBirdProvider } from '@sendbird/uikit-react'
import OpenChannelUI from '@sendbird/uikit-react/OpenChannel/components/OpenChannelUI'
import { OpenChannelProvider } from '@sendbird/uikit-react/OpenChannel/context'
import { SCHOOL_BOY_RUGBY_CHANNEL_NAME, SCHOOL_BOY_RUGBY_CHANNEL_URL } from '../../data/messaging/school_boy_ruby'
import { SEND_BIRD_APP_ID } from '../../data/messaging/send_bird.init'
import DelayedView from '../shared/containers/DelayedView'
import { twMerge } from 'tailwind-merge'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useOpenChat } from '../../hooks/useOpenChat'
import { ErrorState } from '../ui/ErrorState'
import { LoadingState } from '../ui/LoadingState'
import { useTheme } from '../../contexts/ThemeContext'

type Props = {
    className?: string
}

/** Renders school boy rugby chat */
export default function SchoolBoyRugbyChat({ className }: Props) {

    const authUser = useAuthUser();

    const { isLoading, error } = useOpenChat(
        SCHOOL_BOY_RUGBY_CHANNEL_URL,
        SCHOOL_BOY_RUGBY_CHANNEL_NAME,
        authUser
    );

    const {theme} = useTheme();

    if (isLoading) return <LoadingState />

    if (error) return <ErrorState message={error} />

    return (
        <DelayedView className={twMerge(
            'text-white h-[80vh] overflow-hidden',
            className
        )} >

            <SendBirdProvider theme={theme} appId={SEND_BIRD_APP_ID} userId={authUser.id}>
                <OpenChannelProvider channelUrl={SCHOOL_BOY_RUGBY_CHANNEL_URL}>
                    <OpenChannelUI />
                </OpenChannelProvider>
            </SendBirdProvider>

        </DelayedView>
    )
}
