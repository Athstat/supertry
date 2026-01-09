import { ArrowLeftRight, Sparkles, X } from 'lucide-react';
import { useSticky } from '../../../hooks/web/useSticky';
import { Sticky } from '../../ui/containers/Sticky';
import { usePlayerCompareActions } from '../../../hooks/usePlayerCompare';
import RoundedCard from '../../ui/cards/RoundedCard';
import PrimaryButton from '../../ui/buttons/PrimaryButton';

export default function PlayersScreenCompareStatus() {
  
  const { removePlayer, stopPicking, showCompareModal, selectedPlayers, isPicking } = usePlayerCompareActions();
  const { sentinelRef } = useSticky<HTMLDivElement>();

  return (
    <div>
      <div ref={sentinelRef} />

      {isPicking && (
        <Sticky>
          <div className='fixed bottom-20 left-0 w-full' >
            <RoundedCard className="p-3 shadow-md left-0 mx-2 flex overflow-y-auto flex-col gap-4 dark:bg-slate-700 hover:dark:bg-slate-700">
              <div className="flex flex-row gap-2 items-center justify-between w-full">

                <div className="flex flex-row items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <p className="text-md w-fit font-medium">
                    Select Players to compare (Max 5)
                  </p>
                </div>

                <button onClick={stopPicking}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-row  items-center w-full gap-2 flex-wrap">
                {selectedPlayers.map(p => {
                  return (
                    <div
                      key={p.tracking_id}
                      onClick={() => removePlayer(p)}
                      className="px-3 py-1 text-[10px] bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                    >
                      {p.player_name}
                      <X className="w-3 h-3" />
                    </div>
                  );
                })}
              </div>

              <PrimaryButton
                className=" lg:w-[50%] text-xs flex flex-row items-center gap-1"
                onClick={showCompareModal}
              >
                Compare Players
                <ArrowLeftRight className="w-4 h-4" />
              </PrimaryButton>
            </RoundedCard>
          </div>
        </Sticky>
  )
}

    </div >
  );
}
