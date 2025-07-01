import { format } from 'date-fns'
import { ISeason } from '../../types/games'
import RoundedCard from '../shared/RoundedCard'
import SecondaryText from '../shared/SecondaryText'
import { useNavigate } from 'react-router-dom'

type Props = {
  season: ISeason
}

export default function SeasonCard({season} : Props) {

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/seasons/${season.id}`);
  }

  return (
    <RoundedCard onClick={handleOnClick} className='p-4 cursor-pointer' >
        <p className='font-medium' >{season.name}</p>
        <SecondaryText className='' >{format(season.start_date, 'dd MMMM yyy')} to {format(season.end_date, 'dd MMMM yyy')}</SecondaryText>
    </RoundedCard>
  )
}
