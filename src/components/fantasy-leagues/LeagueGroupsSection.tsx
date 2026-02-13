import { BadgeCheck } from 'lucide-react'
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups'
import SecondaryText from '../ui/typography/SecondaryText'
import LeagueGroupsTable from './LeagueGroupsTable'
import TextHeading from '../ui/typography/TextHeading'

type Props = {
    title?: string,
    description?: string,
    leagues: FantasyLeagueGroup[],
    isVerified?: boolean,
    emptyMessage?: string
}

export default function LeagueGroupsSection({ leagues, title, description, isVerified, emptyMessage }: Props) {

    const leagueBias = (league: FantasyLeagueGroup) => {
        if (league.type === "official_league") {
            return 3000000000000000000;
        }

        if (league.type === "system_created") {
            return 2000000000000000000;
        }

        if (league.type === "celebrity_created") {
            return 1000000000000000000;
        }

        if (league.type === "subscriber_created") {
            return 10000;
        }

        return 1
    }

    const sortedLeagues = leagues.sort((a, b) => {
        const bScore = leagueBias(b) + (b.members_count || 0);
        const aScore = leagueBias(a) + (a.members_count || 0);

        return bScore - aScore;
    });

    return (
        <section className="flex flex-col gap-3 py-6 px-4 dark:bg-dark-800/40 border border-slate-100/90 rounded-xl dark:border-slate-700" >

            <div className='flex flex-col gap-2' >
                <div className='flex flex-row items-center gap-1' >

                    <TextHeading className="font-semibold text-xl" >{title}</TextHeading>

                    {isVerified && (
                        <BadgeCheck className='w-4 h-4' />
                    )}
                </div>
                <SecondaryText>{description}</SecondaryText>
            </div>

            <LeagueGroupsTable
                leagues={sortedLeagues}
                emptyMessage={emptyMessage}
            />

        </section>
    )
}
