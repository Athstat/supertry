import { X } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { comparePredictionsAtomGroup } from '../../../../state/comparePredictions.atoms';
import { usePredictionsCompareActions } from '../../../../hooks/usePredictionsCompare';
import { Sticky } from '../../../shared/Sticky';

export default function PredictionsScreenCompareStatus() {
  const isPicking = useAtomValue(comparePredictionsAtomGroup.isCompareModePredictionsPicking);
  const selectedUsers = useAtomValue(comparePredictionsAtomGroup.compareUsersAtom);
  const { removeUser, stopPicking } = usePredictionsCompareActions();

  if (!isPicking) return null;

  return (
    <Sticky className="">
      <div className="z-[70] fixed bottom-20 right-20 sm:right-24 md:right-24">
        <div className="flex flex-col bg-slate-200 dark:bg-slate-800/95 rounded-xl px-3 py-2 gap-2 max-w-[220px] shadow-lg shadow-black/30 ring-1 ring-black/30">
          <div className="flex flex-row items-center">
            <p className="text-xs font-medium truncate">Select to compare users</p>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex flex-row items-center max-h-20 overflow-x-auto overflow-y-hidden flex-wrap gap-1">
              {selectedUsers.map(u => {
                return (
                  <div
                    key={u.user_id}
                    onClick={() => removeUser(u)}
                    className="px-2 py-0.5 text-[10px] bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-lg flex flex-row items-center gap-0.5 flex-shrink-0"
                  >
                    <span className="truncate max-w-[80px]">{u.username}</span>
                    <X className="w-2.5 h-2.5 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Sticky>
  );
}
