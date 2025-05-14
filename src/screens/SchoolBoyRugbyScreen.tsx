import { OpenChannel, SendBirdProvider } from "@sendbird/uikit-react"
import { SCHOOL_BOY_RUGBY_CHANNEL_NAME, SCHOOL_BOY_RUGBY_CHANNEL_URL } from "../data/messaging/school_boy_ruby"
import { SEND_BIRD_APP_ID } from "../data/messaging/send_bird.init";
import DelayedView from "../components/shared/containers/DelayedView";
import { useAuthUser } from "../hooks/useAuthUser";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { useOpenChat } from "../hooks/useOpenChat";
import { OpenChannelProvider } from "@sendbird/uikit-react/OpenChannel/context";
import OpenChannelUI from "@sendbird/uikit-react/OpenChannel/components/OpenChannelUI";

export default function SchoolBoyRugbyScreen() {

  const authUser = useAuthUser();

  const { isLoading, error } = useOpenChat(
    SCHOOL_BOY_RUGBY_CHANNEL_URL,
    SCHOOL_BOY_RUGBY_CHANNEL_NAME,
    authUser
  );

  if (isLoading) return <LoadingState />

  if (error) return <ErrorState message={error} />

  return (

    <DelayedView className='text-white h-[80vh] overflow-hidden' >

      <SendBirdProvider appId={SEND_BIRD_APP_ID} userId={authUser.id}>
        <OpenChannelProvider channelUrl={SCHOOL_BOY_RUGBY_CHANNEL_URL}>
          <OpenChannelUI />
        </OpenChannelProvider>
      </SendBirdProvider>

    </DelayedView>
  )
}
