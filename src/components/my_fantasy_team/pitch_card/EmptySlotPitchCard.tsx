import { CirclePlus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { formatPosition } from "../../../utils/athletes/athleteUtils";
import { useMyTeamActions } from "../../../hooks/fantasy/my_team/useMyTeamActions";

type EmptySlotProps = {
    slot: IFantasyLeagueTeamSlot;
};

/** Renders an empty slot card */
export function EmptySlotPitchCard({ slot }: EmptySlotProps) {
    const { initiateSwap } = useMyTeamActions();

    const { position } = slot;
    const { position_class } = position;

    const handleClick = () => {
        initiateSwap(slot);
    };

    const dataTutorial = slot.slotNumber === 1
        ? 'team-slot-1-empty'
        : slot.slotNumber === 2
          ? 'team-slot-2-empty'
          : undefined;

    return (
        <div className="flex flex-col items-center justify-center gap-1 relative" data-tutorial={dataTutorial}>
            <div
                className={twMerge(
                    'overflow-hidden flex flex-col items-center justify-center cursor-pointer rounded-lg min-h-[150px] max-h-[150px] min-w-[115px] max-w-[115px] ',
                    'md:min-h-[150px] md:max-h-[150px] md:min-w-[120px] md:max-w-[120px] flex flex-col'
                )}
                onClick={handleClick}
            >
                <div className="flex bg-gradient-to-br h-[120px] rounded-lg from-green-900 to-green-900/60 overflow-clip flex-col items-center justify-center w-full gap-2">
                    <div>
                        <CirclePlus className="w-10 text-white/90 h-10" />
                    </div>

                    <div>
                        <p className="text-sm text-white/90">
                            {position_class ? formatPosition(position_class) : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* <div className="min-h-[14px] max-h-[14px] w-full" >

            </div> */}

            <div className="min-h-[20px] px-2 flex flex-col items-center justify-center rounded-xl" >

            </div>
        </div>
    );
}
