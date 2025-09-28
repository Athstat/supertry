import { twMerge } from "tailwind-merge"
import { IFixture } from "../../../types/games"
import TeamLogo from "../../team/TeamLogo"

type Props = {
    game: IFixture,
    onClick?: (game: IFixture) => void
}

export default function GameStoryItem({ game, onClick }: Props) {

    const bgColourOptions = ['', 'bg-pruple-500', 'bg-green-500'];

    const handleOnClick = () => {
        if (onClick) {
            onClick(game);
        }
    }

    return (
        <div 
        onClick={handleOnClick}
        className={twMerge(
            "min-w-20 overflow-clip min-h-20 rounded-full",
            'flex flex-col items-center bg-gradient-to-br justify-center',
            'border-2 dark:border dark:border-slate-800',
            bgColourOptions[0]
        )} >
            <div className="flex flex-row items-center gap-2" >
                <TeamLogo
                    url={game.team?.image_url}
                    teamName={game.team?.athstat_name}
                    className="w-6 h-6"
                />

                <TeamLogo
                    url={game.opposition_team?.image_url}
                    teamName={game.opposition_team?.athstat_name}
                    className="w-6 h-6"
                />
            </div>
        </div>
    )
}
