import { useSeasonTeams } from '../../hooks/seasons/useSeasonTeams'
import { SortDirection, SortField } from '../../types/playerSorting'
import { IProTeam } from '../../types/team'
import BottomSheetView from '../ui/modals/BottomSheetView'
import { PlayerFilters } from './PlayerFilters'
import { PlayerSort } from './PlayerSort'

type Props = {
    onClose?: () => void,
    isOpen?: boolean,
    positionFilter?: string,
    selectedTeam?: IProTeam,
    availablePositions: string[],
    handlePositionFilter: (newPos: string) => void,
    clearFilters: () => void,
    sortField: SortField,
    sortDirection: SortDirection,
    handleSortByField: (field: SortField, direction: SortDirection) => void,
    handleTeamFilter: (team: IProTeam) => void
}

/** Render Player List Filter Modal */
export default function PlayersListFilterModal({ isOpen, onClose, positionFilter, selectedTeam, availablePositions, clearFilters, sortDirection, sortField, handlePositionFilter, handleSortByField, handleTeamFilter }: Props) {

    const { teams: availableTeams } = useSeasonTeams();

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    }

    return (
        <BottomSheetView hideHandle className='max-h-[90vh]' onClickOutside={handleClose}>
            <PlayerFilters
                variant="inline"
                positionFilter={positionFilter ?? ''}
                teamFilter={selectedTeam}
                availablePositions={availablePositions}
                availableTeams={availableTeams}
                onPositionFilter={handlePositionFilter}
                onTeamFilter={handleTeamFilter}
                onClearFilters={clearFilters}
            />

            <PlayerSort
                variant="inline"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSortByField}
            />

        </BottomSheetView>
    )
}
