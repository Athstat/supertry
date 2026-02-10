import { Download } from "lucide-react"
import PrimaryButton from "./PrimaryButton"
import { useStoreLinks } from "../../../hooks/marketing/useStoreLinks"
import { leagueInviteService } from "../../../services/fantasy/leagueInviteService"
import { LeagueGroupInvite } from "../../../types/fantasyLeague"
import SecondaryText from "../typography/SecondaryText"

type Props = {
    showIcon?: boolean,
    invite?: LeagueGroupInvite
}

/** Renders a button to downlaod the app */
export default function DownloadAppButton({ showIcon = false, invite }: Props) {

    const { oneLinkUrl } = useStoreLinks(invite?.league);

    const handleOnClick = () => {

        if (invite) {
            leagueInviteService.registerIntent(invite?.id);
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
        >
            <p className="text-nowrap" >Download App</p>
            {showIcon && <Download />}
        </PrimaryButton>
    )
}
