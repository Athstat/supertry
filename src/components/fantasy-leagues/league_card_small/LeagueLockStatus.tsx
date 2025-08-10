import { isLeagueLocked } from '../../../utils/leaguesUtils'
import { IFantasyLeague } from '../../../types/fantasyLeague';

type Props = {
    league: IFantasyLeague
}

export default function LeagueLockStatus({league} : Props) {

    const isLocked = isLeagueLocked(league.join_deadline);

    return (
        <div
            className={`px-2 py-0.5 text-xs rounded-full ${!isLocked
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-200 dark:bg-red-700/30 text-red-700 dark:text-red-400"
                }`}
        >
            {!isLocked ? "Open" : "Locked 🔒"}
        </div>
    )
}
