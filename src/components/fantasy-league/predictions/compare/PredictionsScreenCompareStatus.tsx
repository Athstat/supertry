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
      <div className="z-[1000] bottom-32 fixed py-2 flex flex-col gap-1 w-full items-center justify-center left-0">
        <div className="flex flex-col bg-slate-200 gap-2 flex-wrap px-4 py-4 dark:bg-slate-800/95 rounded-xl w-[90%] lg:w-[50%]">
          <div className="flex flex-row items-center justify-between">
            <p className="truncate">Click to Select User</p>

            <button
              className="p-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-700"
              onClick={stopPicking}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row items-center max-h-24 overflow-x-auto flex-wrap gap-1">
              {selectedUsers.map(u => {
                return (
                  <div
                    key={u.user_id}
                    onClick={() => removeUser(u)}
                    className="px-3 py-1 text-xs bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                  >
                    {u.username}
                    <X className="w-3 h-3" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Sticky>
  );
}
