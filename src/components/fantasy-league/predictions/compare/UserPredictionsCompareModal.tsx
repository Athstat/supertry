import DialogModal from '../../../shared/DialogModal';
import UserPredictionsCompareItem from './UserPredictionsCompareItem';
import { useAtomValue } from 'jotai';
import {
  compareUsersAtom,
  comparePredictionsAtomGroup,
} from '../../../../state/comparePredictions.atoms';
import EmptyUserCompareSlot from './EmptyUserCompareSlot';
import { twMerge } from 'tailwind-merge';
import { usePredictionsCompareActions } from '../../../../hooks/usePredictionsCompare';

type Props = {
  leagueId: string;
  roundId?: string;
};

export default function UserPredictionsCompareModal({ leagueId, roundId }: Props) {
  const selectedUsers = useAtomValue(compareUsersAtom);
  const open = useAtomValue(comparePredictionsAtomGroup.isCompareModePredictionsModal);

  const { closeCompareModal } = usePredictionsCompareActions();

  const userLen = selectedUsers.length;
  let title = `Comparing ${userLen} user${userLen === 1 ? '' : 's'}`;

  if (open === false) return;

  return (
    <DialogModal
      open={open}
      title={title}
      onClose={closeCompareModal}
      hw="w-[98%] lg:w-[85%] max-h-[98%] min-h-[98%] lg:max-h-[90%] lg:min-h-[90%]"
      outerCon="p-3 lg:p-6"
    >
      <div className={twMerge('flex flex-row gap-2 overflow-x-auto')}>
        {selectedUsers.map(user => {
          return (
            <UserPredictionsCompareItem
              user={user}
              key={user.user_id}
              leagueId={leagueId}
              roundId={roundId}
            />
          );
        })}

        <EmptyUserCompareSlot leagueId={leagueId} roundId={roundId} />
      </div>
    </DialogModal>
  );
}
