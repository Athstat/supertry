import { ArrowRight, BicepsFlexed, Binoculars, Shield, Users, WandSparkles } from 'lucide-react'
import PageView from '../PageView'
import SearchInput from '../../components/shared/forms/SearchInput'
import RoundedCard from '../../components/shared/RoundedCard'
import PositionCard from '../../components/players/positioning/PositionCard'
import PlayersCountryGridList from '../../components/players/nationality/PlayersCountryGridList'
import { Activity, Fragment } from 'react'
import PlayerSearchResults from './PlayerSearchResults'
import { useQueryState } from '../../hooks/useQueryState'
import { PositionClass } from '../../types/athletes'
import { useNavigate } from 'react-router-dom'
import { FastForward } from 'lucide-react'
import { TrendingUpDown } from 'lucide-react'
import NewTag from '../../components/branding/NewTag'

export default function PlayersOverviewScreen() {

  const [searchQuery, setSearchQuery] = useQueryState<string | undefined>('query');


  return (
    <PageView className='px-6 flex flex-col gap-4' >
      <div>
        <div className='flex flex-row items-center gap-2' >
          <Users />
          <p className='text-lg font-bold' >Players</p>
        </div>
      </div>

      <div className='flex flex-row items-center gap-2 w-full h-[40px]' >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <Activity mode={searchQuery ? "hidden" : "visible"} >
        <Content />
      </Activity>

      <Activity mode={searchQuery ? "visible" : "hidden"} >
        <PlayerSearchResults
          searchQuery={searchQuery}
        />
      </Activity>

    </PageView>
  )
}


function Content() {

  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(`/players/all`);
  }

  const handlePositionCardClick = (positionClass: PositionClass) => {
    navigate(`/players/position-class/${positionClass}`);
  }

  return (
    <Fragment>
      <div className='flex flex-col gap-2' >

        <RoundedCard
          className='flex cursor-pointer py-3 px-4 dark:border-none flex-row items-center gap-2 justify-between'
          onClick={handleViewAll}
        >
          <p className='text-sm' >View All Players</p>
          <div>
            <ArrowRight />
          </div>
        </RoundedCard>


        <RoundedCard
          className='flex cursor-pointer py-3 px-4 dark:border-none flex-row items-center gap-2 justify-between'
          onClick={handleViewAll}
        >
          <div className='flex flex-row items-center gap-2' >
            <Binoculars />
            <p className='text-sm' >View Scouting List</p>
            <NewTag />
          </div>

          <ArrowRight />

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
          onClick={handlePositionCardClick}
          icon={<BicepsFlexed className='w-20 h-20 text-yellow-500' />}
        />

        <PositionCard
          positionClass='second-row'
          title='Second Row'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<TrendingUpDown className='w-20 h-20 text-yellow-500' />}
        />

        <PositionCard
          positionClass='back-row'
          title='Back Row'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<Shield className='w-20 h-20 text-red-500' />}
        />

        <PositionCard
          positionClass='half-back'
          title='Half Backs'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<WandSparkles className='w-20 h-20 text-green-500' />}
        />

        <PositionCard
          positionClass='back'
          title='Backs'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<FastForward className='w-20 h-20 text-blue-500' />}
        />
      </div>

      <div>
        <p className='font-bold text-md' >By Country</p>
      </div>

      <PlayersCountryGridList />
    </Fragment>
  )
}