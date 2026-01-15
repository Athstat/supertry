import { useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"
import { twMerge } from "tailwind-merge";

type Props = {
    league?: FantasyLeagueGroup,
    className?: string
}

/** Renders a league group logo */
export default function LeagueGroupLogo({ league, className }: Props) {

    const defaultImageUrl = "https://dp7xhssw324ru.cloudfront.net/default_trophy_logo.png";

    const [error, setError] = useState(false);
    const imageUrl = league?.logo || defaultImageUrl;

    if (imageUrl && !error) {
        return (
            <div className={twMerge(
                "w-10 h-10 overflow-clip",
                className
            )} >
                <img
                    onError={() => setError(true)}
                    src={imageUrl}
                    className="object-scale-down"
                />
            </div>
        )
    }

    // Just return default again as a placeholder
    return (
        <div className={twMerge(
            "w-10 h-10 overflow-clip",
            className
        )} >
            <img
                src={defaultImageUrl}
                className="object-scale-down"
            />
        </div>
    )
}
