import PageView from '../../components/ui/containers/PageView'
import SearchInput from '../../components/ui/forms/SearchInput'
import { Activity, Fragment } from 'react'
import PlayerSearchResults from '../../components/players/PlayerSearchResults'
import { useQueryState } from '../../hooks/web/useQueryState'
import { useNavigate } from 'react-router-dom'
import { useDebounced } from '../../hooks/web/useDebounced'
import PlayersTeamsGridList from '../../components/players/teams/PlayersTeamsGridList'
import PlayersCountryGridList from '../../components/players/nationality/PlayersCountryGridList'
import RoundedScreenHeader from '../../components/ui/containers/RoundedScreenHeader'
import PlayersIcon from '../../components/ui/icons/PlayersIcon'
import GridButton from '../../components/ui/buttons/GridButton'
import ScoutingIcon from '../../components/ui/icons/ScoutingIcon'
import { PositionClassesPitch } from '../../components/players/positioning/PositionClassesPitch'

export default function PlayersScreen() {

  const [searchQuery, setSearchQuery] = useQueryState<string | undefined>('query');
  const debouncedQuery = useDebounced(searchQuery, 500);


  return (
    <PageView className='flex flex-col gap-4' >

      <RoundedScreenHeader
        title='Players'
        leadingIcon={<PlayersIcon />}
        className='pb-6'
      >
        <div className='flex flex-row items-center gap-2 w-full h-[40px]' >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='Search players by name'
          />
        </div>
      </RoundedScreenHeader>



      <Activity mode={debouncedQuery ? "hidden" : "visible"} >
        <Content />
      </Activity>

      <Activity mode={debouncedQuery ? "visible" : "hidden"} >
        <PlayerSearchResults
          searchQuery={debouncedQuery}
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

  const handleViewScoutingList = () => {
    navigate(`/scouting/my-list`);
  }

  return (
    <Fragment>

      <div className='flex flex-row px-[3%] gap-8 items-center justify-between' >
        <GridButton
          lable='View All Players'
          icon={<PlayersIcon fill='#1196F5' height='40' width='40' />}
          className='flex-1 h-[90px]'
          onClick={handleViewAll}
        />

        <GridButton
          lable='My Scouting List'
          icon={<ScoutingIcon fill='#1196F5' width='40' height='40' />}
          className='flex-1 h-[90px]'
          onClick={handleViewScoutingList}
        />
      </div>

      <PositionClassesPitch />


      <PlayersTeamsGridList />
      <PlayersCountryGridList />
    </Fragment>
  )
}
