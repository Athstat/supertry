import { SendBirdProvider } from "@sendbird/uikit-react";
import { SEND_BIRD_APP_ID } from "../data/messaging/send_bird.init";
import { authService } from "../services/authService";
import { useTheme } from "./ThemeContext";
import { ReactNode } from "react";
import { useAuth } from "./AuthContext";

type Props = {
    children?: ReactNode
}

/* Provides chat fucntionality to children */
export default function ChatProvider({ children }: Props) {

    const {authUser} = useAuth();
    const { theme } = useTheme()

    return (
        <SendBirdProvider
            appId={SEND_BIRD_APP_ID}
            userId={authUser?.kc_id ?? "Fallback User Id"}
            theme={theme}
        >

            {children}

        </SendBirdProvider>
    )
}
