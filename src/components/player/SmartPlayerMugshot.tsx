import { Activity } from "react"
import PlayerMugshot from "./PlayerMugshot"
import TeamJersey from "./TeamJersey"
import { twMerge } from "tailwind-merge"

type Props = {
    url?: string,
    teamId?: string,
    className?: string,
    playerImageClassName?: string,
    jerseyClassName?: string,
    jerseyConClassName?: string
}

/** A component that either renders a player mugshot if available or a team jersey as a fallback */
export default function SmartPlayerMugshot({ url, teamId, className, playerImageClassName, jerseyClassName, jerseyConClassName }: Props) {
    return (
        <div className={className} >
            <Activity mode={url ? "visible" : "hidden"} >
                <PlayerMugshot
                    url={url}
                    teamId={teamId}
                    className={twMerge(
                        " bg-slate-100 w-10 h-10 lg:w-10 lg:h-10 hover:bg-slate-800",
                        playerImageClassName
                    )}

                    useBaseClassNameForJersey={false}
                />
            </Activity>

            <Activity mode={url ? "hidden" : "visible"} >
                <div className={twMerge(
                    "max-w-12 bg-slate-100 dark:bg-slate-800/40 dark:border-slate-700 border max-h-10 min-w-10 min-h-10 flex flex-col items-center rounded-full overflow-hidden ",
                    jerseyConClassName
                )} >
                    <TeamJersey
                        teamId={teamId}
                        className={twMerge(
                            "max-h-12 max-w-10 min-h-10 min-w-10 mt-2 object-center",
                            "lg:max-h-12 lg:max-w-10 lg:min-h-10 lg:min-w-10 mt-2",
                            jerseyClassName
                        )}
                        hideFade
                    />
                </div>
            </Activity>
        </div>
    )
}
