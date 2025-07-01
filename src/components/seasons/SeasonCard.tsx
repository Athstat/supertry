import { format } from 'date-fns'
import { ISeason } from '../../types/games'
import RoundedCard from '../shared/RoundedCard'
import SecondaryText from '../shared/SecondaryText'

type Props = {
    season: ISeason
}

export default function SeasonCard({season} : Props) {
  return (
    <RoundedCard className='p-4' >
        <p className='font-medium' >{season.name}</p>
        <SecondaryText className='' >{format(season.start_date, 'dd MMMM yyy')} to {format(season.end_date, 'dd MMMM yyy')}</SecondaryText>
    </RoundedCard>
  )
}
