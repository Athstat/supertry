import { format } from 'date-fns'
import SecondaryText from '../ui/typography/SecondaryText'
import { useNavigate } from 'react-router-dom'
import { IProSeason } from '../../types/season'
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker'
import RoundedCard from '../ui/cards/RoundedCard'

type Props = {
  season: IProSeason
}

export default function SeasonCard({season} : Props) {

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/seasons/${season.id}`);
  }

  return (
    <RoundedCard onClick={handleOnClick} className='p-4 cursor-pointer' >
        <p className='font-medium' >{abbreviateSeasonName(season.name || "")}</p>
        <SecondaryText className='' >{format(season.start_date, 'dd MMMM yyy')} to {format(season.end_date, 'dd MMMM yyy')}</SecondaryText>
    </RoundedCard>
  )
}
