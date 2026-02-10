import { Download } from "lucide-react"
import { Link } from "react-router-dom"
import PrimaryButton from "./PrimaryButton"
import { useStoreLinks } from "../../../hooks/marketing/useStoreLinks"
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups"

type Props = {
    showIcon?: boolean,
    league?: FantasyLeagueGroup
}

/** Renders a button to downlaod the app */
export default function DownloadAppButton({ showIcon = false, league }: Props) {

    const { oneLinkUrl } = useStoreLinks(league);

    return (
        <Link to={oneLinkUrl || ''} target="blank" >
            <PrimaryButton className="flex w-fit flex-row items-center gap-4" >
                <p className="text-nowrap" >Download App</p>
                {showIcon && <Download />}
            </PrimaryButton>
        </Link>
    )
}
