import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { Link } from "react-router-dom";
import SecondaryText from "../ui/typography/SecondaryText";
import NoContentCard from "../ui/typography/NoContentMessage";
import { LeagueGroupCard } from "./card/LeagueGroupCard";

type Props = {
    leagues: FantasyLeagueGroup[],
    emptyMessage?: string
}

/** Renders a table of Fantasy League Groups */
export default function LeagueGroupsTable({ leagues, emptyMessage }: Props) {

    const noLeagues = leagues.length === 0;

    const getLeagueLink = (league: FantasyLeagueGroup) => {
        return `/league/${league.id}/standings`;
    }

    return (
        <div className="flex flex-col gap-2" >
            <div className="flex font-medium flex-row items-center justify-between" >
                <SecondaryText className="text-xs" >LEAGUE</SecondaryText>
                <SecondaryText className="text-xs" >RANKING</SecondaryText>
            </div>

            {leagues.map((l) => {
                return (
                    <Link key={l.id} to={getLeagueLink(l)} >
                        <LeagueGroupCard
                            leagueGroup={l}
                        />
                    </Link>
                )
            })}

            {noLeagues && (
                <NoContentCard 
                    message={emptyMessage || 'No leagues were found'}
                />
            )}
        </div>
    )
}
