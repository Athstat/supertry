import { Binoculars } from "lucide-react";
import PageView from "../PageView";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import RoundedCard from "../../components/shared/RoundedCard";
import { ScoutingListPlayer } from "../../types/fantasy/scouting";

/** Renders scouting list screen */
export default function ScoutingListScreen() {

    const { list, loadingList } = useScoutingList();

    if (loadingList) {
        return (
            <PageView className="px-6 flex flex-col gap-4" >
                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p className="text-lg font-bold" >My Scouting List</p>
                </div>

                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
            </PageView>
        )
    }

    return (
        <PageView className="px-6 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" >
                <Binoculars />
                <p className="text-lg font-bold" >My Scouting List</p>
            </div>

            <div className="flex flex-col gap-2" >
                {list.map((si) => {
                    return <ScoutingListPlayerCard 
                        item={si}
                        key={si.athlete.tracking_id}
                    />
                })}
            </div>
        </PageView>
    )
}

type ItemProps = {
    item: ScoutingListPlayer
}

function ScoutingListPlayerCard({item} : ItemProps) {
    return (
        <RoundedCard>
            <div>
                
            </div>
            <p>{item.athlete.player_name}</p>
        </RoundedCard>
    )
}