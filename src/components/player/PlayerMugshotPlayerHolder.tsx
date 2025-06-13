type Props = {
    playerName?: string
}

/** Renders a placeholder mugshot for a player, useful 
 * when their image does't exist or is not found */
export default function PlayerMugshotPlayerHolder({playerName} : Props) {

    const chr = playerName && playerName.length > 0 ? 
        playerName?.charAt(0) : ""

    return (
        <span className="text-white font-semibold text-lg">
            {chr}
        </span>
    )
}
