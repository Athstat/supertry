import YoutubeIFrame from "./YoutubeIFrame"

type Props = {
    link?: string
}

// Renders Game Highlights
export default function GameHighlightsCard({ link }: Props) {

    if (!link) return;

    return (
        <div className="flex flex-col gap-2" >
            {/* <div className="flex bg-blue-500 border border-blue-400 dark:bg-blue-700 text-white text-sm w-fit px-2 py-0.5 rounded-xl flex-row items-center gap-1" >
                <PlayCircle className='w-4 h-4' />
                Game Highlights
            </div> */}
            <YoutubeIFrame link={link} />
        </div>
    )
}