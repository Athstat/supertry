import { twMerge } from "tailwind-merge"
import { ScoutingListPlayer } from "../../types/fantasy/scouting"
import BottomSheetView from "../ui/BottomSheetView"
import { lighterDarkBlueCN } from "../../types/constants"
import { Binoculars, X } from "lucide-react"
import CircleButton from "../shared/buttons/BackButton"
import SmartPlayerMugshot from "../player/SmartPlayerMugshot"
import ScoutPlayerButton from "../player/profile-modal-components/ScoutPlayerButton"
import MatchPrCard from "../rankings/MatchPrCard"
import PlayerTeamCard from "../player/profile-modal-components/PlayerTeamCard"
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList"
import PrimaryButton from "../shared/buttons/PrimaryButton"
import QuickActionButton from "../ui/QuickActionButton"
import PlayerDataProvider, { usePlayerData } from "../../providers/PlayerDataProvider"
import PlayerPointsHistoryCard from "../player/profile-modal-components/PlayerPointsHistoryCard"
import RoundedCard from "../shared/RoundedCard"

type Props = {
    item: ScoutingListPlayer,
    isOpen?: boolean,
    onClose?: () => void,
    onRemove?: () => void,
    onViewProfile?: (player: ScoutingListPlayer) => void
}

export default function ScoutingListPlayerModal({ item, isOpen, onClose, onRemove, onViewProfile }: Props) {
    return (
        <PlayerDataProvider
            player={item.athlete}
            loadingFallback={<LoadingSkeleton onClose={onClose} item={item} />}
        >
            <Content
                item={item}
                isOpen={isOpen}
                onClose={onClose}
                onRemove={onRemove}
                onViewProfile={onViewProfile}
            />
        </PlayerDataProvider>
    )
}


function Content({ item, isOpen, onClose, onRemove, onViewProfile }: Props) {
    const { athlete } = item;
    const { removePlayer, isRemoving } = useScoutingList();
    const { currentSeason } = usePlayerData();

    const handleRemove = async () => {

        await removePlayer(athlete.tracking_id);

        if (onRemove) {
            onRemove();
        }
    }

    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(item);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            className={twMerge(
                "min-h-[70vh] p-4 flex flex-col gap-4",
                lighterDarkBlueCN
            )}
            hideHandle
            noAnimation
        >
            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p className="text-md font-semibold" >{item.athlete.player_name}</p>
                </div>

                <div>
                    <CircleButton
                        onClick={onClose}
                    >
                        <X />
                    </CircleButton>
                </div>
            </div>

            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-3" >
                    <SmartPlayerMugshot
                        url={athlete.image_url}
                        teamId={athlete.team_id}
                        className="w-16 h-16"
                        playerImageClassName="w-16 h-16"
                    />

                    <div className="flex flex-col" >
                        <p className="font-semibold" >{athlete.player_name}</p>
                        <ScoutPlayerButton
                            player={athlete}
                        />
                    </div>
                </div>

                <MatchPrCard
                    pr={athlete.power_rank_rating}
                />
            </div>

            <div>
                <QuickActionButton
                    onClick={handleViewProfile}
                >
                    View Full Profile
                </QuickActionButton>
            </div>


            <PlayerTeamCard
                player={athlete}
            />

            {currentSeason && <PlayerPointsHistoryCard
                player={item.athlete}
                season={currentSeason}
            />}

            <div className="flex flex-col gap-2" >
                <PrimaryButton
                    destroy
                    onClick={handleRemove}
                    isLoading={isRemoving}
                >
                    Stop Scouting Player
                </PrimaryButton>
            </div>


        </BottomSheetView>
    )
}

type LoadingSkeletonProps = {
    item: ScoutingListPlayer,
    onClose?: () => void
}

function LoadingSkeleton({ item, onClose }: LoadingSkeletonProps) {
    return (
        <BottomSheetView
            className={twMerge(
                "min-h-[70vh] p-4 flex flex-col gap-4",
                lighterDarkBlueCN
            )}
            hideHandle
        >
            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p className="text-md font-semibold" >{item.athlete.player_name}</p>
                </div>

                <div>
                    <CircleButton
                        onClick={onClose}
                    >
                        <X />
                    </CircleButton>
                </div>
            </div>

            <RoundedCard className="w-full bg-slate-200 border-none h-[100px] animate-pulse" />
            <RoundedCard className="w-full bg-slate-200 border-none h-[100px] mt-5 animate-pulse" />
            <RoundedCard className="w-full bg-slate-200 border-none h-[100px] animate-pulse" />
            <RoundedCard className="w-full bg-slate-200 border-none h-[100px] animate-pulse" />
            <RoundedCard className="w-full bg-slate-200 border-none h-[50px] mt-5 animate-pulse" />

        </BottomSheetView>
    )
}