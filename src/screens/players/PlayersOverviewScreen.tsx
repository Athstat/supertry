import { ArrowRight, Users } from 'lucide-react'
import PageView from '../PageView'
import SearchInput from '../../components/shared/forms/SearchInput'
import RoundedCard from '../../components/shared/RoundedCard'
import TopPositionPlayers from '../../components/players/positioning/TopPositionPlayers'
// import { useNavigate } from 'react-router-dom'

export default function PlayersOverviewScreen() {

  // const navigate = useNavigate();

  const handleViewAll = () => {
    // navigate user to view
  }

  return (
    <PageView className='px-6 flex flex-col gap-4' >
      <div>
        <div className='flex flex-row items-center gap-2' >
          <Users />
          <p className='text-lg font-bold' >Players</p>
        </div>
      </div>

      <div className='flex flex-row items-center gap-2 w-full h-[40px]' >
        <SearchInput />
      </div>

      <div>
        <RoundedCard
          className='flex cursor-pointer py-2 px-4 dark:border-none flex-row items-center gap-2 justify-between'
          onClick={handleViewAll}
        >
          <p className='text-sm' >View All Players</p>
          <div>
            <ArrowRight />
          </div>
        </RoundedCard>
      </div>

      <div className='flex flex-col gap-4' >
        <TopPositionPlayers
          positionClass='front-row'
          title='Front Row'
          showViewMoreButton
        />

        <TopPositionPlayers
          positionClass='back-row'
          title='Back Row'
          showViewMoreButton
        />

        <TopPositionPlayers
          positionClass='half-back'
          title='Half Back'
          showViewMoreButton
        />
      </div>

    </PageView>
  )
}
