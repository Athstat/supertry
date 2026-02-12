import { BicepsFlexed, Shield, WandSparkles } from 'lucide-react'
import PageView from '../../components/ui/containers/PageView'
import SearchInput from '../../components/ui/forms/SearchInput'
import RoundedCard from "../../components/ui/cards/RoundedCard"
import PositionCard from '../../components/players/positioning/PositionCard'
import { Activity, Fragment } from 'react'
import PlayerSearchResults from '../../components/players/PlayerSearchResults'
import { useQueryState } from '../../hooks/web/useQueryState'
import { PositionClass } from '../../types/athletes'
import { useNavigate } from 'react-router-dom'
import { FastForward } from 'lucide-react'
import { TrendingUpDown } from 'lucide-react'
import { useDebounced } from '../../hooks/web/useDebounced'
import PlayersTeamsGridList from '../../components/players/teams/PlayersTeamsGridList'
import PlayersCountryGridList from '../../components/players/nationality/PlayersCountryGridList'
import PlayersIcon from '../../components/ui/icons/PlayersIcon'
import IconCircle from '../../components/ui/icons/IconCircle'
import TextHeading from '../../components/ui/typography/TextHeading'
import ScoutingIcon from '../../components/ui/icons/ScoutingIcon'

export default function PlayersDashboardScreen() {

  const [searchQuery, setSearchQuery] = useQueryState<string | undefined>('query');
  const debouncedQuery = useDebounced(searchQuery, 500);


  return (
    <PageView className='flex flex-col px-0 gap-8 pb-2' >

      <div className='flex flex-col gap-4 rounded-b-[20px] pt-2 pb-5 px-4' >
        <div className='flex flex-row items-center gap-2 ' >

          <IconCircle>
            <PlayersIcon />
          </IconCircle>

          <TextHeading className='text-2xl font-bold' >Players</TextHeading>

        </div>

        <div className='flex flex-row items-center gap-2 w-full h-[40px]' >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='Search players by name'
          />
        </div>
      </div>

      <div className='flex flex-col gap-4 px-4' >
        <Activity mode={debouncedQuery ? "hidden" : "visible"} >
          <Content />
        </Activity>

        <Activity mode={debouncedQuery ? "visible" : "hidden"} >
          <PlayerSearchResults
            searchQuery={debouncedQuery}
          />
        </Activity>
      </div>

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

  const handleViewScoutingList = () => {
    navigate(`/scouting/my-list`);
  }

  return (
    <Fragment>
      <div className='flex flex-col gap-8' >

        <div className='flex flex-row items-center gap-2' >
          <RoundedCard
            className='flex flex-1 cursor-pointer py-3 px-4 dark:border-none flex-col items-center gap-2 justify-between'
            onClick={handleViewAll}
          >
            <p className='text-sm' >View All Players</p>

            <PlayersIcon lightFill='#1196F5' darkFill='#1196F5' />

          </RoundedCard>


          <RoundedCard
            className='flex flex-1 cursor-pointer py-3 px-4 dark:border-none flex-col items-center gap-2 justify-between'
            onClick={handleViewScoutingList}
          >

            <p className='text-sm' >View Scouting List</p>
            <ScoutingIcon lightFill='#1196F5' darkFill='#1196F5' />

          </RoundedCard>
        </div>

      </div>

      <div className='flex flex-col gap-4' >
        <div>
          <p className='font-bold text-md' >By Position</p>
        </div>

        <div className='grid grid-cols-2 gap-4 ' >
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
      </div>


      <PlayersTeamsGridList />
      <PlayersCountryGridList />
    </Fragment>
  )
}