import { useMemo, useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"
import { twMerge } from "tailwind-merge";
import { Country, countryFlags } from "../../types/countries";
import { useSeasonTeams } from "../../hooks/seasons/useSeasonTeams";

type Props = {
    league?: FantasyLeagueGroup,
    className?: string
}

/** Renders a league group logo */
export default function LeagueGroupLogo({ league, className }: Props) {

    const defaultImageUrl = "/images/leagues/default_league_group_logo.png";
    
    const {getTeamByName} = useSeasonTeams();
    
    const fallbackLogo = useMemo(() => {
        const title = league?.title
        const isTeamFansLeague = title && title.endsWith('Fans');
        const countryLogo = getLogoUrlForCountryLeague(league);

        if (!countryLogo && isTeamFansLeague) {
            const team = getTeamByName(title.replace(' Fans', ''));
            return team?.image_url;
        }

        return countryLogo || defaultImageUrl;
    }, [getTeamByName, league]);

    const [error, setError] = useState(false);
    const imageUrl = league?.logo || fallbackLogo;

    if (imageUrl && !error) {
        return (
            <div className={twMerge(
                "min-w-9 min-h-9 overflow-clip flex flex-col items-center justify-center",
                className
            )} >
                <img
                    onError={() => setError(true)}
                    src={imageUrl}
                    className="object-scale-down"
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
                className="object-scale-down"
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