import { useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"
import { twMerge } from "tailwind-merge";
import { Country, countryFlags } from "../../types/countries";

type Props = {
    league?: FantasyLeagueGroup,
    className?: string,
    objectClassName?: string
}

/** Renders a league group logo */
export default function LeagueGroupLogo({ league, className, objectClassName }: Props) {

    const defaultImageUrl = "/images/leagues/default_league_group_logo.png";
    const countryLogo = getLogoUrlForCountryLeague(league);

    const [error, setError] = useState(false);
    const imageUrl = league?.logo || countryLogo;

    if (imageUrl && !error) {
        return (
            <div className={twMerge(
                "min-w-9 min-h-9 overflow-clip flex flex-col items-center justify-center",
                className
            )} >
                <img
                    onError={() => setError(true)}
                    src={imageUrl}
                    className={twMerge(
                        "object-scale-down",
                        objectClassName
                    )}
                    alt='league_logo'
                />
            </div>
        )
    }

    // Just return default again as a placeholder
    return (
        <div className={twMerge(
            "min-w-8 min-h-8 overflow-clip",
            className
        )} >
            <img
                src={defaultImageUrl}
                className={twMerge(
                    "object-scale-down",
                    objectClassName
                )}
                alt='league_logo'
            />
        </div>
    )
}


function getLogoUrlForCountryLeague(leagueGroup?: FantasyLeagueGroup) {
    const leagueName = leagueGroup?.title;
    
    const country: Country | undefined = countryFlags.find((c) => {
        return leagueName?.toLocaleLowerCase().startsWith(c.name.toLowerCase());
    });

    
    if (country) {
        const url = `https://dp7xhssw324ru.cloudfront.net/${country.code.toLowerCase()}.png`
        return url;
    }

    return undefined;
}