import { ArrowRight, Users } from 'lucide-react'
import PageView from '../PageView'
import SearchInput from '../../components/shared/forms/SearchInput'
import RoundedCard from '../../components/shared/RoundedCard'
import PositionCard from '../../components/players/positioning/PositionCard'
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

      <div>
        <p className='font-bold text-md' >By Position</p>
      </div>

      <div className='grid grid-cols-2 gap-4' >
        <PositionCard
          positionClass='front-row'
          title='Front Row'
          showViewMoreButton
        />

        <PositionCard
          positionClass='second-row'
          title='Second Row'
          showViewMoreButton
        />

        <PositionCard
          positionClass='back-row'
          title='Back Row'
          showViewMoreButton
        />

        <PositionCard
          positionClass='half-back'
          title='Half Backs'
          showViewMoreButton
        />

        <PositionCard
          positionClass='back'
          title='Backs'
          showViewMoreButton
        />


      </div>

    </PageView>
  )
}
