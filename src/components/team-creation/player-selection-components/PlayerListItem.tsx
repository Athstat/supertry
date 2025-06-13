import { twMerge } from "tailwind-merge";
import { Position } from "../../../types/position";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { formatPosition } from "../../../utils/athleteUtils";
import FormIndicator from "../../shared/FormIndicator";
import renderStatDots from "./renderStatDots";
import { useState } from "react";
import { WarningPopup } from "../../shared/WarningPopup";

type Props = {
    index?: number,
    handlePlayerSelect: (player: RugbyPlayer) => void,
    selectedPosition: Position,
    player: RugbyPlayer,
    onClose: () => void,
    handleViewPlayerProfile: (player: any, e: React.MouseEvent) => void
    remainingBudget: number
}

export default function PlayerListItem({
    handlePlayerSelect,
    selectedPosition,
    player,
    onClose,
    handleViewPlayerProfile,
    remainingBudget
}: Props) {

    const canAffordPlayer = player.price && (player.price <= remainingBudget);
    const cannotAfford = !canAffordPlayer;

    const [showWarning, setShowWarning] = useState(false);
    const toggleWarning = () => setShowWarning(!showWarning);

    const handleClickPlayer = () => {

        if (cannotAfford) {
            setShowWarning(true);
        } else {
            handlePlayerSelect(player);
            onClose();
        }
    }

    return (
        <>
            <div
                onClick={handleClickPlayer}
                className={twMerge(
                    "flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition",
                    cannotAfford && "opacity-40 bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                )}
            >
                {/* Player image/initials - hidden on mobile */}
                <div className="hidden sm:flex w-12 h-12 rounded-full bg-gray-300 items-center justify-center mr-4">
                    {player.image_url ? (
                        <img
                            src={player.image_url}
                            alt={player.player_name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-xs font-semibold">
                            {player.player_name?.charAt(0) || "?"}
                        </span>
                    )}
                </div>
                {/* Player info */}
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-start sm:items-center justify-between">
                        <div className="font-semibold flex flex-row gap-1 items-center text-sm leading-tight break-words sm:truncate dark:text-gray-100 max-w-[150px] sm:max-w-none">
                            {player.player_name} {player.form && player.form !== "NEUTRAL" && <FormIndicator form={player.form} />}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0 lg:flex-col" >
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {player.team_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatPosition(player.position || selectedPosition.name)}
                        </p>
                    </div>
                    <button
                        onClick={(e) => handleViewPlayerProfile(player, e)}
                        className="mt-1 text-blue-500 dark:text-blue-400 hover:underline transition-colors text-xs flex items-center"
                        aria-label="More player information"
                    >
                        <span className="mr-1">→</span>
                        <span>More Info</span>
                    </button>
                </div>
                {/* Price - always visible */}
                {/* {player.form && <div className="w-fit lg:w-12 flex flex-row items-center justify-end">
                    <FormIndicator form={player.form} />
                  </div>} */}
                {/*
                  {player.form !== undefined && (
                    <div className="w-fit lg:w-16 flex flex-row items-center justify-start">
                      <FormIndicator form={player.form} />
                    </div>
                  )} */}
                <div className="w-7 text-center">
                    <p className="font-bold text-sm dark:text-gray-200">
                        {player.price}
                    </p>
                </div>
                {/* Rating */}
                <div className="w-16 text-center">
                    <p className="text-sm dark:text-gray-200">
                        {(player.power_rank_rating || 0).toFixed(1)}
                    </p>
                </div>
                {/* Attack stat */}
                <div className="w-14 flex justify-center px-2">
                    {renderStatDots(player.ball_carrying || 0, "bg-red-500")}
                </div>
                {/* Defense stat */}
                <div className="w-14 flex justify-center px-2">
                    {renderStatDots(player.tackling || 0, "bg-blue-500")}
                </div>
                {/* Kicking stat */}
                <div className="w-14 flex justify-center px-2">
                    {renderStatDots(player.points_kicking || 0, "bg-green-500")}
                </div>
            </div>

            <WarningPopup
                open={showWarning}
                onClose={toggleWarning}
            >
                You can't afford <strong>{player.player_name}</strong> right not now with your remaining budget. Free up some coins and try again
            </WarningPopup>
        </>
    )
}

