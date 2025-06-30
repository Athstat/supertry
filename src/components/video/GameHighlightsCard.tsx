import YoutubeIFrame from "./YoutubeIFrame"

type Props = {
    link?: string
}

// Renders Game Highlights
export default function GameHighlightsCard({ link }: Props) {

    if (!link) return;

    return (
        <div>
            <YoutubeIFrame link={link} />
        </div>
    )
}