import { BadgeCheck } from 'lucide-react'
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups'
import SecondaryText from '../ui/typography/SecondaryText'
import LeagueGroupsTable from './LeagueGroupsTable'

type Props = {
    title?: string,
    description?: string,
    leagues: FantasyLeagueGroup[],
    isVerified?: boolean,
    emptyMessage?: string
}

export default function LeagueGroupsSection({leagues, title, description, isVerified, emptyMessage} : Props) {
    return (
        <section className="flex flex-col gap-2 py-6 rounded-none px-4 bg-slate-50 dark:bg-dark-800/40 border-none" >

            <div>
                <div className='flex flex-row items-center gap-1' >
                    <p className="font-semibold" >{title}</p>
                    {isVerified && (
                        <BadgeCheck className='w-4 h-4' />
                    )}
                </div>
                <SecondaryText>{description}</SecondaryText>
            </div>

            <LeagueGroupsTable
                leagues={leagues}
                emptyMessage={emptyMessage}
            />

        </section>
    )
}
