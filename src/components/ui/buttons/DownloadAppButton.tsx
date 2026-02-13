import { Download } from "lucide-react"
import PrimaryButton from "./PrimaryButton"
import { useStoreLinks } from "../../../hooks/marketing/useStoreLinks"
import { leagueInviteService } from "../../../services/fantasy/leagueInviteService"
import { LeagueGroupInvite } from "../../../types/fantasyLeague"
import SecondaryText from "../typography/SecondaryText"
import { useState } from "react"

type Props = {
    showIcon?: boolean,
    invite?: LeagueGroupInvite
}

/** Renders a button to downlaod the app */
export default function DownloadAppButton({ showIcon = false, invite }: Props) {

    const { oneLinkUrl } = useStoreLinks(invite?.league);
    const [isLoading, setLoading] = useState(false);

    const handleOnClick = async () => {

        if (invite) {
            setLoading(true);
            await leagueInviteService.registerIntent(invite?.id);
            setLoading(false)
        }

        if (oneLinkUrl) {
            window.location.assign(oneLinkUrl, );
        }
    }

    if (!oneLinkUrl) {
        return <SecondaryText>One Link was not found</SecondaryText>
    }

    return (
        <PrimaryButton 
            className="flex w-fit flex-row items-center gap-4" 
            onClick={handleOnClick}
            isLoading={isLoading}
            disabled={isLoading}
        >
            <p className="text-nowrap" >Download App</p>
            {showIcon && <Download />}
        </PrimaryButton>
    )
}
