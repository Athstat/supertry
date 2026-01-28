import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups'
import SecondaryText from '../ui/typography/SecondaryText'
import LeagueGroupsTable from './LeagueGroupsTable'
import TextHeading from '../ui/typography/TextHeading'
import RoundedCard from '../ui/cards/RoundedCard'

type Props = {
    title?: string,
    description?: string,
    leagues: FantasyLeagueGroup[],
    emptyMessage?: string
}

export default function LeagueGroupsSection({ leagues, title, description, emptyMessage }: Props) {
    return (
        <section>
            <RoundedCard className="flex flex-col gap-4 py-6 px-4 bg-[#F0F3F7] " >

                <div className='flex flex-col gap-2' >
                    <div className='flex flex-row items-center gap-1' >
                        <TextHeading className="font-[500]" blue >{title}</TextHeading>
                    </div>
                    <SecondaryText>{description}</SecondaryText>
                </div>

                <LeagueGroupsTable
                    leagues={leagues}
                    emptyMessage={emptyMessage}
                />

            </RoundedCard>
        </section>
    )
}
