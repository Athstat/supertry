import { Download } from "lucide-react"
import { Link } from "react-router-dom"
import PrimaryButton from "./PrimaryButton"
import { useStoreLinks } from "../../../hooks/marketing/useStoreLinks"
import { leagueInviteService } from "../../../services/fantasy/leagueInviteService"
import { LeagueGroupInvite } from "../../../types/fantasyLeague"

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
    }

    return (
        <Link to={oneLinkUrl || ''} target="blank"  onClick={handleOnClick}>
            <PrimaryButton className="flex w-fit flex-row items-center gap-4" >
                <p className="text-nowrap" >Download App</p>
                {showIcon && <Download />}
            </PrimaryButton>
        </Link>
    )
}
