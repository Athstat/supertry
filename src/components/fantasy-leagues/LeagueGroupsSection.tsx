import { BadgeCheck } from 'lucide-react'
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups'
import RoundedCard from '../ui/cards/RoundedCard'
import SecondaryText from '../ui/typography/SecondaryText'
import LeagueGroupsTable from './LeagueGroupsTable'

type Props = {
    title?: string,
    description?: string,
    leagues: FantasyLeagueGroup[],
    isVerified?: boolean
}

export default function LeagueGroupsSection({leagues, title, description, isVerified} : Props) {
    return (
        <RoundedCard className="flex flex-col gap-2 p-2 rounded-none" >

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
            />

        </RoundedCard>
    )
}
