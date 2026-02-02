import { useMemo, useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"
import { twMerge } from "tailwind-merge";
import { Country, countryFlags } from "../../types/countries";
import { useSeasonTeams } from "../../hooks/seasons/useSeasonTeams";
import { Edit2 } from "lucide-react";

type Props = {
    league?: FantasyLeagueGroup,
    className?: string,
    isEditable?: boolean,
    onEdit?: () => void
}

/** Renders a league group logo */
export default function LeagueGroupLogo({ league, className, isEditable, onEdit }: Props) {

    const defaultImageUrl = "/images/leagues/default_league_group_logo.png";
    const { getTeamByName } = useSeasonTeams();

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

    const handleClick = () => {
        if (isEditable && onEdit) {
            onEdit();
        }
    }

    const showPencilIcon = isEditable && !league?.logo

    if (imageUrl && !error) {
        return (

            <>
                <div
                    className={twMerge(
                        "min-w-9 min-h-9 cursor-pointer relative overflow-clip flex flex-col items-center justify-center",
                        className
                    )}
                    
                    onClick={handleClick}
                >
                    <img
                        onError={() => setError(true)}
                        src={imageUrl}
                        className="object-scale-down"
                        alt='league_logo'
                    />
                </div>

                {showPencilIcon && (
                    <div className="absolute -top-2 h-6 w-6 -right-2 bg-white dark:bg-white text-slate-800 rounded-full flex flex-col items-center justify-center" >
                        <button onClick={handleClick} ><Edit2 className="w-3 h-3" /></button>
                    </div>
                )}
            </>
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